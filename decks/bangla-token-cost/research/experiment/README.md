# Experiment: how many more tokens does Bangla need?

Same 1012 sentences, professionally translated (FLORES-200 devtest, `eng_Latn` vs `ben_Beng`), counted with real tokenizers.
Run on 2026-11-09 with tiktoken 0.14.0 and tokenizers 0.22.2. Raw output: `results.json`, `example.json`.

| Tokenizer | Used by | English tokens | Bangla tokens | Bangla ÷ English |
|---|---|---:|---:|---:|
| `gpt2` | GPT-2, GPT-3 | 27,041 | 259,663 | **9.60×** |
| `cl100k_base` | GPT-3.5, GPT-4 | 27,182 | 159,784 | **5.88×** |
| `o200k_base` | GPT-4o, GPT-4.1, o1, o3, o4-mini, GPT-5 | 26,873 | 45,913 | **1.71×** |
| Qwen 2.5 | open model (Alibaba) | 27,621 | 138,710 | 5.02× |
| Mistral Nemo | open model | 27,827 | 53,986 | 1.94× |
| Sarvam-1 | LLM built for Indian languages | 31,419 | 34,945 | 1.11× |
| IndicBERT v2 | AI4Bharat, Indic languages | 27,075 | 27,592 | 1.02× |
| BanglaBERT | BUET, trained on Bangla | 45,399 | 26,629 | **0.59×** |

Model → tokenizer mapping is from OpenAI's `tiktoken` (`tiktoken.encoding_name_for_model`). Same text: 21,901 English words, 19,493 Bangla words.

Example pair (FLORES-200 devtest line 104, `example.json`): "Scientists say the explosion caused by the collision was massive." is 11 tokens under both OpenAI tokenizers; "বিজ্ঞানীরা জানাচ্ছেন সংঘর্ষের ফলে সৃষ্ট বিস্ফোরণ ছিল বিপুল।" is 71 under `cl100k_base` and 22 under `o200k_base`.

Tokens per word, English vs Bangla: `cl100k_base` 1.24 vs 8.20, `o200k_base` 1.23 vs 2.36, BanglaBERT 2.07 vs 1.37.

Not measured: Claude and Gemini (tokenizers not public), Llama and Gemma (gated downloads).

## Reproduce

```bash
# data (outside the repo)
curl -L -o flores200.tar.gz https://dl.fbaipublicfiles.com/nllb/flores200_dataset.tar.gz && tar -xzf flores200.tar.gz
# tokenizers into tok/ : Qwen/Qwen2.5-7B-Instruct, mistralai/Mistral-Nemo-Instruct-2407, sarvamai/sarvam-1,
#   ai4bharat/IndicBERTv2-MLM-only (tokenizer.json) and csebuetnlp/banglabert (vocab.txt), from huggingface.co/<model>/resolve/main/
python -P tokens.py flores200_dataset tok .
```
