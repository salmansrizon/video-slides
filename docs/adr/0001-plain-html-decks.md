# Decks are plain HTML opened from disk, not a React app

Decks are single HTML files that open by double-click, using classic scripts copied into `vendor/`. The user wanted no build step and no server, and records each Deck live in Chrome themselves. That rules out the real shadcn/ui components, which need React and a build. The shadcn look comes from Basecoat instead (same theme variables, plain HTML classes), and Three.js is bundled once into a classic script because it only ships as ES modules, which browsers block on file://.

## Considered Options

- Vite + React + Reveal.js 6 (`@revealjs/react`) + real shadcn/ui: rejected, needs npm and a dev server for every Deck.
- Slidev (Markdown + Vue): rejected, same build/server cost, and it would mean shadcn-vue instead of shadcn/ui.
- CDN links: rejected in favour of `vendor/` copies, so a slow network can't stall a recording and versions never change by surprise.

## Consequences

- Anything that would use `fetch()` (Lottie JSON, glTF models, WebGL textures) must be wrapped with `tools/embed.mjs`.
- Reveal 6 marks off-screen Slides `hidden`, so `lib/deck.js` briefly lays each Slide out (unpainted) to build its animations at startup.
