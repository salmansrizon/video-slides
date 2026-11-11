# Video Slides

Animated HTML Decks for the user's videos. The user opens each Deck in Chrome, clicks through it live and screen-records it themselves, or gives a voiceover and has the Deck rendered to an MP4 (see Voiced video below). Vocabulary: [CONTEXT.md](CONTEXT.md). Why plain HTML: [docs/adr/0001](docs/adr/0001-plain-html-decks.md).

## Layout

- `scripts/` — the user's Scripts (one per video)
- `decks/<video-name>/index.html` — one Deck per Script; its Assets in `decks/<video-name>/assets/` with `SOURCES.md`
- `templates/deck/` — the starter, one sample Slide per content type. Copy the folder to `decks/<video-name>/` so the `../../` paths keep working
- `lib/deck.js`, `lib/deck.css` — shared runtime (Steps, presets, eases, Format switch) and look. Edit only for changes every Deck should get
- `vendor/` — pinned library copies. `node vendor/update.mjs` re-downloads them (versions listed at its top). Never link a CDN
- `tools/check-deck.mjs` (clicks through a Deck headless in both Formats, reports console errors, saves a screenshot per Step), `tools/sync-notes.mjs` (Script VO → speaker notes, checks Cues = Steps), `tools/find-image.mjs` (free-license photos), `tools/embed.mjs` (JSON/3D/texture files for file://), `tools/time-deck.mjs` and `tools/render-deck.mjs` (voiceover → Slide times → MP4)
- `renders/` — rendered MP4s (not in git)
- `library/` — reusable Assets gathered so far: LottieFiles characters (`lottie/INDEX.md`, `preview.html`), the style reference video's frames and `STYLE.md`, logos. Copy into a Deck's `assets/` before use; never link `library/` from a Deck
- `.claude/skills/` — motionmaxxing, video-shotcraft (see Skills below)

## Hard rules

- A Deck must work by double-clicking `index.html` (file://): classic `<script>` tags from `vendor/` only. No ES modules, `fetch()`, CDN links or build step. Three.js is `window.THREE` (includes RoomEnvironment, RoundedBoxGeometry, SVGLoader, GLTFLoader).
- Lottie JSON, 3D models and WebGL textures: `node tools/embed.mjs <file>`, load the generated `.js`, use `ASSETS[name]`. Plain `<img>` works without it.
- Never put `<section>` inside a Slide: Reveal treats every `<section>` as a Slide. Basecoat card body is `<div class="px-6">`.
- Nothing on screen but the Slide: no slide numbers, progress bar, controls, corner labels or timecodes (Deck.start() turns Reveal's off; don't add your own).
- Every Slide must work in both Formats. Check `index.html?format=vertical` too. Use `.split` for side by side (it stacks in Vertical); branch on `Deck.vertical` inside presets.
- Animate with `data-enter="preset"` (plays when the Slide appears) and `data-step="preset"` (one click; reverses on back-click). Built-in presets: `rise slide land crash stamp hide words stream type draw count mark dim` (see the comments in `lib/deck.js`). Custom: `Deck.preset('name', el => gsapTimeline)` before `Deck.start()`.
- Presets are synchronous and return a GSAP animation, never a Promise: GSAP animations are thenable, so awaiting one blocks until it finishes playing. For async work (Mermaid), return a timeline at once and add tweens when the work resolves.
- Steps a script generates at load (charts built from data) are invisible to `sync-notes.mjs`; put `data-step-count="N"` on their container so the Cue check still counts them.
- Steps run in DOM order. When the click order must differ (an inner element before its wrapper), or two elements must move on one click, give every Step on that Slide an explicit `data-fragment-index`.
- Several Steps moving the same target (a slider knob, a counter): later ones use `immediateRender: false`. Measure positions with layout offsets (see `at()` in the AI system-design deck), not `getBoundingClientRect`, so entry transforms and Reveal's scaling don't skew them.
- GSAP owns time. Anything that moves (Chart.js data, Lottie frames, Three.js objects) is driven by a GSAP timeline so it reverses and survives jumping between Slides. See the `bars`, `tree`, `flow` and `orbit` presets in the template.
- Motion defaults (motionmaxxing's measured eases, registered by name): entries ~0.4 s with `softLand`, hero arrivals `snapSettle`, logos `crashIn`, exits `accelExit`. Arrive by moving or from oversize; nothing grows from scale 0; fades only cover the first ~0.2 s. Hard cuts between Slides (`transition: 'none'`).

## Building a Deck from a Script

1. Read the Script. Split it into Slides: one idea per Slide, one Step per sentence that introduces something new on screen.
2. Scripts in `scripts/` are dialogue-only reading copies (`## Slide <n>`, then the spoken lines, presenter notes in parentheses); `script1.txt` and `script2.txt` both use it. The ▶ Cues live in each Deck's Notes, which were written from a synced version (`script1`'s Deck plays its Steps by themselves from `data-auto` times on each `<section>`; `script2`'s Deck steps on ↓). When a Deck's Notes must be rebuilt, write the synced format first: per scene `## S<n> · title`, a header line `⏭ Slide <n> · ▶ ×<count>`, then `**VO:**` with the spoken lines, a numbered Cue `▶1`, `▶2` … right before the word where the click lands, `[auto]` for things that play by themselves, `[…]` for screen notes. Mark each Slide in the Deck with `<!-- S<n> · title -->`, then run `node tools/sync-notes.mjs <script> <deck>`: it writes the Notes and must report every Slide in sync. Never edit Notes by hand; edit the Script and re-run. The presenter reads the Notes in speaker view (key `S`).
   - Scripts are usually Bangla. `lib/deck.css` falls back to Anek Bangla for Bengali glyphs and pads word masks so vowel signs aren't clipped. Use `data-locale="bn-BD"` on `count` for Bengali digits. The `type` preset splits by grapheme, so conjuncts never break. Never split Bangla text into characters.
3. Copy `templates/deck/` to `decks/<video-name>/`. Delete the sample Slides, unused `<script>` tags and unused presets.
4. Assets (real ones, never drawn or hotlinked):
   - Logos: `node .claude/skills/motionmaxxing/scripts/fetch_logo.mjs "<Brand>" <domain> --out decks/<video-name>/assets/logos/<brand>`. Official marks only; never recolour, redraw or reshape them. Add the line from its `logo.json` to `SOURCES.md`.
   - Photos: `node tools/find-image.mjs "<query>"` to list, then `--pick N --out decks/<video-name>/assets`. CC0, public domain or CC BY only; the credit is appended to `SOURCES.md` for the video description.
   - Look at every downloaded file before using it.
5. Theme: default is shadcn neutral dark (Basecoat tokens, Inter). `decks/ai-agent-system-design/` has a fuller dark explainer style (cards, pills, icon tiles, stamps, red failure → rule card → green test) modelled on the user's reference video; reuse it when the user wants that look. To restyle a Deck, paste a TweakCN/shadcn theme (`:root` and `.dark` variables) into its `<style>`. Tailwind utilities can use the tokens (`text-muted-foreground`, `bg-card`, `text-chart-2`).
6. Verify: `node tools/check-deck.mjs decks/<video-name>/index.html` must report 0 console errors in both Formats. Then look at the screenshots it saves and fix anything clipped, overlapping or unreadable.

## Talk Decks (live talk with a face cam)

Every Talk uses one format ([docs/adr/0003](docs/adr/0003-shared-talk-format.md)); `decks/sustainable-ai-coding/` is the reference.

- Load `lib/talk.css` after `deck.css`, and `lib/talk.js` after `deck.js`; start with `Deck.start({ keyboard: Talk.keys })`. Keys: ↓/↑ Steps, →/← Slides, `C` face-cam guide. Demo inputs: `Talk.field(el)`.
- Every Slide: `<h2>` title first (add `<span class="num">` for numbered rules), optional `.lead`, then content from the kit in `lib/talk.css` (`.panel .item .chip .tile .stamp .rule .term .flow .inc .split .grid2 .kinetic .big .eg`), `.src` source line when a number is shown. Title Slide: `<section class="center">` with `<h1>`.
- Dark, solid background always: no grids, dots, glows or shapes behind text. Graphs, simulations and Demos go inside a `.panel`; no full-screen scenes.
- The Deck's Look is a skin: override the variables at the top of `lib/talk.css` (`--bg --card --accent --font --mono --radius` …) in the Deck's `<style>`, and give it its own motion presets. Fonts are the same in every Talk (Inter + Anek Bangla; JetBrains Mono for code and source lines), set by `lib/talk.css`. Don't restyle the layout or the face-cam padding.
- Content stays out of the right 480 px (Landscape) and bottom 560 px (Vertical).

## Voiced video (Deck + voiceover → MP4)

For a Deck with a recorded or generated voiceover instead of a live talk. 16:9, plus 9:16 reels (step 6).

1. Put the audio in the Deck's `assets/` and add `<audio data-vo src="assets/vo.mp3" preload="none"></audio>` after the `.reveal` div. The Notes must hold the spoken text with its Cues (step 2 above).
2. Word times, on this Mac, nothing uploaded: `uvx --python 3.12 --from mlx-whisper mlx_whisper <audio> --model mlx-community/whisper-large-v3-turbo --language bn --word-timestamps True --output-format json --output-dir <dir> --output-name vo`.
3. `node tools/time-deck.mjs <deck> <dir>/vo.json` writes `data-at` (seconds into the audio where the Slide appears) and `data-auto` (its Steps, seconds after that) on every `<section>`. Rows it marks `?` were not heard clearly: check them by ear. Never type these times by hand; re-run after the Script or audio changes.
4. Preview: `index.html?play` (Space plays / pauses, ← → jump a Slide). `html.play` is set, so a Deck can restyle for the video (the sustainable-ai-coding Deck drops its face-cam margin). Opened without `?play` the Deck is the live talk, unchanged.
5. `node tools/render-deck.mjs <deck> [--outro library/outro-16x9-follow.mp4]` → `renders/<video-name>.mp4` (1920×1080, 30 fps, H.264 + AAC). It steps `Deck.seek(t)` frame by frame, so everything on a Slide must be reachable from its `data-enter` / `data-step` timelines (the "GSAP owns time" rule); anything running on its own clock renders frozen.
6. Reels (one 9:16 MP4 per Slide, from the same voiceover): `node tools/render-deck.mjs <deck> --format vertical --slides 7-18 --outro library/outro-9x16-follow.mp4` → `renders/<video-name>-reels/S<NN>.mp4`. `--slides` takes ranges and lists (`1,3,4,10-12`). Each reel runs from its Slide's `data-at` to the next one's (silence at its start skipped), then holds 0.5 s. Talks get the reel layout from `lib/talk.css`; other Decks style `html.play.vertical` themselves (no face cam; keep top 220 / right 130 / bottom 400 px clear of the apps' buttons). Check stills of every Slide's last Step first.
7. Look at stills before the full render: `node .claude/skills/motionmaxxing/scripts/render.mjs "<file URL of the deck>?play" --still <t,t,t> <dir>`.

## Skills

Rules in this file win over both skills.

- Scripts in these skills that launch Chrome only search macOS/Linux paths: set `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"` (check-deck.mjs does this itself).
- **motionmaxxing**: use its judgment on timing, type and motion (`references/motion.md`, `type.md`, `transitions.md`, `layout.md`, `slop.md`). Its page-chrome bans apply to Decks. Of its film pipeline, `render.mjs` is what `tools/render-deck.mjs` drives (needs ffmpeg, installed via Homebrew); the rest (`look.py`, `mix.py`, `voice.py`) only if the user asks.
- **video-shotcraft**: use its shot cards (`references/shots/<category>/*.md`, gallery https://vincentwei1021.github.io/video-shotcraft/) as animation ideas and rebuild them in GSAP. Don't run its Remotion pipeline, mode questions, Workbench or publishing flow. Its instructions are in Chinese.
