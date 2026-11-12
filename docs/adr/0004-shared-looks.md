# A Look may be shared: lib/looks/, starting with Clay

Extends [0003](0003-shared-talk-format.md). A Talk may load a ready-made Look from `lib/looks/` instead of writing its own skin. The first is **Clay** (`lib/looks/clay.css`), modelled on Lydia Hallie's "Rethinking Claude Code Best Practices" talk (`library/reference/lydia-hallie-claude-code-vlfCjWuv4es/STYLE.md`): warm olive charcoal, a clay-coral agent line, green checks, pink failures, lavender people, and calm motion where one diagram changes in place across Steps.

The presenter liked the reference enough to reuse it across Talks, and copying the colours into each Deck would drift.

## Decisions

- **Fonts stay the Talk fonts.** The reference uses a serif for titles. The presenter kept Inter + Anek Bangla everywhere; Clay gets its calm from lighter weights instead.
- **Its signature parts are in the Talk kit, not the Look**, so any Talk can use them in any skin:
  - the agent trajectory: `.traj` with the `traj` and `node` presets, and `.frame` for a sandbox box
  - the code panel: `.code` with the `line` preset for added / current / deleted lines
- A Look file only overrides the variables and weights. It does not change the layout or the face-cam zone (0003 still holds).

## Consequences

- Load order: `deck.css` → `talk.css` → `looks/<name>.css` → the Deck's own `<style>`.
- `decks/look-clay/` is the specimen Deck; copy Slides from it.
- Not built yet (add when a Talk needs them): branching trajectories, a fail arc back to a checkpoint, the fleet table of task rows.
