// Downloads pinned library copies into vendor/ so decks open offline by double-click.
// Usage: node vendor/update.mjs        (bump a version below, then re-run)
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VENDOR = dirname(fileURLToPath(import.meta.url));
const PKGS = {
  'reveal.js': '6.0.2', gsap: '3.15.0', three: '0.186.1', '@tailwindcss/browser': '4.3.3',
  'basecoat-css': '1.1.0', 'chart.js': '4.6.1', d3: '7.9.0', mermaid: '12.2.0',
  'lottie-web': '5.13.0', lucide: '1.61.0', esbuild: '0.28.2',
  '@fontsource-variable/anek-bangla': '5.3.0', '@fontsource-variable/jetbrains-mono': '5.3.0',
  '@fontsource/ibm-plex-mono': '5.3.0', '@fontsource/hind-siliguri': '5.3.0', 'js-tiktoken': '1.0.21',
  '@fontsource/tiro-bangla': '5.3.0', '@fontsource/barlow-condensed': '5.3.0', '@fontsource/atma': '5.3.0',
  '@fontsource-variable/noto-serif-bengali': '5.3.0', '@fontsource-variable/noto-sans-bengali': '5.3.0',
  '@fontsource-variable/literata': '5.3.0',
};
// [package, file inside package, destination inside vendor/]
const FILES = [
  ['reveal.js', 'dist/reveal.js', 'reveal/reveal.js'],
  ['reveal.js', 'dist/reveal.css', 'reveal/reveal.css'],
  ['reveal.js', 'dist/plugin/notes.js', 'reveal/notes.js'],
  ['reveal.js', 'dist/plugin/highlight.js', 'reveal/highlight.js'],
  ['reveal.js', 'dist/plugin/highlight/monokai.css', 'reveal/monokai.css'],
  ['reveal.js', 'LICENSE', 'reveal/LICENSE'],
  ...['gsap', 'SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'Flip', 'CustomEase', 'ScrambleTextPlugin', 'TextPlugin']
    .map(n => ['gsap', `dist/${n}.min.js`, `gsap/${n}.min.js`]),
  ['gsap', 'README.md', 'gsap/README.md'], // license terms: https://gsap.com/standard-license
  ['@tailwindcss/browser', 'dist/index.global.js', 'tailwind/tailwind.browser.js'],
  ['basecoat-css', 'dist/basecoat.cdn.min.css', 'basecoat/basecoat.cdn.min.css'],
  ['basecoat-css', 'LICENSE.md', 'basecoat/LICENSE.md'],
  ['chart.js', 'dist/chart.umd.min.js', 'chartjs/chart.umd.min.js'],
  ['chart.js', 'LICENSE.md', 'chartjs/LICENSE.md'],
  ['d3', 'dist/d3.min.js', 'd3/d3.min.js'],
  ['d3', 'LICENSE', 'd3/LICENSE'],
  ['mermaid', 'dist/mermaid.min.js', 'mermaid/mermaid.min.js'],
  ['mermaid', 'LICENSE', 'mermaid/LICENSE'],
  ['lottie-web', 'build/player/lottie.min.js', 'lottie/lottie.min.js'],
  ['lottie-web', 'LICENSE.md', 'lottie/LICENSE.md'],
  ['lucide', 'dist/umd/lucide.min.js', 'lucide/lucide.min.js'],
  ['lucide', 'LICENSE', 'lucide/LICENSE'],
  ['three', 'LICENSE', 'three/LICENSE'],
  // Bangla text (Inter has no Bengali glyphs) and a code/terminal face. Both SIL OFL 1.1.
  ['@fontsource-variable/anek-bangla', 'files/anek-bangla-bengali-wght-normal.woff2', 'fonts/AnekBangla-Bengali-Variable.woff2'],
  ['@fontsource-variable/anek-bangla', 'LICENSE', 'fonts/AnekBangla-OFL.txt'],
  ['@fontsource-variable/jetbrains-mono', 'files/jetbrains-mono-latin-wght-normal.woff2', 'fonts/JetBrainsMono-Variable.woff2'],
  ['@fontsource-variable/jetbrains-mono', 'LICENSE', 'fonts/JetBrainsMono-OFL.txt'],
  // Faces for individual Looks (ADR 0002). SIL OFL 1.1.
  ...[400, 600, 700].map(w => ['@fontsource/ibm-plex-mono', `files/ibm-plex-mono-latin-${w}-normal.woff2`, `fonts/IBMPlexMono-${w}.woff2`]),
  ['@fontsource/ibm-plex-mono', 'LICENSE', 'fonts/IBMPlexMono-OFL.txt'],
  ...[400, 500, 600, 700].map(w => ['@fontsource/hind-siliguri', `files/hind-siliguri-bengali-${w}-normal.woff2`, `fonts/HindSiliguri-Bengali-${w}.woff2`]),
  // Latin subset too: spaces and English words inside Bangla sentences need a proportional face, not the fallback.
  ...[400, 500, 600, 700].map(w => ['@fontsource/hind-siliguri', `files/hind-siliguri-latin-${w}-normal.woff2`, `fonts/HindSiliguri-Latin-${w}.woff2`]),
  ['@fontsource/hind-siliguri', 'LICENSE', 'fonts/HindSiliguri-OFL.txt'],
  // why-ai-hallucinates (OMR sheet): Tiro Bangla print, Barlow Condensed form labels, Atma red-pen hand.
  ...['bengali', 'latin'].map(s => ['@fontsource/tiro-bangla', `files/tiro-bangla-${s}-400-normal.woff2`, `fonts/TiroBangla-${s === 'bengali' ? 'Bengali' : 'Latin'}-400.woff2`]),
  ['@fontsource/tiro-bangla', 'LICENSE', 'fonts/TiroBangla-OFL.txt'],
  ...[500, 600, 700].map(w => ['@fontsource/barlow-condensed', `files/barlow-condensed-latin-${w}-normal.woff2`, `fonts/BarlowCondensed-${w}.woff2`]),
  ['@fontsource/barlow-condensed', 'LICENSE', 'fonts/BarlowCondensed-OFL.txt'],
  ...['bengali', 'latin'].flatMap(s => [400, 600].map(w => ['@fontsource/atma', `files/atma-${s}-${w}-normal.woff2`, `fonts/Atma-${s === 'bengali' ? 'Bengali' : 'Latin'}-${w}.woff2`])),
  ['@fontsource/atma', 'LICENSE', 'fonts/Atma-OFL.txt'],
  // context-window-rag (light table): Noto Serif Bengali for printed sheets (plus Anek Bangla above).
  ...['bengali', 'latin'].map(s => ['@fontsource-variable/noto-serif-bengali', `files/noto-serif-bengali-${s}-wght-normal.woff2`, `fonts/NotoSerifBengali-${s === 'bengali' ? 'Bengali' : 'Latin'}-Variable.woff2`]),
  ['@fontsource-variable/noto-serif-bengali', 'LICENSE', 'fonts/NotoSerifBengali-OFL.txt'],
  // prompt-injection (examiner's desk): Noto Sans Bengali, Literata (plus JetBrains Mono above).
  ...['bengali', 'latin'].map(s => ['@fontsource-variable/noto-sans-bengali', `files/noto-sans-bengali-${s}-wght-normal.woff2`, `fonts/NotoSansBengali-${s === 'bengali' ? 'Bengali' : 'Latin'}-Variable.woff2`]),
  ['@fontsource-variable/noto-sans-bengali', 'LICENSE', 'fonts/NotoSansBengali-OFL.txt'],
  ['@fontsource-variable/literata', 'files/literata-latin-wght-normal.woff2', 'fonts/Literata-Variable.woff2'],
  ['@fontsource-variable/literata', 'LICENSE', 'fonts/Literata-OFL.txt'],
  ['js-tiktoken', 'package.json', 'js-tiktoken/package.json'], // no LICENSE file in the package; "license": "MIT" is declared here
];

const tmp = mkdtempSync(join(tmpdir(), 'deck-vendor-'));
try {
  writeFileSync(join(tmp, 'package.json'), '{"private":true}');
  const specs = Object.entries(PKGS).map(([n, v]) => `${n}@${v}`).join(' ');
  execSync(`npm install --ignore-scripts --no-audit --no-fund --save-exact ${specs}`, { cwd: tmp, stdio: 'inherit' });
  // esbuild needs its platform binary; --ignore-scripts skips its postinstall, so install that one normally.
  execSync(`npm rebuild esbuild`, { cwd: tmp, stdio: 'inherit' });

  for (const [pkg, file, dest] of FILES) {
    const src = join(tmp, 'node_modules', pkg, file);
    if (!existsSync(src)) throw new Error(`missing ${pkg}/${file}`);
    mkdirSync(dirname(join(VENDOR, dest)), { recursive: true });
    cpSync(src, join(VENDOR, dest));
  }

  // Three.js only ships ES modules, which browsers block on file://. Bundle it once as a classic script (window.THREE).
  writeFileSync(join(tmp, 'three-entry.js'), [
    "export * from 'three';",
    "export { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';",
    "export { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';",
    "export { SVGLoader } from 'three/addons/loaders/SVGLoader.js';",
    "export { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';",
  ].join('\n'));
  const esbuild = createRequire(join(tmp, 'package.json'))('esbuild');
  await esbuild.build({
    entryPoints: [join(tmp, 'three-entry.js')], bundle: true, minify: true,
    format: 'iife', globalName: 'THREE', outfile: join(VENDOR, 'three/three.iife.js'),
    absWorkingDir: tmp, logLevel: 'warning',
  });
  // OpenAI's real GPT-4 (cl100k_base) and GPT-4o+ (o200k_base) tokenizers as a classic script (window.Tokenizers).
  // Tokenizers.pieces(enc, text) -> byte length of each token, for drawing token boundaries.
  writeFileSync(join(tmp, 'tiktoken-entry.js'), [
    "import { Tiktoken } from 'js-tiktoken/lite';",
    "import cl100k from 'js-tiktoken/ranks/cl100k_base';",
    "import o200k from 'js-tiktoken/ranks/o200k_base';",
    "export const gpt4 = new Tiktoken(cl100k), gpt4o = new Tiktoken(o200k);",
    "export const pieces = (enc, text) => enc.encode(text).map(id => enc.textMap.get(id).length);",
  ].join('\n'));
  await esbuild.build({
    entryPoints: [join(tmp, 'tiktoken-entry.js')], bundle: true, minify: true,
    format: 'iife', globalName: 'Tokenizers', outfile: join(VENDOR, 'js-tiktoken/tokenizers.iife.js'),
    absWorkingDir: tmp, logLevel: 'warning',
  });
  esbuild.stop(); // Windows keeps esbuild.exe locked (and the temp dir undeletable) while its service runs

  // Inter font comes from the motionmaxxing skill (SIL OFL 1.1).
  const fonts = join(VENDOR, '..', '.claude/skills/motionmaxxing/runtime/fonts');
  cpSync(join(fonts, 'InterVariable.woff2'), join(VENDOR, 'fonts/InterVariable.woff2'));
  cpSync(join(fonts, 'OFL.txt'), join(VENDOR, 'fonts/OFL.txt'));

  console.log('vendor/ updated:', Object.entries(PKGS).filter(([n]) => n !== 'esbuild').map(([n, v]) => `${n}@${v}`).join(', '));
} finally {
  try { rmSync(tmp, { recursive: true, force: true, maxRetries: 3 }); } catch { console.warn(`could not delete ${tmp}; safe to remove by hand`); }
}
