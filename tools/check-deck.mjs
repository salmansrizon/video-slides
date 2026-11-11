// Clicks through a Deck in headless Chrome, opened from disk like the presenter does, in both Formats.
// Prints console errors and saves one screenshot per Step to look at; then steps all the way back.
//   node tools/check-deck.mjs decks/my-video/index.html [--out DIR] [--wait 1.2]
// Exit 1 if the Deck logged errors or never finished Deck.start().
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchChrome } from '../.claude/skills/motionmaxxing/scripts/_cdp.mjs';

const args = process.argv.slice(2), file = args.find(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'));
const flag = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
if (!file) { console.log('Usage: node tools/check-deck.mjs <deck index.html> [--out DIR] [--wait 1.2]'); process.exit(2); }
const out = resolve(flag('out') || join(tmpdir(), 'deck-check', basename(dirname(resolve(file)))));
const wait = ms => new Promise(r => setTimeout(r, ms)), settle = (+flag('wait') || 1.2) * 1000;
mkdirSync(out, { recursive: true });

// Two checks at once have crashed Chrome on this machine: queue behind a running check (a lock older than 20 min is stale).
const lock = join(tmpdir(), 'deck-check.lock');
for (;;) {
  try { mkdirSync(lock); break; } catch {}
  try { if (Date.now() - statSync(lock).mtimeMs > 1200e3) rmSync(lock, { recursive: true, force: true }); } catch {}
  await wait(2000);
}
process.on('exit', () => rmSync(lock, { recursive: true, force: true }));

// motionmaxxing's finder only knows macOS/Linux paths.
process.env.CHROME_PATH ||= ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`].find(existsSync);
const br = await launchChrome();
let failed = false;
try {
  for (const format of ['landscape', 'vertical']) {
    const page = await br.newPage(format === 'vertical' ? { width: 540, height: 960 } : { width: 1280, height: 720 });
    const errors = [];
    page.on('Runtime.consoleAPICalled', e => {
      if (!['error', 'warning'].includes(e.type)) return;
      const text = e.args.map(a => a.value ?? a.description).join(' ');
      // Windows' shader compiler prints harmless precision notes (warning X4122) that Three.js forwards as warnings.
      if (e.type === 'warning' && text.startsWith('THREE.WebGLProgram: Program Info Log') && !/error/i.test(text)) return;
      errors.push(text);
    });
    page.on('Runtime.exceptionThrown', e => errors.push(e.exceptionDetails.exception?.description || e.exceptionDetails.text));
    await page.send('Log.enable');
    page.on('Log.entryAdded', e => { if (e.entry.level === 'error') errors.push(`${e.entry.text} ${e.entry.url || ''}`); });

    await page.goto(pathToFileURL(resolve(file)).href + (format === 'vertical' ? '?format=vertical' : ''));
    const ready = await page.eval(`new Promise(res => { const t = Date.now(); (function poll() {
      if (document.documentElement.hasAttribute('data-deck-ready')) res(true); else if (Date.now() - t > 20000) res(false); else setTimeout(poll, 100); })(); })`);
    if (!ready) { console.log(`${format}: Deck.start() never finished`); failed = true; }

    const at = () => page.eval('JSON.stringify(Reveal.getIndices())');
    let shots = 0, last = '';
    for (let i = 0; ready && i < 400; i++) {
      await wait(settle);
      const now = await at();
      if (now === last) break;   // next() did nothing: end of Deck
      last = now;
      const { h, f } = JSON.parse(now);
      writeFileSync(join(out, `${format}-${String(shots++).padStart(3, '0')}-slide${h}-step${f ?? 'none'}.png`), await page.shot());
      await page.eval('Reveal.next()');
    }
    for (let i = 0; ready && i < 400 && (await page.eval('!(Reveal.isFirstSlide() && (Reveal.getIndices().f ?? -1) < 0)')); i++) {
      await page.eval('Reveal.prev()');
      await wait(150);
    }
    console.log(`${format}: ${shots} screenshots, ${errors.length} console errors`);
    errors.forEach(e => console.log(`  ${e}`));
    if (errors.length) failed = true;
    await page.close();
  }
} finally {
  await br.close();
}
console.log(`Screenshots: ${out}`);
process.exitCode = failed ? 1 : 0;
