// Screenshots chosen job posts for the Deck: node shoot.mjs <url> <name> [<url> <name> ...]
// Clips to the post itself (the smallest block holding its title and the start of its text, from posts.json),
// hides ad banners, English UI, 2x scale. Saves ../../assets/jobposts/<name>.png and logs it in ../../assets/SOURCES.md.
// Look at every shot before using it.
import { launchChrome } from '../../../../.claude/skills/motionmaxxing/scripts/_cdp.mjs';
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
process.env.CHROME_PATH ||= 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2), out = '../../assets/jobposts';
const posts = JSON.parse(readFileSync('posts.json', 'utf8'));
mkdirSync(out, { recursive: true });
const br = await launchChrome({ width: 1280, height: 2400, args: ['--lang=en-US', '--accept-lang=en-US'] });
try {
  for (let i = 0; i < args.length; i += 2) {
    const [url, name] = [args[i], args[i + 1]];
    const post = posts.find(p => p.url === url) || {};
    const page = await br.newPage({ width: 1280, height: 2400 });
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 2400, deviceScaleFactor: 2, mobile: false });
    await page.goto(url);
    await new Promise(r => setTimeout(r, 7000));
    const rect = await page.eval(`(() => {
      document.querySelectorAll('[class*="modal"], [role="dialog"], [class*="cookie"], .base-contextual-sign-in-modal, iframe, ins, [id*="google_ads"], [class*="banner"], [class*="advert"]').forEach(e => e.remove());
      document.querySelectorAll('img').forEach(im => { if (/pro|banner|ads|fair/i.test(im.src) && im.width > 300) im.closest('a,div')?.remove(); });
      document.body.style.overflow = 'auto';
      const title = ${JSON.stringify((post.title || '').slice(0, 30))}, start = ${JSON.stringify((post.text || '').replace(/\s+/g, ' ').slice(0, 24))};
      let best = null;
      for (const el of document.querySelectorAll('main, section, article, div')) {
        const t = el.innerText.replace(/\\s+/g, ' ');
        if (!t.includes(title) || (start && !t.includes(start))) continue;
        const r = el.getBoundingClientRect(); if (r.width < 400) continue;
        if (!best || r.width * r.height < best.w * best.h) best = { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      }
      return JSON.stringify(best);
    })()`);
    const r = JSON.parse(rect);
    if (!r) { console.log('no post block found:', name); await page.close(); continue; }
    const clip = { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: r.w + 32, height: Math.min(r.h + 32, 1500), scale: 1 };
    const { data } = await page.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    writeFileSync(`${out}/${name}.png`, Buffer.from(data, 'base64'));
    appendFileSync('../../assets/SOURCES.md', `- assets/jobposts/${name}.png: screenshot of ${url} ("${post.title}", ${post.company}, posted ${post.posted}), taken ${new Date().toISOString().slice(0, 10)}\n`);
    console.log('saved', name, Math.round(clip.width), 'x', Math.round(clip.height));
    await page.close();
  }
} finally { await br.close(); }
