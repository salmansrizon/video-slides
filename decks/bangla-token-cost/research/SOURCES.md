# Sources: বাংলায় ChatGPT কেন বেশি খরচ করে?

## Our Experiment
- `experiment/README.md`, `results.json`, `example.json`: 1012 parallel sentences counted with 8 real tokenizers, run 2026-11-09.
- Text: FLORES-200 devtest (`eng_Latn`, `ben_Beng`), NLLB Team, Meta AI, CC BY-SA 4.0. https://github.com/facebookresearch/flores (licence listed in the repo README). Sentences shown on slides are credited as "FLORES-200 (CC BY-SA 4.0)".
- Which model uses which tokenizer: OpenAI `tiktoken` 0.14.0, `encoding_name_for_model` (GPT-3.5 and GPT-4 → `cl100k_base`; GPT-4o, GPT-4.1, o1, o3, o4-mini, GPT-5 → `o200k_base`). https://github.com/openai/tiktoken
- Tokenizer files: Qwen/Qwen2.5-7B-Instruct, mistralai/Mistral-Nemo-Instruct-2407, sarvamai/sarvam-1, ai4bharat/IndicBERTv2-MLM-only, csebuetnlp/banglabert on huggingface.co.

- Live Demo and token pieces on the slides: `js-tiktoken` 1.0.21 (MIT) with OpenAI's `cl100k_base` and `o200k_base` ranks, bundled offline in `vendor/js-tiktoken/`. Its counts match the Python Experiment (11/71 and 11/22 tokens for the example pair).
- Fonts for this Look: IBM Plex Mono and Hind Siliguri (SIL OFL 1.1), in `vendor/fonts/`.

## Pricing and limits are per token
- OpenAI Cookbook, "How to count tokens with tiktoken": token counts tell you "whether the string is too long for a text model to process and … how much an OpenAI API call costs (as usage is priced by token)". https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb

## Research that found the same gap
- Petrov, La Malfa, Torr, Bibi. "Language Model Tokenizers Introduce Unfairness Between Languages." NeurIPS 2023. Same translated text can differ in token length "up to 15 times in some cases". https://arxiv.org/abs/2305.15425
- Ahia, Kumar, Gonen, Kasai, Mortensen, Smith, Tsvetkov. "Do All Languages Cost the Same? Tokenization in the Era of Commercial Language Models." arXiv 2023. Across 22 languages on OpenAI's API, speakers of many languages "are overcharged while obtaining poorer results". https://arxiv.org/abs/2305.13707

## Not verified (could not fetch; check in a browser before recording)
- OpenAI's GPT-4o launch post (May 2024) describing the new tokenizer's gains for non-English languages: https://openai.com/index/hello-gpt-4o/. The talk does not depend on it; our own Experiment shows the `cl100k_base` → `o200k_base` change directly.
