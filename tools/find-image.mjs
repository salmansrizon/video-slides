// Finds free-license photos on Openverse (Flickr, Wikimedia Commons and more; no API key) and records each download.
// Usage:
//   node tools/find-image.mjs "mountain lake"                          list candidates
//   node tools/find-image.mjs "mountain lake" --pick 2 --out decks/my-video/assets   download #2, log it in SOURCES.md
// Options: --n 8 (candidates)   --license cc0,pdm,by (default: no ShareAlike/NonCommercial)   --name lake (file name)
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UA = { 'User-Agent': 'video-slides-deck-tools/1.0' };

// Returns an exit code instead of calling process.exit(): exiting with fetch sockets open crashes Node on Windows.
async function main(args) {
  const opt = {};
  const query = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')).join(' ');
  args.forEach((a, i) => { if (a.startsWith('--')) opt[a.slice(2)] = args[i + 1]; });
  if (!query) { console.log('Usage: node tools/find-image.mjs "<query>" [--pick N --out DIR] [--n 8] [--license cc0,pdm,by] [--name file]'); return 2; }

  const url = new URL('https://api.openverse.org/v1/images/');
  url.search = new URLSearchParams({ q: query, license: opt.license || 'cc0,pdm,by', page_size: opt.n || '8', mature: 'false' });
  const res = await fetch(url, { headers: UA });
  if (!res.ok) { console.error(`Openverse ${res.status}: ${await res.text()}`); return 1; }
  const { results = [] } = await res.json();
  if (!results.length) { console.error('No results. Try other words or --license cc0,pdm,by,by-sa'); return 1; }

  if (!opt.pick) {
    results.forEach((r, i) => console.log(`${i + 1}. ${r.title} — ${r.width}x${r.height}, CC ${r.license.toUpperCase()} ${r.license_version || ''}, ${r.source}\n   ${r.foreign_landing_url}\n   ${r.url}`));
    console.log('\nLook at the candidates, then re-run with --pick N --out decks/<name>/assets');
    return 0;
  }

  const r = results[+opt.pick - 1];
  if (!r) { console.error(`--pick must be 1-${results.length}`); return 2; }
  if (!opt.out) { console.error('--out DIR is required with --pick'); return 2; }
  const img = await fetch(r.url, { headers: UA });
  if (!img.ok) { console.error(`Download failed (${img.status}); pick another.`); return 1; }
  const ext = (img.headers.get('content-type') || '').split('/')[1]?.replace('jpeg', 'jpg').split(';')[0] || 'jpg';
  const name = `${opt.name || query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.${ext}`;
  mkdirSync(opt.out, { recursive: true });
  writeFileSync(join(opt.out, name), Buffer.from(await img.arrayBuffer()));

  const sources = join(opt.out, 'SOURCES.md');
  if (!existsSync(sources)) writeFileSync(sources, '# Asset sources\n\nPut the credits below in the video description (CC BY requires attribution).\n\n');
  appendFileSync(sources, `- \`${name}\` — ${r.attribution} Source: ${r.foreign_landing_url}\n`);
  console.log(`Saved ${join(opt.out, name)} and logged it in ${sources}`);
  return 0;
}

process.exitCode = await main(process.argv.slice(2));
