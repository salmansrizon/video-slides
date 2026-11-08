// Copies each scene's VO from a Script into its Slide's speaker notes, and checks the click Cues line up.
//   node tools/sync-notes.mjs scripts/script1.txt decks/ai-agent-system-design/index.html
// Script format: a scene starts with "## S<n> · title", has a header line with "▶ ×<count>", then "**VO:**" and the spoken
// lines with Cues ▶1, ▶2 … at the word where the presenter clicks. The Deck marks each Slide with "<!-- S<n> · … -->".
// For every scene it checks: Cues numbered 1..N, N equals the declared count, and N equals the Slide's Steps.
// Exit 1 on any mismatch (the notes are still written, so you can see the result).
import { readFileSync, writeFileSync } from 'node:fs';

const [scriptPath, deckPath] = process.argv.slice(2);
if (!scriptPath || !deckPath) { console.log('Usage: node tools/sync-notes.mjs <script.txt> <deck index.html>'); process.exit(2); }

// --- Script: scene number -> { declared, lines }
const scenes = new Map();
let cur = null, inVO = false;
for (const raw of readFileSync(scriptPath, 'utf8').split(/\r?\n/)) {
  const line = raw.trim(), head = line.match(/^## S(\d+)\b/);
  if (head) { cur = { declared: null, lines: [] }; scenes.set(+head[1], cur); inVO = false; continue; }
  if (/^(# |## |---)/.test(line)) { cur = null; inVO = false; continue; }
  if (!cur) continue;
  const declared = line.match(/▶ ×(\d+)/);
  if (declared && !inVO) cur.declared = +declared[1];
  if (line === '**VO:**') { inVO = true; continue; }
  if (inVO && line) cur.lines.push(line);
}

// --- Deck: Steps per Slide = distinct data-fragment-index values + Steps without one (Reveal's own fragments are not counted)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '');
let html = readFileSync(deckPath, 'utf8');
const marks = [...html.matchAll(/<!-- S(\d+) ·/g)];
let failed = false;
const report = [];
for (let i = marks.length - 1; i >= 0; i--) {   // back to front, so earlier offsets stay valid while replacing
  const n = +marks[i][1], start = marks[i].index, end = i + 1 < marks.length ? marks[i + 1].index : html.indexOf('</div></div>', start);
  let part = html.slice(start, end);
  const tags = [...part.matchAll(/<[^>]*\sdata-step="[^"]*"[^>]*>/g)].map(m => m[0]);
  const indexed = new Set(tags.map(t => t.match(/data-fragment-index="(\d+)"/)?.[1]).filter(Boolean));
  const steps = indexed.size + tags.filter(t => !/data-fragment-index=/.test(t)).length;
  const sc = scenes.get(n);
  if (!sc) { report.unshift(`S${n}: no scene in the Script`); failed = true; continue; }
  const cues = sc.lines.join(' ').match(/▶(\d+)/g)?.map(c => +c.slice(1)) ?? [];
  const ordered = cues.every((c, k) => c === k + 1);
  const ok = ordered && cues.length === steps && (sc.declared ?? cues.length) === cues.length;
  if (!ok) failed = true;
  report.unshift(`S${n}: ${cues.length} Cues, ${steps} Steps${sc.declared != null ? `, header says ${sc.declared}` : ''}${ordered ? '' : ', Cues not numbered 1..N'} ${ok ? 'ok' : '<-- MISMATCH'}`);
  const notes = `<aside class="notes">\n${sc.lines.map(l => `    <p>${esc(l)}</p>`).join('\n')}\n  </aside>`;
  if (!/<aside class="notes">[\s\S]*?<\/aside>/.test(part)) { report[0] += ' (no notes block found)'; failed = true; continue; }
  part = part.replace(/<aside class="notes">[\s\S]*?<\/aside>/, notes);
  html = html.slice(0, start) + part + html.slice(end);
}
writeFileSync(deckPath, html);
report.forEach(r => console.log(r));
console.log(failed ? 'Some Slides are out of sync (see MISMATCH).' : `All ${marks.length} Slides in sync; notes updated.`);
process.exitCode = failed ? 1 : 0;
