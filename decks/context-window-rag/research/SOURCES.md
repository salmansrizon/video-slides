# Sources: Context window ও RAG (AI কিছু মনে রাখে না, শুধু আবার পড়ে)

All fetched 2026-11-09. Table numbers were read from the arXiv HTML versions; spot-check them against the PDF tables before recording.

## Our Experiment (reused from Talk 1, no new run)
- `decks/bangla-token-cost/research/experiment/README.md`. Bangla ÷ English tokens: `o200k_base` (GPT-4o, GPT-4.1, o1, o3, o4-mini, GPT-5) **1.71×**; `cl100k_base` (GPT-3.5, GPT-4) **5.88×**. "Tokens per word, English vs Bangla: `cl100k_base` 1.24 vs 8.20, `o200k_base` 1.23 vs 2.36". The values derived from these are Illustrations:
  - 800 tokens ≈ 650 English / 340 Bangla / 100 Bangla (cl100k) words;
  - 500 pages ÷ 1.71 ≈ 290;
  - 105,000 × 1.71 ≈ 1.8 lakh.
- Demo tokenizers: `vendor/js-tiktoken/` (bundled for Talk 1, MIT).

## AI rereads the whole conversation every turn (beats 1–3, 5)
- OpenAI, Conversation state guide: "each text generation request is independent and stateless". To keep context: "include the model's previous response output as input, and append that input to your next request." https://developers.openai.com/api/docs/guides/conversation-state
- Anthropic, Context windows doc. Each turn's input phase "Contains all previous conversation history plus the current user message". The context window "represents a 'working memory' for the model". It is "different from the large corpus of data the language model was trained on". https://platform.claude.com/docs/en/build-with-claude/context-windows
  - Same page, sliding window: "Chat interfaces such as claude.ai can also manage the context window on a rolling 'first in, first out' basis."
  - Same page, compaction: "Compaction automatically summarizes earlier parts of the conversation on the server".
  - Same page, context rot: "more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as *context rot*."
- Prompt caching price (beat 3, beat 10). Anthropic Pricing: cache read is "0.1x base input price (0.025x on Claude Fable 5.1 and Claude Mythos 5.1; 0.05x on Claude Opus 5.5 and Claude Sonnet 5.5)". Claude Sonnet 5.5 is "$2 / MTok" base input and "$0.10 / MTok" for cache hits. https://platform.claude.com/docs/en/about-claude/pricing

## How big the desk is (beat 4)
- 2023, Liu et al. §2.2: "GPT-3.5-Turbo has a maximum context length of 4K tokens"; "Claude-1.3 (100K) has an extended context length of 100K tokens." https://arxiv.org/html/2307.03172v3
- Anthropic Models overview, context window row for Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5: "1M tokens". Note: "1M tokens is roughly 555k words or 2.5M Unicode characters on the current tokenizer". https://platform.claude.com/docs/en/about-claude/models/overview
- OpenAI, GPT-6.1 Sol model page: "1,050,000 context window". https://developers.openai.com/api/docs/models/gpt-6.1-sol (the flagship list at https://developers.openai.com/api/docs/models shows 1.05M for GPT-6 Astra, GPT-6.1 Sol, GPT-6.1 Terra and GPT-6 Luna)
- Google AI Studio models page: Gemini 4 Argon (`gemini-4-argon`), context "1M tokens". https://aistudio.google.com/docs/models

## Lost in the Middle (beats 6–7, Graph 1)
- Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni, Liang. "Lost in the Middle: How Language Models Use Long Contexts." TACL vol. 12 (2024), pp. 157–173, DOI 10.1162/tacl_a_00638. https://aclanthology.org/2024.tacl-1.9/ · https://arxiv.org/abs/2307.03172
  - Finding: "performance is often highest when relevant information occurs at the beginning or end of the input context"; "we observe a distinctive U-shaped performance curve."
  - Setup (§2.1): "We instantiate this task with data from NaturalQuestions-Open"; "passages (chunks of at most 100 tokens) from Wikipedia"; "exactly one of the documents contains the answer".
  - Table 6 (20 total retrieved documents), row GPT-3.5-Turbo: Index 0 / 4 / 9 / 14 / 19 = **75.8% / 57.2% / 53.8% / 55.4% / 63.2%**. "Index n" means position n+1, so these are positions 1 / 5 / 10 / 15 / 20.
  - Table 1, GPT-3.5-Turbo: Closed-Book **56.1%**, Oracle **88.3%**.
  - The surprise, §2.3: "in the worst case, performance in 20- and 30-document settings is lower than performance without _any_ input documents (i.e., closed-book performance; 56.1%)."

## Claimed vs effective window (beat 8, Graph 2)
- NoLiMa. Modarressi, Deilamsalehy, Dernoncourt, Bui, Rossi, Yoon, Schütze (LMU Munich; Adobe Research). ICML 2025. https://arxiv.org/abs/2502.05167 · https://arxiv.org/html/2502.05167v3
  - Abstract: "We evaluate 13 popular LLMs that claim to support contexts of at least 128K tokens"; "At 32K, for instance, 11 models drop below 50% of their strong short-length baselines". GPT-4o "experiences a reduction from an almost-perfect baseline of 99.3% to 69.7%."
  - Example (§3): needle "Actually, Yuki lives next to the Semper Opera House." Question: "Which character has been to Dresden?"
  - Table 3 (accuracy % at 1K / 2K / 4K / 8K / 16K / 32K):
    - GPT-4o: claimed 128K, effective 8K, base 99.3; 98.1 / 98.0 / 95.7 / 89.2 / 81.6 / **69.7**.
    - Llama 3.3 70B: claimed 128K, effective 2K, base 97.3; 94.2 / 87.4 / 81.5 / 72.1 / 59.5 / **42.7**.
    - Claude 3.5 Sonnet: claimed 200K, effective 4K, base 87.5; 85.4 / 84.0 / 77.6 / 61.7 / 45.7 / **29.8**.
    - Gemini 1.5 Pro: claimed 2M, effective 2K, base 92.6; 86.4 / 82.7 / 75.4 / 63.9 / 55.5 / 48.2.
- RULER. Hsieh et al. (NVIDIA), COLM 2024. https://arxiv.org/abs/2404.06654 · https://arxiv.org/html/2404.06654 (v3)
  - Abstract: "almost all models exhibit large performance drops as the context length increases"; "only half of them can maintain satisfactory performance at the length of 32K". The 17 evaluated models all claim 32K or more.
  - Table 3: GPT-4, claimed 128K, effective 64K, scores 96.6 (4K) → 81.2 (128K). Llama3.1 (70B): 96.5 → 66.6. Effective length: "The effective context length is the maximum length passing this threshold" (Llama2-7B at 4K = 85.6).

## Length alone hurts (beat 9)
- Du, Tian, Ronanki, Rongali, Bodapati, Galstyan, Wells, Schwartz, Huerta, Peng. "Context Length Alone Hurts LLM Performance Despite Perfect Retrieval." Findings of EMNLP 2025. https://arxiv.org/abs/2510.05381
  - Performance "still degrades substantially (13.9%--85%) as input length increases". The drop persists with "minimally distracting whitespace". The fix is to have the model "recite the retrieved evidence before attempting to solve the problem."
- Chroma. Hong, Troynikov, Huber, "Context Rot: How Increasing Input Tokens Impacts LLM Performance", 14 July 2025. 18 LLMs, including Claude Opus 4, GPT-4.1 and Gemini 2.5 Pro. https://www.trychroma.com/research/context-rot
  - "model performance degrades as input length increases, often in surprising and non-uniform ways"; "models do not use their context uniformly"; NIAH "is a simple lexical retrieval task".
  - LongMemEval: "Across all models, we see significantly higher performance on focused prompts compared to full prompts" (about 300 vs about 113k tokens).
  - Distractors (used in Limits): "Even a single distractor reduces performance relative to the baseline".
- Anthropic docs "context rot" quote: see the first section above.

## Cost and wait (beat 10, Graph 3)
- Anthropic, Prompt caching announcement (fetched at https://claude.com/blog/prompt-caching, redirected from https://www.anthropic.com/news/prompt-caching). The page shows Aug 14, 2025; the original announcement was 2024 and the numbers are from that era's model. Table, latency as time to first token:
  - "Many-shot prompting (10,000 token prompt)": **1.6s** without caching, 1.1s with;
  - "Chat with a book (100,000 token cached prompt)": **11.5s** without caching, 2.4s (-79%) with.
- Anthropic Pricing, Long context pricing: "(A 900k-token request is billed at the same per-token rate as a 9k-token request.)" https://platform.claude.com/docs/en/about-claude/pricing
- OpenAI, GPT-6.1 Sol: "API prompts with more than 272K input tokens are priced at 2x input and cache rates and 1.5x output for the full request." Input "$2" per 1M tokens. https://developers.openai.com/api/docs/models/gpt-6.1-sol
- Honest nuance (Script only), OpenAI Latency optimization: "cutting 50% of your prompt may only result in a 1–5% latency improvement"; "Unless you're working with truly massive context sizes (documents, images), you may want to spend your efforts elsewhere." https://developers.openai.com/api/docs/guides/latency-optimization
- The daily-bill math is an Illustration on the official Sonnet 5.5 prices above: 1,000 questions × 1M tokens × $2/MTok = $2,000; cached at $0.10/MTok ≈ $100 (cache writes excluded); 20 × 800-token chunks = 16K tokens ≈ $32.

## RAG: the original paper (beat 11)
- Lewis, Perez, Piktus, Petroni, Karpukhin, Goyal, Küttler, Lewis, Yih, Rocktäschel, Riedel, Kiela (Facebook AI Research; University College London; New York University). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS 2020. https://arxiv.org/abs/2005.11401 · full text: https://ar5iv.labs.arxiv.org/html/2005.11401
  - Combines "parametric and non-parametric memory"; "dense vector index of Wikipedia"; "pre-trained neural retriever".
  - "Each Wikipedia article is split into disjoint 100-word chunks, to make a total of 21M documents." Uses "the December 2018 dump". The top k documents are retrieved, with k = 5 or 10 in training.
  - "RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline."

## Pipeline, embeddings, chunks (beats 12, 13, 15)
- OpenAI, Embeddings guide: an embedding is "a vector (list) of floating point numbers". "The distance between two vectors measures their relatedness." "Small distances suggest high relatedness". "the length of the embedding vector is `1536` for `text-embedding-3-small`". https://developers.openai.com/api/docs/guides/embeddings
- OpenAI, Retrieval guide: "By default, `max_chunk_size_tokens` is set to `800` and `chunk_overlap_tokens` is set to `400`"; "`max_chunk_size_tokens` must be between 100 and 4096 inclusive." https://developers.openai.com/api/docs/guides/retrieval
- Anthropic, "Introducing Contextual Retrieval", Sep 19, 2024. https://www.anthropic.com/news/contextual-retrieval
  - Chunks: "In traditional RAG, documents are typically split into smaller chunks for efficient retrieval"; chunks are "usually no more than a few hundred tokens".
  - Orphan-chunk example: "The company's revenue grew by 3% over the previous quarter." With context added: "This chunk is from an SEC filing on ACME corp's performance in Q2 2023; the previous quarter's revenue was $314 million."
  - Cost assumption: "Assuming 800 token chunks, 8k token documents, 50 token context instructions, and 100 tokens of context per chunk".

## Bangla retrieval quality depends on the model (beat 13, last click)
- Chen, Xiao, Zhang, Luo, Lian, Liu (USTC; BAAI). "M3-Embedding: Multi-Linguality, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation." https://arxiv.org/html/2402.03216
  - Table 1, "Multi-lingual retrieval performance on the MIRACL dev set (measured by nDCG@10)", bn column: BM25 48.2, **mDPR 44.3**, mE5large 75.9, **M3-Embedding (Dense) 80.0**, M3 (All) 81.5. Column order checked: Avg, ar, bn, en…

## Small knowledge base: give it all (beat 14)
- Anthropic, Contextual Retrieval: "If your knowledge base is smaller than 200,000 tokens (about 500 pages of material)", "you can just include the entire knowledge base in the prompt that you give the model", "with no need for RAG or similar methods." https://www.anthropic.com/news/contextual-retrieval
- Li, Li, Zhang, Mei, Bendersky (Google DeepMind). "Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach." EMNLP 2024 industry track. https://arxiv.org/abs/2407.16833 · https://arxiv.org/html/2407.16833
  - "when resourced sufficiently, LC consistently outperforms RAG in terms of average performance"; "RAG's significantly lower cost remains a distinct advantage."
  - "the predictions from LC and RAG are identical for over 60% of queries."
  - Self-Route: "the cost is reduced by 65% for Gemini-1.5-Pro and 39% for GPT-4O."

## Hybrid search (beat 16, Graph 4)
- Anthropic, Contextual Retrieval (top-20 retrieval failure rate, baseline 5.7%). https://www.anthropic.com/news/contextual-retrieval
  - "Contextual Embeddings reduced the top-20-chunk retrieval failure rate by 35%" (5.7% → **3.7%**).
  - "Combining Contextual Embeddings and Contextual BM25 reduced the top-20-chunk retrieval failure rate by 49%" (5.7% → **2.9%**).
  - "Reranked Contextual Embedding and Contextual BM25 reduced the top-20-chunk retrieval failure rate by 67%" (5.7% → **1.9%**).
  - Exact-match example: "BM25 looks for this specific text string to identify the relevant documentation" (the TS-999 error-code example).

## Bangla farmers' queries (beat 17, Graph 5)
- Reza, Maria, Nimi (North South University, Dhaka). "Where Does Retrieval Fail? Evaluating RAG Architectures for Agricultural Advisory." arXiv 2608.14886, submitted 14 Aug 2026. **Preprint, not peer-reviewed.** https://arxiv.org/abs/2608.14886 · https://arxiv.org/html/2608.14886v1
  - Setup: 1,000 queries, 2,882 knowledge nodes from 284 official Bangladeshi agricultural publications. Three conditions: "Bengali queries against the Bengali KB (BN→BN)", "English queries against the Bengali KB (EN→BN, cross-lingual)", "English queries against the translated English KB (EN→EN)".
  - R@10 by query type, BN→BN, 900 answerable queries, Dense (Gemini-embedding-001) / BM25:
    - Farmer (colloquial, 300): **0.093 / 0.523**;
    - Safety (formal, 200): **0.970 / 0.539**;
    - KG-grounded (formal, 400): 0.489 / 0.478.
    - Overall: BM25 0.506, Hybrid RRF 0.539 (best).
  - Why: "Farmers describe observable symptoms" while "authoritative documents encode formal scientific entities"; "only 3.5% of gold document entity names appear verbatim in farmer queries".
  - Cross-language: BM25 0.506 (BN→BN) → **0.004** (EN→BN); Dense 0.464 → **0.425**.
  - Settings (Limits): "Using a sentence-similarity task type instead of the asymmetric RETRIEVAL_QUERY/RETRIEVAL_DOCUMENT encoding" "reduced Gemini Dense R@10 from 0.464 to 0.063".

## Models are improving (Limits only, company-reported)
- Anthropic, "Introducing Claude Opus 4.6", Feb 5, 2026: on the "8-needle 1M variant of MRCR v2", Opus 4.6 "scores 76%, whereas Sonnet 4.5 scores just 18.5%." https://www.anthropic.com/news/claude-opus-4-6

## Existing videos (colour only, no numbers on screen)
- IBM Technology, "What is Retrieval-Augmented Generation (RAG)?" (video ID T-D1OfcDW1M, about Aug 2023, Marina Danilevsky; planets example and a content store). Known only from third-party summaries: https://my.infocaptor.com/hub/summaries/ibm-technology/what-is-retrieval-augmented-generation-rag-T-D1OfcDW1M · https://lilys.ai/en/notes/llm-full-course-20260108/retrieval-augmented-generation-rag
- KodeKloud, "RAG Explained For Beginners": https://recapio.com/digest/rag-explained-for-beginners-by-kodekloud. Krish Naik, "Complete RAG Crash Course With Langchain In 2 Hours": https://recapio.com/digest/complete-rag-crash-course-with-langchain-in-2-hours-by-krish-naik. freeCodeCamp, "Production RAG with LangChain & Vector Databases – Full Course": https://www.pulse.bot/ai/video/production-rag-with-langchain-vector-databases-full-course-f82ce19e-81ac-4fbc-9397-6bcf683e1b0d/
- Searches for Bangla RAG or context-window videos ("RAG বাংলা", "RAG কী", "context window কী") returned none. This is a search-engine limit; check YouTube directly.
- Demand: vidIQ figures given by the presenter ("what is rag" 54.7k/month, 44% India; "rag tutorial" 19.4k; "what is rag in ai" 7.8k; "rag llm" 14k).

## Not verified (could not fetch, or doubtful; no beat is built on these)
- OpenAI ChatGPT Memory FAQ (HTTP 403): https://help.openai.com/en/articles/8590148-memory-faq. I wanted it to show that ChatGPT's "memory" is itself notes put back into context. Not used.
- NVIDIA RULER GitHub repo (HTTP 504): https://github.com/NVIDIA/RULER. The paper's Table 3 (arXiv v3) was used instead.
- NeurIPS 2020 proceedings page for Lewis et al. (connection refused). arXiv and ar5iv were used.
- NSU preprint abstract: it says "embedding task configuration and passage length can each change reported R@10 by a factor of seven". The body supports ×7 only for task configuration (0.464 → 0.063). For passage length the body shows only 128 tokens = 0.376 vs 512 tokens = 0.487 (ColBERT/BGE-M3). The passage-length ×7 claim is not used.
- Anthropic prompt caching page date: it shows Aug 14, 2025, but the announcement and its latency table date from 2024 (older Claude models). The numbers are used as the vendor's own measurement, with that caveat.
- MRCR v2 figures for GPT-5.x and Gemini 3.x from secondary blogs (e.g. "26.3% at 1M"), plus a blog's "30% drop" attributed to LongMemEval: unverified against primary pages. Not used.
- Gemini pricing (https://aistudio.google.com/docs/pricing): fetched but not used on screen. The Gemini 4 Argon max-output figure ("65K / 1M") is ambiguous on the models page.
- Lost in the Middle authors' affiliations were not checked. The Script should not name a university for this paper.
