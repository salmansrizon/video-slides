# /// script
# requires-python = ">=3.11,<3.12"
# dependencies = ["chatterbox-tts==0.1.2", "torch==2.6.0", "torchaudio==2.6.0", "safetensors", "soundfile",
#                 "huggingface_hub", "numpy", "mlx-whisper"]
# ///
"""Your own voice, cloned, reading a Deck's Script (Bangla Chatterbox, runs on this Mac).

  uv run tools/voice-deck.py ref                                   build voices/ref/ref-{a,b,c}.wav from voices/*.mp3
  uv run tools/voice-deck.py test [--out DIR]                      one test passage per reference + a scores table (JSON)
  uv run tools/voice-deck.py deck <synced script> <out.mp3> [--ref voices/ref/ref-a.wav]

Model: EMTIAZZ/chatterbox-bangla-tts (MIT), the fine-tuned T3 on Resemble AI's Chatterbox base. The generation loop is
the one in that Space's app.py (it avoids the watermarker and transformers' logits warpers), copied here.
Only the text sent to the model goes through voices/pronounce.tsv (English → Bangla letters); the Script stays as is.
Each sentence is checked by Whisper and regenerated (new seed, up to 3 tries) if it isn't heard right.
"""
import json, os, re, subprocess, sys, difflib, shutil
from pathlib import Path

os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")
import numpy as np, soundfile as sf, torch, torch.nn.functional as F
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download

ROOT = Path(__file__).resolve().parent.parent
VOICES = ROOT / "voices"
CACHE = Path.home() / ".cache" / "chatterbox-bangla"
DEVICE = os.environ.get("VOICE_DEVICE") or ("mps" if torch.backends.mps.is_available() else "cpu")   # VOICE_DEVICE=cpu to compare
SR = 24000
BASE = ["ve.safetensors", "t3_cfg.safetensors", "s3gen.safetensors", "conds.pt"]

# ---------- audio helpers ----------
def load(path, sr=16000):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, np.float32).copy()

def rms_frames(x, sr, hop=0.02):
    n = int(sr * hop); k = len(x) // n
    return np.sqrt((x[: k * n].reshape(k, n) ** 2).mean(1) + 1e-12), hop

def speech_mask(x, sr):
    r, hop = rms_frames(x, sr)
    thr = max(np.percentile(r, 30) * 2.5, 10 ** (-45 / 20))
    return r > thr, hop

def trim(x, sr, pad=0.05):
    m, hop = speech_mask(x, sr)
    if not m.any(): return x[:0]
    i = np.argmax(m); j = len(m) - np.argmax(m[::-1])
    return x[max(0, int((i * hop - pad) * sr)): int((j * hop + pad) * sr)]

def gaps(x, sr):
    """Silent stretches between speech, in seconds."""
    m, hop = speech_mask(x, sr); out, run = [], 0
    for v in m:
        if v:
            if run: out.append(run * hop)
            run = 0
        else: run += 1
    return [g for g in out if g >= 0.12]

def norm(x, target=-20.0):
    r = np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2) + 1e-12)
    y = x * (10 ** (target / 20) / r)
    return np.clip(y, -0.99, 0.99).astype(np.float32)

# ---------- 1. reference clips ----------
def best_window(x, sr, length=9.0):
    """The steadiest ~9 s: mostly speech with natural short pauses, even loudness, starting and ending in silence.
    Recordings differ, so the rules relax step by step until one window qualifies."""
    for lo, hi, edges in [(0.72, 0.93, True), (0.6, 0.96, True), (0.5, 1.0, False)]:
        got = _window(x, sr, length, lo, hi, edges)
        if got: return got
    raise SystemExit("no usable speech window found")

def _window(x, sr, length, lo, hi, edges):
    m, hop = speech_mask(x, sr); r, _ = rms_frames(x, sr)
    w = int(length / hop); best, score = None, -1e9
    for s in range(int(3 / hop), len(m) - w, int(0.5 / hop)):
        seg, rs = m[s:s + w], r[s:s + w]
        ratio = seg.mean()
        if not (lo <= ratio <= hi) or (edges and (seg[0] or seg[-1])): continue
        db = 20 * np.log10(rs[seg] + 1e-9)
        sc = ratio - np.std(db) / 20 - (np.abs(x[int(s * hop * sr): int((s + w) * hop * sr)]) > 0.98).mean() * 50
        if sc > score: best, score = (s * hop, (s + w) * hop), sc
    return best

def cmd_ref():
    files = sorted(VOICES.glob("*.mp3"))
    clips = []
    for f in files:
        x = load(f, SR); a, b = best_window(x, SR)
        clips.append((f.name, a, b, norm(x[int(a * SR): int(b * SR)])))
        print(f"{f.name}: {a:.1f}–{b:.1f} s")
    out = VOICES / "ref"; out.mkdir(exist_ok=True)
    gap = np.zeros(int(0.35 * SR), np.float32); info = {}
    for k, name in zip(range(3), "abc"):   # each variant opens with a different file's clip (the opening sets the style)
        order = clips[k:] + clips[:k]
        sf.write(out / f"ref-{name}.wav", np.concatenate([c for _, _, _, c in order for c in (c, gap)]), SR)
        info[f"ref-{name}"] = [f"{n} {a:.1f}-{b:.1f}s" for n, a, b, _ in order]
    (out / "ref.json").write_text(json.dumps(info, indent=2, ensure_ascii=False))
    print(json.dumps(info, indent=2, ensure_ascii=False))

# ---------- 2. the model ----------
_tts = None
def model():
    global _tts
    if _tts: return _tts
    from chatterbox.tts import ChatterboxTTS
    from chatterbox.models.t3.t3 import T3
    CACHE.mkdir(parents=True, exist_ok=True)
    for f in BASE:   # hf_hub_download resumes broken downloads and checks them; copy next to the tokenizer
        if not (CACHE / f).exists():
            print(f"downloading {f} …", flush=True)
            shutil.copy(hf_hub_download("ResembleAI/chatterbox", f), CACHE / f)
    shutil.copy(hf_hub_download("EMTIAZZ/chatterbox-bangla-tts", "tokenizer.json"), CACHE / "tokenizer.json")
    weights = hf_hub_download("EMTIAZZ/chatterbox-bangla-tts", "t3_bangla_888k.safetensors")
    import perth   # its watermarker doesn't load on macOS; this tool never applies it (the Space skips it too)
    if perth.PerthImplicitWatermarker is None: perth.PerthImplicitWatermarker = getattr(perth, "DummyWatermarker", None) or (lambda: None)
    tts = ChatterboxTTS.from_local(str(CACHE), device="cpu")
    hp = tts.t3.hp; hp.text_tokens_dict_size = 4240
    t3 = T3(hp=hp); sd = load_file(weights, device="cpu")
    if any(k.startswith("t3.") for k in sd): sd = {k[3:]: v for k, v in sd.items() if k.startswith("t3.")}
    t3.load_state_dict(sd, strict=True)
    tts.t3 = t3.to(DEVICE).eval(); tts.s3gen.to(DEVICE).eval(); tts.ve.to(DEVICE).eval(); tts.device = DEVICE
    _tts = tts; return tts

def _t3(t3, cond, text_tokens, max_new_tokens=1000, temperature=0.3, cfg_weight=0.5, repetition_penalty=1.2, min_p=0.05):
    from chatterbox.models.t3.inference.t3_hf_backend import T3HuggingfaceBackend
    text_tokens = torch.atleast_2d(text_tokens).to(dtype=torch.long, device=t3.device)
    embeds, _ = t3.prepare_input_embeds(t3_cond=cond, text_tokens=text_tokens,
                                        speech_tokens=t3.hp.start_speech_token * torch.ones_like(text_tokens[:, :1]), cfg_weight=cfg_weight)
    if not getattr(t3, "compiled", False):
        t3.patched_model = T3HuggingfaceBackend(config=t3.cfg, llama=t3.tfmr, speech_enc=t3.speech_emb,
                                                speech_head=t3.speech_head, alignment_stream_analyzer=None)
        t3.compiled = True
    bos = torch.tensor([[t3.hp.start_speech_token]], dtype=torch.long, device=embeds.device)
    be = t3.speech_emb(bos) + t3.speech_pos_emb.get_fixed_embedding(0)
    out = t3.patched_model(inputs_embeds=torch.cat([embeds, torch.cat([be, be])], 1), past_key_values=None, use_cache=True,
                           output_attentions=False, output_hidden_states=True, return_dict=True)
    past, gen, pred = out.past_key_values, bos.clone(), []
    for step in range(max_new_tokens):
        lg = out.logits[:, -1, :]
        lg = lg[0:1] + cfg_weight * (lg[0:1] - lg[1:2])
        for t in gen[0].unique():
            i = t.item()
            if i < lg.size(-1): lg[0, i] = lg[0, i] * repetition_penalty if lg[0, i] < 0 else lg[0, i] / repetition_penalty
        lg = lg / temperature
        p = torch.softmax(lg, -1); lg = lg.masked_fill(p < min_p * p.max(-1, keepdim=True).values, float("-inf"))
        nxt = torch.multinomial(torch.softmax(lg, -1), 1)
        pred.append(nxt); gen = torch.cat([gen, nxt], 1)
        if nxt.item() == t3.hp.stop_speech_token: break
        e = t3.speech_emb(nxt) + t3.speech_pos_emb.get_fixed_embedding(step + 1)
        out = t3.patched_model(inputs_embeds=torch.cat([e, e]), past_key_values=past, use_cache=True,
                               output_attentions=False, output_hidden_states=True, return_dict=True)
        past = out.past_key_values
    return torch.cat(pred, 1)

_ref_loaded = None
LEAD = "আচ্ছা,"   # the model swallows the first word or two of a sentence, so it gets a throwaway word to swallow

def say(text, ref, seed=0, lead=True):
    """One sentence → float32 waveform at 24 kHz, edges trimmed. With lead, a throwaway word goes first and is cut
    off again at the start of the second word Whisper hears."""
    if lead:
        w = say(f"{LEAD} {text}", ref, seed, lead=False)
        words = heard_words(w)
        if len(words) >= 2:
            return trim(w[int(max(0, words[1]["start"] - 0.06) * SR):], SR)
        return w
    global _ref_loaded
    from chatterbox.tts import punc_norm
    from chatterbox.models.s3tokenizer import drop_invalid_tokens
    tts = model()
    if _ref_loaded != str(ref): tts.prepare_conditionals(str(ref), exaggeration=0.5); _ref_loaded = str(ref)
    torch.manual_seed(seed); np.random.seed(seed)
    tok = tts.tokenizer.text_to_tokens(punc_norm(text)).to(DEVICE)
    tok = torch.cat([tok, tok], 0)
    tok = F.pad(F.pad(tok, (1, 0), value=tts.t3.hp.start_text_token), (0, 1), value=tts.t3.hp.stop_text_token)
    with torch.inference_mode():
        sp = drop_invalid_tokens(_t3(tts.t3, tts.conds.t3, tok)[0])
        sp = sp[sp < 6561].to(DEVICE)
        wav, _ = tts.s3gen.inference(speech_tokens=sp, ref_dict=tts.conds.gen)
    return trim(wav.squeeze(0).detach().cpu().numpy().astype(np.float32), SR)

# ---------- 3. checks ----------
BN = re.compile(r"[ঀ-৿]")
def letters(s): return "".join(BN.findall(s))

def heard_words(wav):
    import mlx_whisper
    tmp = CACHE / "check.wav"; sf.write(tmp, wav, SR)
    r = mlx_whisper.transcribe(str(tmp), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="bn",
                               condition_on_previous_text=False, word_timestamps=True)
    return [w for seg in r["segments"] for w in seg.get("words", [])]

def heard(wav):
    import mlx_whisper
    tmp = CACHE / "check.wav"; sf.write(tmp, wav, SR)
    r = mlx_whisper.transcribe(str(tmp), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="bn",
                               condition_on_previous_text=False)
    return r["text"].strip()

def match(said, text):
    """0..1: how much of the intended Bangla letters Whisper heard (English words are spelled in Bangla before this)."""
    a, b = letters(said), letters(text)
    return difflib.SequenceMatcher(None, a, b).ratio() if b else 1.0

_mine = None
def voice_sim(wav):
    """Cosine similarity of Chatterbox's voice embedding to the mean of your four recordings (same encoder the model clones with)."""
    global _mine
    tts = model()
    emb = lambda w: torch.from_numpy(tts.ve.embeds_from_wavs([w], sample_rate=16000)).float().mean(0)
    to16 = lambda w, sr: np.interp(np.arange(0, len(w), sr / 16000), np.arange(len(w)), w).astype(np.float32)
    if _mine is None:
        _mine = torch.stack([emb(load(f, 16000)[: 16000 * 60]) for f in sorted(VOICES.glob("*.mp3"))]).mean(0)
    e = emb(to16(wav, SR))
    return float(F.cosine_similarity(e, _mine, dim=0))

def pace(wav, text):
    m, hop = speech_mask(wav, SR)
    return len(letters(text)) / max(0.1, m.sum() * hop)

# ---------- pronunciation (text sent to the model only) ----------
def pronounce(text):
    p = VOICES / "pronounce.tsv"
    if p.exists():
        rules = [l.split("\t") for l in p.read_text().splitlines() if "\t" in l and not l.startswith("#")]
        for a, b in sorted(rules, key=lambda r: -len(r[0])):   # longest first: "Context Window" before "Context"
            text = re.sub(rf"(?<![A-Za-z]){re.escape(a)}(?![A-Za-z])", b, text, flags=re.I)
    return text

def sentences(text):
    return [s.strip() for s in re.split(r"(?<=[।?!.])\s+", text.strip()) if letters(s) or re.search(r"[A-Za-z0-9০-৯]", s)]

def best_take(text, ref, tries=3, bar=0.8):
    best = None
    for seed in range(tries):
        w = say(text, ref, seed); h = heard(w); m = match(h, text)
        if not best or m > best[1]: best = (w, m, h)
        if m >= bar: break
    return best

# ---------- 4. test ----------
TEST = ("AI-এর সামনে একটা বড় টেবিল আছে, এর নাম Context Window। প্রতি দফায় ৫০০ Token হলে, বিশ নম্বর প্রশ্নে AI পড়ছে দশ হাজার Token। "
        "কনটেক্সট উইন্ডো যত বড়ই হোক, একসময় সেটা ভরবে। প্রতি দফায় পাঁচশো টোকেন হলে খরচও বাড়ে। "
        "তাই নতুন বিষয় হলে নতুন chat খুলুন, আর জরুরি তথ্য রাখুন শুরুতে বা শেষে।")

def cmd_test(out):
    out.mkdir(parents=True, exist_ok=True); rows = []
    mine = {f.name: pace_of_recording(f) for f in sorted(VOICES.glob("voice_[34].mp3"))}
    for ref in sorted((VOICES / "ref").glob("ref-*.wav")):
        parts, checks = [], []
        for s in sentences(TEST):
            w, m, h = best_take(pronounce(s), ref, tries=1)
            parts += [w, np.zeros(int(0.3 * SR), np.float32)]; checks.append({"text": s, "sent": pronounce(s), "heard": h, "match": round(m, 3)})
        wav = norm(np.concatenate(parts)); sf.write(out / f"{ref.stem}.wav", wav, SR)
        rows.append({"ref": ref.stem, "voice_similarity": round(voice_sim(wav), 3),
                     "word_match": round(float(np.mean([c["match"] for c in checks])), 3),
                     "pace_letters_per_s": round(pace(wav, pronounce(TEST)), 2), "sentences": checks})
        print(json.dumps({k: v for k, v in rows[-1].items() if k != "sentences"}, ensure_ascii=False), flush=True)
    rep = {"your_pace_letters_per_s": mine, "results": rows}
    (out / "report.json").write_text(json.dumps(rep, indent=2, ensure_ascii=False)); print(f"report: {out / 'report.json'}")

def pace_of_recording(f):
    """voice_3 / voice_4 read known Scripts, so their pace can be measured; returns letters per second of speech."""
    script = {"voice_3.mp3": ROOT / "scripts/ai-coding-unattended.txt", "voice_4.mp3": ROOT / "scripts/context-window-rag.txt"}[f.name]
    x = load(f, 16000); m, hop = speech_mask(x, 16000)
    return round(len(letters(script.read_text())) / (m.sum() * hop), 2)

# ---------- 5. a whole Deck ----------
def scenes(synced):
    out = []
    for block in re.split(r"^## S\d+[^\n]*\n", Path(synced).read_text(), flags=re.M)[1:]:
        vo = block.split("**VO:**", 1)[1] if "**VO:**" in block else ""
        lines = [l for l in vo.strip().splitlines() if l.strip() and not l.lstrip().startswith(("[", "("))]
        out.append(re.sub(r"▶\d+\s*", "", " ".join(lines)))
    return out

def cmd_deck(synced, out_mp3, ref):
    x3, x4 = load(VOICES / "voice_3.mp3", 16000), load(VOICES / "voice_4.mp3", 16000)
    g = np.array(gaps(x3, 16000) + gaps(x4, 16000))
    short, long_ = float(np.median(g[g < 0.9])), float(np.percentile(g, 95))
    target = np.mean([pace_of_recording(VOICES / "voice_3.mp3"), pace_of_recording(VOICES / "voice_4.mp3")])
    print(f"your pauses: sentence {short:.2f} s, Slide {long_:.2f} s · your pace {target:.2f} letters/s", flush=True)
    parts, log, flagged = [], [], []
    sc = scenes(synced); total = sum(len(sentences(s)) for s in sc); n = 0
    for i, scene in enumerate(sc, 1):
        for s in sentences(scene):
            n += 1; w, m, h = best_take(pronounce(s), ref)
            parts += [w, np.zeros(int(short * SR), np.float32)]
            log.append({"slide": i, "text": s, "heard": h, "match": round(m, 3)})
            if m < 0.8: flagged.append(log[-1])
            print(f"[{n}/{total}] S{i} match {m:.2f}  {s[:50]}", flush=True)
        parts.append(np.zeros(int(max(0, long_ - short) * SR), np.float32))
    wav = norm(np.concatenate(parts))
    got = pace(wav, pronounce(" ".join(sc))); ratio = got / target
    tmp = Path(out_mp3).with_suffix(".raw.wav"); sf.write(tmp, wav, SR)
    tempo = 1 / ratio if abs(ratio - 1) > 0.10 else 1.0   # >10 % off your pace: stretch, pitch unchanged
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", f"atempo={tempo:.3f},loudnorm=I=-16:TP=-1.5",
                    "-ar", "44100", "-b:a", "192k", str(out_mp3)], check=True); tmp.unlink()
    rep = {"ref": str(ref), "pace_generated": round(got, 2), "pace_yours": round(target, 2), "tempo_applied": round(tempo, 3),
           "sentences": len(log), "flagged": flagged, "log": log}
    Path(out_mp3).with_suffix(".voice.json").write_text(json.dumps(rep, indent=2, ensure_ascii=False))
    print(f"wrote {out_mp3} · {len(flagged)} sentences to check by ear (see {Path(out_mp3).with_suffix('.voice.json').name})")

if __name__ == "__main__":
    a = sys.argv[1:]
    flag = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if not a: print(__doc__); sys.exit(2)
    if a[0] == "ref": cmd_ref()
    elif a[0] == "test": cmd_test(Path(flag("--out", "/tmp/voice-test")))
    elif a[0] == "deck": cmd_deck(a[1], a[2], Path(flag("--ref", str(VOICES / "ref" / "ref-a.wav"))))
    else: print(__doc__); sys.exit(2)
