# Every Deck gets its own Look; no shared channel brand (superseded by 0003)

Each Deck is designed with its own palette, typefaces and visual world for its topic, and no Look is reused, even inside a Series. The presenter chose variety and topic fit over a recognisable channel style: the Talks should each feel made for their subject. What stays constant is the voice of the Script and the runtime (`lib/deck.js`), not the appearance.

## Consequences

- `lib/deck.css` is only a neutral base; each Deck sets its own tokens, fonts and components in its `<style>` block.
- Bangla type needs several Bengali fonts saved in `vendor/fonts/` (not only Anek Bangla), added through `vendor/update.mjs`.
- Viewers recognise the channel by the presenter, voice and face cam, not by slide design.
