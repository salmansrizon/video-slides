// Renders a voiced Deck to an MP4: steps deck.html?play frame by frame (Deck.seek) and lays the voiceover under it.
//   node tools/render-deck.mjs decks/my-video/index.html [--out renders/my-video.mp4] [--outro clip.mp4] [--fps 30] [--tail 0.5]
//   node tools/render-deck.mjs decks/my-video/index.html --format vertical --slides 7-18 --outro outro/renders/outro-9x16-follow.mp4   (reels)
// The Deck needs <audio data-vo src="..."> and data-at / data-auto on its Slides (tools/time-deck.mjs). Needs ffmpeg.
// --tail: seconds the last Slide holds after the voice ends. --outro: a clip (any size / rate) played after that.
// --format vertical: 1080x1920 from deck.html?play&format=vertical. --slides A-B (1-based): instead of one video, one
//   reel per Slide, from its data-at to the next Slide's, into renders/<video-name>-reels/S<NN>.mp4 (--out sets the folder).
// Picture is 1920x1080 (or 1080x1920) H.264, sound AAC 48 kHz stereo.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2), file = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const flag = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const die = m => { console.error(`error: ${m}`); process.exit(1); };
if (!file) { console.log('Usage: node tools/render-deck.mjs <deck index.html> [--out FILE|DIR] [--outro CLIP] [--fps 30] [--tail 0.5] [--format vertical] [--slides A-B]'); process.exit(2); }
const run = (cmd, a) => { const r = spawnSync(cmd, a, { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' }); if (r.status !== 0) die(`${cmd} failed`); return r.stdout; };

const deck = resolve(file), html = readFileSync(deck, 'utf8'), name = basename(dirname(deck));
const src = html.match(/<audio\b[^>]*\bdata-vo\b[^>]*>/)?.[0].match(/\bsrc="([^"]+)"/)?.[1];
if (!src) die('the Deck has no <audio data-vo src="...">');
const vo = resolve(dirname(deck), src), outro = flag('outro') && resolve(flag('outro'));
for (const f of [vo, outro]) if (f && !existsSync(f)) die(`not found: ${f}`);
const fps = +(flag('fps') || 30), tail = +(flag('tail') ?? 0.5), vertical = flag('format') === 'vertical';
const [W, H] = vertical ? [1080, 1920] : [1920, 1080];
const url = `${pathToFileURL(deck).href}?play${vertical ? '&format=vertical' : ''}`;
const voLength = +run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo]);
const norm = `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:-1:-1,fps=${fps},format=yuv420p,setsar=1`;
const sound = 'aresample=48000,aformat=channel_layouts=stereo';
const encode = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-colorspace', 'bt709', '-color_primaries', 'bt709',
  '-color_trc', 'bt709', '-color_range', 'tv', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart'];
const probe = out => run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,avg_frame_rate', '-of', 'default=nw=1', out]).trim();

// Picture only, near-lossless: the ffmpeg step after it encodes it once more together with the sound.
const picture = (out, from, to, total) => run('node', [fileURLToPath(new URL('../.claude/skills/motionmaxxing/scripts/render.mjs', import.meta.url)),
  url, out, '--fps', fps, '--width', W, '--height', H, '--duration', total.toFixed(3), '--from', from.toFixed(3), '--to', to.toFixed(3), '--crf', 12].map(String));

const range = flag('slides');
if (range) {
  // Reels: each Slide's own stretch of voice, from its data-at to the next Slide's (the pause before the next line is its hold).
  const at = [...html.matchAll(/<section\b[^>]*\bdata-at="([\d.]+)"/g)].map(m => +m[1]);
  const [a, b = a] = range.split('-').map(Number);
  if (!(a >= 1 && b >= a && b <= at.length)) die(`--slides ${range}: the Deck has Slides 1-${at.length} with data-at`);
  const dir = resolve(flag('out') || `renders/${name}-reels`);
  mkdirSync(dir, { recursive: true });
  for (let n = a; n <= b; n++) {
    const from = at[n - 1], to = n < at.length ? at[n] : voLength, len = to - from;
    const out = join(dir, `S${String(n).padStart(2, '0')}.mp4`), pic = out.replace(/\.mp4$/, '.picture.mp4');
    console.log(`Slide ${n}: ${from.toFixed(2)}-${to.toFixed(2)} s`);
    picture(pic, from, to, voLength + tail);
    // The last frame holds --tail seconds in silence. 10 ms fades so the cut into the voice never clicks.
    run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', pic, '-ss', from.toFixed(3), '-t', len.toFixed(3), '-i', vo,
      ...(outro ? ['-i', outro] : []), '-filter_complex',
      `[0:v]tpad=stop_mode=clone:stop_duration=${tail},${norm}[v0];` +
      `[1:a]${sound},apad,atrim=0:${len.toFixed(3)},afade=t=in:d=0.01,afade=t=out:st=${(len - 0.01).toFixed(3)}:d=0.01,apad,atrim=0:${(len + tail).toFixed(3)}[a0];` +
      (outro ? `[2:v]${norm}[v1];[2:a]${sound}[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]` : '[v0]null[v];[a0]anull[a]'),
      '-map', '[v]', '-map', '[a]', ...encode, out]);
    rmSync(pic);
    console.log(probe(out).replace(/\n/g, ' '), out);
  }
  process.exit(0);
}

const length = voLength + tail, out = resolve(flag('out') || `renders/${name}${vertical ? '-vertical' : ''}.mp4`), pic = out.replace(/\.mp4$/, '.picture.mp4');
mkdirSync(dirname(out), { recursive: true });
picture(pic, 0, length, length);
// Voice under the picture (padded with silence to its length), then the outro.
run('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', pic, '-i', vo, ...(outro ? ['-i', outro] : []), '-filter_complex',
  `[1:a]${sound},apad,atrim=0:${length.toFixed(3)}[a0];` + (outro
    ? `[0:v]${norm}[v0];[2:v]${norm}[v1];[2:a]${sound}[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`
    : `[0:v]${norm}[v];[a0]anull[a]`),
  '-map', '[v]', '-map', '[a]', ...encode, out]);
rmSync(pic);
console.log(probe(out));
console.log(out);
