# Outline: বাংলায় ChatGPT কেন বেশি খরচ করে?

**Series:** LLM & AI, Talk 1 · **Level:** Beginner (12–15 min, 16 Slides; Script: `scripts/bangla-token-cost.txt`) · **Arc:** Experiment → surprise
**Promise to the viewer:** After this, you know what a token is, why the same message costs more in Bangla, and how to check it for your own app.

## The angle
Everyone says "AI charges per token". Nobody shows a Bangla speaker what that means for *them*. We run the experiment ourselves: the same 1012 professionally translated sentences, in English and in Bangla, through 8 real tokenizers. The numbers are ours.

## Story beats
1. **Hook: two bills for one message.** The same sentence, English vs Bangla, shown as two receipts. Under GPT-4's tokenizer: 11 tokens vs 71. "একই কথা, ছয় গুণ বিল। কেন?"
2. **Analogy: the telegram.** In the telegram era you paid per word, so people wrote "ARRIVING TUESDAY STOP". AI bills per *token*, a piece of a word.
3. **What a token is.** Show the sentence split into pieces: English words are mostly one piece each; Bangla letters break into many small pieces.
4. **Why: the tokenizer learned from mostly English text.** Frequent chunks become single tokens. Common English words made it in; Bangla words didn't, so they get chopped. (Simple, no maths.)
5. **The Experiment.** 1012 sentences (FLORES-200), 8 tokenizers, real counts.
6. **Result 1: the old models.** GPT-2/3: Bangla needs 9.6× the tokens. GPT-3.5/GPT-4: 5.9×. That is 8.2 tokens per Bangla word against 1.2 per English word.
7. **Result 2: it got better.** GPT-4o and later (incl. GPT-5): 1.7×. Same sentence: 71 → 22 tokens. Mistral Nemo 1.9×, Qwen 2.5 still 5.0×.
8. **The surprise.** A tokenizer trained for Indian languages (Sarvam-1, IndicBERT v2): about 1×. One trained on Bangla (BanglaBERT): **English** becomes the expensive one, 0.59×. "সমস্যাটা বাংলা ভাষার নয়, কোন ডেটা দেখে tokenizer শিখেছে, তার।"
9. **What it costs you.** Money: price per token is the same for every language, so a 1.7× token count is a 1.7× bill (5.9× on GPT-4-era models). Memory: the context window holds less Bangla text. Speed: more tokens to generate means a longer wait (inference, not measured).
10. **Researchers saw it too.** Petrov et al. (NeurIPS 2023): up to 15× between languages. Ahia et al. (2023): many languages are "overcharged while obtaining poorer results".
11. **What to do.** Count tokens before you build (tiktoken, one line). Price your app with Bangla text, not English. Prefer models with newer tokenizers. For Bangla-heavy products, compare an Indic-trained model too. Don't just translate everything to English without checking answer quality.
12. **Limits.** Tokens are not quality. FLORES is news-style text; chat Bangla may differ. Claude and Gemini weren't measured (their tokenizers aren't public).
13. **Close + comment question.** "আপনার app-এ কতটা বাংলা? এক মাসে কত token যায়, কমেন্টে জানান।"

## Experiment (done, numbers final)
`experiment/README.md`. Bangla ÷ English tokens: GPT-2/3 9.60×, GPT-3.5/4 5.88×, GPT-4o+ 1.71×, Qwen 2.5 5.02×, Mistral Nemo 1.94×, Sarvam-1 1.11×, IndicBERT v2 1.02×, BanglaBERT 0.59×.

## Demo (offline, live in the Slide)
A token counter in the deck: you type or paste Bangla and English, and it splits them into coloured pieces and counts them with the real GPT-4 and GPT-4o tokenizers, bundled so it works with no internet.

## Look (my proposal; I design it after the Script)
A shop-receipt world: cream thermal paper on a dark counter, a mono font for the line items, each sentence printed as a bill where every token is a line item with a price. The English receipt is short; the Bangla one keeps printing. Unique to this Talk.

## Sources
`SOURCES.md`. One item is unverified (OpenAI's GPT-4o post, blocked to automated fetching) and is not needed for any claim.
