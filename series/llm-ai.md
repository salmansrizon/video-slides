# Series: LLM & AI

Talks rise in Level; each still stands alone. Status: idea → outline (awaiting approval) → script (awaiting approval) → deck → recorded.

| # | Talk | Level | Arc | Evidence | Status |
|---|---|---|---|---|---|
| 1 | বাংলায় ChatGPT কেন বেশি খরচ করে? (`bangla-token-cost`) | Beginner | Experiment → surprise | Experiment: same 1012 sentences in Bangla and English through 8 tokenizers: 5.9× (GPT-4), 1.7× (GPT-4o), 0.59× (BanglaBERT) | deck in progress |
| 2 | ChatGPT কীভাবে উত্তর বানায়, আর কেন 'জানি না' বলে না (`why-ai-hallucinates`) | Intermediate | Mystery → reveal | Published results + Illustrations | deck in progress |
| 3 | Overfitting: মুখস্থ বনাম বোঝা | Intermediate | Experiment → surprise | Train a small model; watch training score rise while test score falls | idea |
| 4 | AI কিছু মনে রাখে না: Context window, RAG আর ৯টা নিয়ম (`context-window-rag`) | Intermediate | Rules | Published results + Illustrations | deck in progress |
| 5 | Prompt injection: AI-কে hack করতে একটা বাক্যই যথেষ্ট (`prompt-injection`) | Advanced | Incident timeline → lessons | Published results + Illustrations | deck in progress |
| 6 | Accuracy মিথ্যা বলে: AI-কে কীভাবে মাপবেন | Advanced | Mystery → reveal | Same model scored by accuracy vs recall on imbalanced data | idea |

Each Talk lives in `scripts/<slug>.txt` and `decks/<slug>/` (Outline and sources in `decks/<slug>/research/`, plus the Experiment when there is one).

## Batch 2 (2026-11-09): Talks 2, 4, 5

Picked by YouTube demand (vidIQ, monthly searches): "prompt injection" 48.7k and rising 86%, "indirect prompt injection" 6.8k at low competition, "ethical hacking" with 21% of its search share from Bangladesh; "what is rag" 54.7k; "how chatgpt works" 54.2k, "ai hallucination explained" 4.7k at low competition. No local Experiments in this batch (the presenter's call): numbers come from published sources, and examples are labelled Illustrations.
