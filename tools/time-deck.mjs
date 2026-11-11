// Times a voiced Deck: finds where each Slide and each Cue is spoken in the voiceover, writes data-at / data-auto on the Slides.
//   node tools/time-deck.mjs decks/my-video/index.html [--lang bn] [--cut 0.3] [--lead 0.1] [--dry]
// The spoken text and its Cues (▶1, ▶2 …) come from the Deck's Notes; the audio is the Deck's <audio data-vo>.
// Needs ffmpeg and uv (runs mlx-whisper on this Mac; nothing is uploaded; first run downloads a 1.6 GB model).
// How: every Slide and Cue opens a sentence, so it starts where a pause ends. Each one is given a pause so that, together,
//   - the stretch between two neighbours lasts about as long as its text takes to say (a voice keeps a steady pace,
//     plus a breath at each punctuation mark),
//   - it agrees with where the recogniser heard its word, when it heard it, and
//   - longer pauses are preferred (a new sentence gets a longer breath than a comma).
// The recogniser misspells Bangla, and on a long file it skips whole half-minutes, so the audio goes to it in pieces of
// at most 25 s cut at pauses (kept in the temp folder: a second run is instant).
//   --cut   a Slide appears this long before its first word (never earlier than the middle of the pause before it)
//   --lead  a Step starts this long before its Cue word
// Prints one row per Slide and Cue with the pace of the stretch before it. Rows marked ? have an odd pace or no heard word:
// check those by ear. Exit 1 if two times collide.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2), deckPath = args.find((a, i) => !a.startsWith('--') && !/^--(lang|cut|lead)$/.test(args[i - 1]));
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
if (!deckPath) { console.log('Usage: node tools/time-deck.mjs <deck index.html> [--lang bn] [--cut 0.3] [--lead 0.1] [--dry]'); process.exit(2); }
const cut = +flag('cut', 0.3), lead = +flag('lead', 0.1), die = m => { console.error(`error: ${m}`); process.exit(1); };
// Compared by sound, not spelling: the recogniser writes Bangla as it hears it (শ/ষ/স, ণ/ন, য/জ, ি/ী, ু/ূ, dropped hasanta).
const norm = s => s.toLowerCase().normalize('NFD').replace(/[^\p{L}\p{M}\p{N}]/gu, '')
  .replace(/[ডঢ]়/g, 'র').replace(/[শষ]/g, 'স').replace(/ণ/g, 'ন').replace(/য(?!়)/g, 'জ').replace(/ী/g, 'ি').replace(/ূ/g, 'ু')
  .replace(/[ঁ্]/g, '');

// --- Notes: one token per spoken word; anchors mark the first word of each Slide (cue 0) and the word after each ▶n.
const html = readFileSync(deckPath, 'utf8'), tokens = [], said = [], anchors = [];
[...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].forEach((m, slide) => {
  const notes = [...(m[0].match(/<aside class="notes">([\s\S]*?)<\/aside>/)?.[1] || '').matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map(p => p[1].replace(/\[[^\]]*\]|\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ')).join(' ');   // [screen] and (presenter) notes aren't spoken
  let pending = 0, begun = false;
  for (const raw of notes.split(/[\s—–]+/)) {
    const cue = raw.match(/^▶(\d+)$/);
    if (cue) { pending = +cue[1]; continue; }
    if (!norm(raw)) continue;
    if (!begun) anchors.push({ slide, cue: 0, token: tokens.length });
    if (pending) anchors.push({ slide, cue: pending, token: tokens.length });
    begun = true; pending = 0;
    tokens.push(norm(raw)); said.push(raw);
  }
});
const N = tokens.length, before = [0];   // before[i]: letters spoken before token i
tokens.forEach((t, i) => { before[i + 1] = before[i] + t.length; });

// --- The pauses in the audio, then the recognised words, piece by piece.
const audio = html.match(/<audio\b[^>]*\bdata-vo\b[^>]*>/)?.[0].match(/\bsrc="([^"]+)"/)?.[1];
if (!audio) die('the Deck has no <audio data-vo src="...">');
const audioPath = resolve(dirname(deckPath), audio);
const log = spawnSync('ffmpeg', ['-hide_banner', '-i', audioPath, '-af', 'silencedetect=noise=-38dB:d=0.2', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]), ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
const length = +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audioPath], { encoding: 'utf8' }).stdout;
// pauses[0] is where the first word starts: 0, or the end of the silence the audio opens with.
let lead0 = 0;
if (starts[0] <= 0.05) { lead0 = ends.shift(); starts.shift(); }
const pauses = [{ s: 0, e: lead0 }, ...ends.map((e, i) => ({ s: Math.max(0, starts[i]), e })).filter(p => p.e > 0.3 && p.e < length - 0.3)];

const cuts = [0];   // each piece ends in the middle of the last pause within 25 s
while (length - cuts.at(-1) > 25) {
  const mids = pauses.map(p => (p.s + p.e) / 2).filter(m => m > cuts.at(-1) + 5 && m <= cuts.at(-1) + 25);
  cuts.push(mids.at(-1) ?? cuts.at(-1) + 25);
}
const stat = statSync(audioPath), cache = join(tmpdir(), 'deck-time', `${stat.size}-${Math.round(stat.mtimeMs)}-${flag('lang', 'bn')}`), words = [];
mkdirSync(cache, { recursive: true });
cuts.forEach((from, c) => {
  const name = `piece${String(c).padStart(3, '0')}`, json = join(cache, `${name}.json`);
  if (!existsSync(json)) {
    // ponytail: one mlx_whisper start per piece (~15 s each). Its CLI names every output after the first file, so pieces
    // can't share a run; call its Python API in one process if the wait matters.
    process.stderr.write(`\rlistening ${c + 1}/${cuts.length} `);
    spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', from, '-t', (cuts[c + 1] ?? length) - from, '-i', audioPath, '-ac', '1', '-ar', '16000', join(cache, `${name}.wav`)].map(String));
    const r = spawnSync('uvx', ['--python', '3.12', '--from', 'mlx-whisper', 'mlx_whisper', join(cache, `${name}.wav`), '--model', 'mlx-community/whisper-large-v3-turbo',
      '--language', flag('lang', 'bn'), '--word-timestamps', 'True', '--no-speech-threshold', '1', '--condition-on-previous-text', 'False',
      '--output-format', 'json', '--output-dir', cache, '--output-name', name], { encoding: 'utf8' });
    if (r.status !== 0 || !existsSync(json)) die(`mlx_whisper failed on ${name}\n${r.stderr?.slice(-400)}`);
  }
  for (const w of JSON.parse(readFileSync(json, 'utf8')).segments.flatMap(s => s.words || []))
    if (norm(w.word)) words.push({ text: norm(w.word), start: w.start + from, end: w.end + from });
});
process.stderr.write('\n');

// --- Match Notes and transcript as two whole sequences (Needleman-Wunsch): same word +3, similar +1, different -1, skipped -1.
const lev = (a, b) => {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
};
const alike = (a, b) => a === b ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length);
const M = words.length, W = M + 1, score = new Int32Array((N + 1) * W), from = new Uint8Array((N + 1) * W);
for (let j = 1; j <= M; j++) { score[j] = -j; from[j] = 2; }
for (let i = 1; i <= N; i++) {
  score[i * W] = -i; from[i * W] = 1;
  for (let j = 1; j <= M; j++) {
    const a = alike(tokens[i - 1], words[j - 1].text);
    const d = score[(i - 1) * W + j - 1] + (a === 1 ? 3 : a >= 0.5 ? 1 : -1), u = score[(i - 1) * W + j] - 1, l = score[i * W + j - 1] - 1;
    const best = Math.max(d, u, l);
    score[i * W + j] = best; from[i * W + j] = best === d ? 0 : best === u ? 1 : 2;
  }
}
const heard = new Array(N).fill(null);   // token -> { word index, how alike }
for (let i = N, j = M; i > 0 || j > 0;) {
  const f = from[i * W + j];
  if (f === 0) { heard[i - 1] = { j: j - 1, a: alike(tokens[i - 1], words[j - 1].text) }; i--; j--; } else if (f === 1) i--; else j--;
}
for (const a of anchors) {   // a misheard word still sits in the right place when its neighbours were heard
  const near = heard.slice(Math.max(0, a.token - 2), a.token + 4).filter(h => h?.a >= 0.5).length;
  a.word = heard[a.token] && near >= 2 ? words[heard[a.token].j] : null;
}

// --- Give every anchor a pause (Viterbi). The recogniser tends to start a word inside the silence before it,
// so a pause ending up to 0.6 s after the word's start still agrees with it.
// due[i]: when token i would start at an even pace, with the audio's total pause time shared out over the punctuation marks.
const pace = before[N] / length, K = anchors.length, rest = pauses.reduce((sum, p) => sum + p.e - p.s, 0);
const stop = raw => /[।?!:;,.]["”’')]*$/.test(raw), marks = said.filter(stop).length || 1, due = [0];
said.forEach((raw, i) => { due[i + 1] = due[i] + tokens[i].length * (length - rest) / before[N] + (stop(raw) ? rest / marks : 0); });
const span = (want, dt) => ((dt - want) / (0.2 * want + 0.6)) ** 2;
const hear = (a, t) => a.word ? Math.min(Math.max(0, a.word.start - 0.3 - t, t - a.word.start - 0.6) / 0.5, 2) ** 2 : 0;
let cost = pauses.map((_, x) => x ? Infinity : 0);
const back = [];
for (let k = 1; k < K; k++) {
  const want = due[anchors[k].token] - due[anchors[k - 1].token], next = [], via = [];
  pauses.forEach((p, x) => {
    next[x] = Infinity;
    for (let y = 0; y <= x; y++) { const v = cost[y] + span(want, p.e - pauses[y].e); if (v < next[x]) { next[x] = v; via[x] = y; } }
    next[x] += hear(anchors[k], p.e) - 2 * (p.e - p.s);
  });
  back[k] = via; cost = next;
}
cost = cost.map((c, x) => c + span(due[N] - due[anchors[K - 1].token], length - pauses[x].e));
for (let k = K - 1, x = cost.indexOf(Math.min(...cost)); k >= 0; x = back[k--]?.[x]) Object.assign(anchors[k], { pause: pauses[x], t: pauses[x].e });
anchors.forEach((a, k) => {
  const prev = anchors[k - 1], next = anchors[k + 1], off = (b, c) => b && c && Math.abs(Math.log((c.t - b.t) / (due[c.token] - due[b.token]))) > 0.4;
  a.pace = k ? (before[a.token] - before[prev.token]) / (a.t - prev.t) : pace;
  a.odd = off(prev, a) || off(a, next);   // a stretch a third shorter or half longer than its text
  a.sure = !a.odd && !!a.word && hear(a, a.t) === 0;
});

// --- Slide and Step times, then into the Deck.
let n = -1, last = -1, bad = 0;
const out = html.replace(/<section\b([^>]*)>/g, (_, attrs) => {
  n++;
  const mine = anchors.filter(a => a.slide === n).sort((a, b) => a.cue - b.cue), first = mine[0];
  if (!first) return `<section${attrs}>`;
  const at = n === 0 ? 0 : Math.max(first.t - cut, (first.pause.s + first.pause.e) / 2);
  const steps = mine.slice(1).map(a => a.t - lead - at);
  [at, ...steps.map(s => s + at)].forEach((t, k) => {
    const a = mine[k], wrong = t <= last;
    if (wrong) bad++;
    console.log(`${a.sure ? ' ' : '?'}${wrong ? '!' : ' '} S${String(n + 1).padEnd(3)}${k ? `▶${k}` : '  '}  ${t.toFixed(2).padStart(7)}  ${a.pace.toFixed(1).padStart(5)} letters/s  ${a.word ? 'heard' : '     '}  ${said.slice(a.token, a.token + 5).join(' ')} …`);
    last = t;
  });
  const clean = attrs.replace(/\s+data-(at|auto)="[^"]*"/g, '');
  return `<section${clean} data-at="${at.toFixed(2)}"${steps.length ? ` data-auto="${steps.map(s => s.toFixed(2)).join(' ')}"` : ''}>`;
});
console.log(`${K} times at ${pace.toFixed(1)} letters/s, ${anchors.filter(a => !a.sure).length} to check by ear (?), ${bad} colliding (!)`);
if (!args.includes('--dry')) writeFileSync(deckPath, out);
process.exitCode = bad ? 1 : 0;
