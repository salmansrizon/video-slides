# Video Slides

Animated HTML slide decks for Bangla tech explainer videos, presented live in Chrome and screen-recorded. Each deck is a plain HTML file that opens by double-click, works offline, and plays its animations on presenter clicks in both 16:9 and 9:16.

## Open a deck

- `decks/ai-agent-system-design/index.html`: "AI Coding Agent দিয়ে সফটওয়্যার বানাচ্ছেন? System Design ছাড়া বিপদ!" (27 slides, script in `scripts/script1.txt`)
- `templates/deck/index.html`: the starter deck

Keys: → / Space next step, ← back (animations reverse), `S` speaker view with the script and ▶ click cues. Add `?format=vertical` to the URL for 9:16.

## Layout

| Folder | What |
|---|---|
| `scripts/` | Video scripts in the synced format (▶ cues per click) |
| `decks/` | One deck per script, with its own `assets/` and `SOURCES.md` |
| `lib/` | Shared deck runtime (Reveal.js + GSAP steps, measured eases) and styles |
| `vendor/` | Pinned local copies of the libraries; `node vendor/update.mjs` re-downloads |
| `tools/` | `check-deck.mjs`, `sync-notes.mjs`, `find-image.mjs`, `embed.mjs` |
| `library/` | Reusable assets: LottieFiles characters, logos, style reference |
| `.claude/skills/` | motionmaxxing and video-shotcraft agent skills |
| `CLAUDE.md`, `CONTEXT.md`, `docs/adr/` | Working rules, glossary and decisions |

## Third-party content

Third-party files keep their own licenses; see the license files beside them.

- Libraries in `vendor/`: Reveal.js (MIT), GSAP (GreenSock Standard "No Charge" License, https://gsap.com/standard-license), Three.js (MIT), Tailwind CSS (MIT), Basecoat (MIT), Chart.js (MIT), D3 (ISC), Mermaid (MIT), lottie-web (MIT), Lucide (ISC); fonts Inter, Anek Bangla and JetBrains Mono (SIL OFL 1.1).
- Skills: [motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) and [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), both Apache-2.0 (LICENSE and NOTICE inside each folder); video-shotcraft's bundled music is under the Mixkit license noted in its `assets/audio/ATTRIBUTION.md`.
- Character animations: LottieFiles free animations under the Lottie Simple License; creators are credited in `library/lottie/INDEX.md` and the deck's `SOURCES.md`.
- Logos (Cursor, Claude, GitHub Copilot) belong to their owners and appear only to name the products.
- `library/reference/` holds frames from a Learn with Sumit YouTube video used as a style reference; they belong to their creator.
