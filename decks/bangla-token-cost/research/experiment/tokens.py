"""Experiment for the Talk "বাংলায় ChatGPT কেন বেশি খরচ করে?"

Counts tokens for the same 1012 professionally translated sentences (FLORES-200 devtest, eng_Latn vs ben_Beng)
under real tokenizers, and reports how many more tokens Bangla needs than English (the "token premium").

Usage (data stays outside the repo; see README.md in this folder):
  python -I tokens.py <flores200_dataset dir> <tokenizer dir> <out dir>
Writes results.json and example.json to <out dir>.
"""
import json
import sys
import unicodedata
from pathlib import Path

import tiktoken
from tokenizers import Tokenizer
from tokenizers.implementations import BertWordPieceTokenizer

flores, tokdir, out = (Path(p) for p in sys.argv[1:4])


def clean(line: str) -> str:
    # Some FLORES lines carry CSV quoting ("..."" ..."): unwrap it so both languages are compared on the same text.
    line = line.rstrip("\n")
    if len(line) > 1 and line[0] == '"' and line[-1] == '"':
        line = line[1:-1].replace('""', '"')
    return unicodedata.normalize("NFC", line)


eng = [clean(l) for l in (flores / "devtest/eng_Latn.devtest").open(encoding="utf-8")]
ben = [clean(l) for l in (flores / "devtest/ben_Beng.devtest").open(encoding="utf-8")]
assert len(eng) == len(ben) == 1012

# name -> (who uses it, encode function returning a list of tokens)
tok = {}
for enc, used_by in [("gpt2", "GPT-2 / GPT-3 (2019–2020)"), ("cl100k_base", "GPT-3.5, GPT-4 (2023)"), ("o200k_base", "GPT-4o and later (2024–)")]:
    e = tiktoken.get_encoding(enc)
    tok[enc] = (used_by, lambda s, e=e: e.encode(s, disallowed_special=()))
for name, file, used_by in [
    ("qwen2.5", "Qwen_Qwen2.5-7B-Instruct.json", "Qwen 2.5 (open model, Alibaba)"),
    ("mistral-nemo", "mistralai_Mistral-Nemo-Instruct-2407.json", "Mistral Nemo (open model)"),
    ("sarvam-1", "sarvamai_sarvam-1.tokenizer.json", "Sarvam-1 (LLM built for Indian languages)"),
    ("indicbert-v2", "ai4bharat_IndicBERTv2-MLM-only.tokenizer.json", "IndicBERT v2 (Indic languages, AI4Bharat)"),
]:
    t = Tokenizer.from_file(str(tokdir / file))
    tok[name] = (used_by, lambda s, t=t: t.encode(s, add_special_tokens=False).ids)
bb = BertWordPieceTokenizer(str(tokdir / "csebuetnlp_banglabert.vocab.txt"), lowercase=False, strip_accents=False)
tok["banglabert"] = ("BanglaBERT (trained on Bangla, BUET)", lambda s: bb.encode(s, add_special_tokens=False).ids)

words = lambda lines: sum(len(l.split()) for l in lines)
res = {"dataset": "FLORES-200 devtest, 1012 parallel sentences", "eng_words": words(eng), "ben_words": words(ben),
       "eng_chars": sum(map(len, eng)), "ben_chars": sum(map(len, ben)), "tokenizers": {}}
for name, (used_by, f) in tok.items():
    te, tb = sum(len(f(s)) for s in eng), sum(len(f(s)) for s in ben)
    res["tokenizers"][name] = {"used_by": used_by, "eng_tokens": te, "ben_tokens": tb, "premium": round(tb / te, 2),
                               "eng_tokens_per_word": round(te / res["eng_words"], 2), "ben_tokens_per_word": round(tb / res["ben_words"], 2)}

# One short pair for the slides: how o200k_base and cl100k_base cut it up.
i = 103  # devtest line 104: short, and the Bangla is a faithful translation (several short pairs are not)
example = {"index": i, "eng": eng[i], "ben": ben[i], "pieces": {}}
for enc in ("cl100k_base", "o200k_base"):
    e = tiktoken.get_encoding(enc)
    for lang, s in (("eng", eng[i]), ("ben", ben[i])):
        ids = e.encode(s)
        text, offsets = e.decode_with_offsets(ids)
        # Character span each token starts at; byte-level tokens inside one Bangla letter share an offset.
        example["pieces"][f"{enc}/{lang}"] = {"tokens": len(ids), "starts": offsets}

out.mkdir(parents=True, exist_ok=True)
(out / "results.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
(out / "example.json").write_text(json.dumps(example, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{'tokenizer':14} {'eng':>7} {'ben':>7} {'premium':>8}  used by")
for name, r in res["tokenizers"].items():
    print(f"{name:14} {r['eng_tokens']:7} {r['ben_tokens']:7} {r['premium']:7}x  {r['used_by']}")
print("example:", example["eng"], "|", {k: v["tokens"] for k, v in example["pieces"].items()})
