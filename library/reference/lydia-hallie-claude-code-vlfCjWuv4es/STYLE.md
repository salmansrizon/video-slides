# Style reference: Lydia Hallie, "Rethinking Claude Code Best Practices"

https://www.youtube.com/watch?v=vlfCjWuv4es (17:31, AI Engineer Code Summit, Anthropic). The whole video is slides, with a small square face cam in the bottom-right corner, which is the same setup as our Talks. `frames-*.jpg` show one frame every ~10 s (from YouTube storyboards, 320×180, so the colours below are estimates). `key-frames.jpg` enlarges 14 of them.

## The look

- **Ground:** solid warm charcoal, slightly olive (~#1f1f1c), with no grid, glow or texture. Every Slide is one diagram on the ground with lots of empty space.
- **Type:** two families.
  - **Titles** use a light, high-contrast serif in sentence case, centred above the diagram ("In the loop", "Can I take it back?", "Hooks", "Thank you"), or top-left on the cover.
  - **Labels and body** use a small, clean geometric sans.
  - **Code** uses mono.
  - Big numbers ("2,500 → 30,000+", "14% / 89%") are also set in the light serif.
- **Cards:** a slightly lighter warm grey (~#2a2a26) with no border or a hairline, a 10–14px radius and little padding. Labels sit in small chips of the same colour ("Edit ✓", "Bash npm test").
- **Palette:** four colours, each with one meaning.
  - coral / terracotta (~#d9776a): the agent's path, arrows, the "→" mapping
  - green (~#5fd36b): a passing check (filled square with ✓), "allowed", "Yes", "what we wanted"
  - pink-red (~#e8507a): failure, blocked, deny rules, "No", the ✕ dot, rows highlighted as danger
  - lavender / periwinkle (~#9b9cf5): the human (user avatar icons, "approving it", "14% caught by people")
  - plus one muted blue line for the benchmark chart
- **Code panels:** a file path tab ("CLAUDE.md", ".claude / settings.json") above numbered mono lines. One line is highlighted green (added), a row is grey (current), or text is struck through (deleted).

## Signature motif: the agent trajectory

A thin coral **wavy line** runs left → right from a small hollow circle to an end square (empty grey → green ✓ when done). Most Slides are built on it:

- Tool calls are **dots on the line** with chip labels below ("Read", "Edit ✓", "Bash npm test ✓"). A dangerous call is a **pink chip** ("Bash git reset --hard ✕").
- Human interventions are **lavender avatar icons** above or below the line, with speech chips ("Fix the code, not the test").
- **Checkpoints** are green ✓ squares placed along the line. A **red ✕** sends a dotted arc back to an earlier checkpoint ("exit 2 goes back to fix it").
- **Branching:** the line fans out into many paths, each ending in a ✓ / ✕ square with a one-line outcome ("moved, but the old API is still there").
- **Boxing:** the line is put inside a rounded outline = a sandbox or cloud environment (with a small ☁ icon). A **dashed** outline means it is unprotected.
- **Fleet view:** many rows (one rounded row per task: ☁ name, a mini trajectory, an end box), then PR / CI / review / merged columns of circular icons.

## Recurring Slide types

1. **Cover:** a serif title top-left with the name below, and trajectories fanning out from a row of avatars on the right.
2. **Chart:** a single smooth line with % labels on the points and model names with dates along the bottom. The last value is bold.
3. **Big number:** "A → B" in light serif, with small grey captions under each value and a source line at the bottom.
4. **Concept cards:** a row of 2–5 equal cards, each with a tiny line illustration on top and a label below. The next state dims some cards (out of the loop).
5. **Stat + dot grid:** a big % with a caption, and a grid of tiny people / dots below where the counted ones are lit.
6. **Two-column verdict:** "Yes" (green) vs "No" (pink) headers, each with a short note on the right, then bullet chips.
7. **Mapping table:** rows of "problem → solution", with a coral arrow between grey and white text (used as the recap).
8. **Prompt chip:** the user's request sits top-right as a small chip, like a chat bubble ("auth.test.ts is failing, can you fix it?").

## Motion (inferred from consecutive frames)

The same diagram stays on screen across many Steps while parts change in place: a row lights up, a chip turns pink, a box gets outlined, earlier parts dim to ~35 %, a line is drawn on. There are no transitions between Slides, and nothing flies across the screen. The calm comes from re-using one diagram.

## Built from this

- **Look:** Clay, `lib/looks/clay.css` ([docs/adr/0004](../../../docs/adr/0004-shared-looks.md)). Fonts stay Inter (decided 2026-11-12: no serif titles).
- **Parts in the Talk kit:** the `.traj` trajectory, the `.frame` sandbox box and the `.code` panel with line Steps.
- **Specimen:** `decks/look-clay/`.
- **Not built yet:** branching, the fail arc back, and the fleet table.
