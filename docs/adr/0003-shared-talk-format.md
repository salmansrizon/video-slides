# Talks share one format; only the skin is unique per Deck

Supersedes [0002](0002-unique-look-per-deck.md). Every Talk Deck uses the Slide layout and parts kit first built in `decks/sustainable-ai-coding`: dark background, title top-left (with a number badge for numbered rules), lead line, content made from the kit (cards, pills, list items, flows, stamps, rule card, terminal), source line bottom-left, face-cam zone. A Deck may change colours, fonts, shapes and motion, and adds its own graphs and simulations inside the kit's cards.

After building four Decks as separate visual worlds (receipts, exam sheet, light table, UV desk), the presenter chose a consistent, readable layout over per-topic worlds: dark backgrounds read better on video, and viewers get one familiar structure across the series.

## Consequences

- The format lives in `lib/talk.css` (variables for the skin) and `lib/talk.js` (Talk keys, face-cam guide). Decks load both and override variables; they don't restyle the layout.
- No full-screen scene or bright ground. A topic's metaphor may show up in the skin (accent colour, typeface, motion) and inside a card, not as the whole Slide.
- `decks/sustainable-ai-coding` and `decks/ai-agent-system-design` keep their inline copies of the kit.
