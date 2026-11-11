# Outline: AI কিছু মনে রাখে না, শুধু আবার পড়ে: Context window, RAG আর ৯টা নিয়ম

**Series:** LLM & AI, Talk 4 · **Level:** Intermediate (18–22 min, 20 Slides; Script to come: `scripts/context-window-rag.txt`) · **Arc:** Rules (9 numbered rules)
**Title options:** main "AI কিছু মনে রাখে না: Context window, RAG আর ৯টা নিয়ম". For search ("what is rag" 54.7k, "what is rag in ai" 7.8k): "What is RAG? AI কতটা মনে রাখে: Context window ও RAG বাংলায়". The working title "Context window ও RAG: AI কতটা মনে রাখে" also works.
**Promise to the viewer:** After this, you know why AI "forgets", why a bigger window doesn't fix it, what RAG does step by step, and how to decide with numbers whether your Bangla documents need RAG or simply fit on the desk.

## The angle
AI doesn't remember a chat. It rereads the whole thing every time you send a message. The context window is a desk, not a library: whatever is on the desk is all it can read right now. Desks have grown to about 1M tokens in Nov 2026, but published measurements show that a bigger desk is not a fix:
- a fact in the middle gets missed;
- quality falls as the pile grows, even when the extra pile is blank;
- the bill and the wait grow with every page.

RAG is the Nilkhet answer: you don't photocopy the whole library, you photocopy the right four pages. Bangla makes all of this sharper. Our own Talk 1 Experiment shows Bangla fills the desk 1.71× faster on GPT-4o-era tokenizers (5.88× on GPT-4-era ones). A 2026 North South University study shows that Bangla retrieval fails when users ask the way they really talk.

**What existing videos do, and how this one differs.** Found by web search; the video details come from third-party summaries and are colour only.
- **What's out there:** the English explainers start at RAG.
  - IBM Technology's lightboard "What is RAG?" (2023) uses a planets question and a content store.
  - KodeKloud's "RAG Explained For Beginners" is another beginner explainer.
  - Krish Naik's 2-hour LangChain crash course and freeCodeCamp's production RAG course are code-alongs: a pipeline diagram, then code.
  - Web search found no Bangla RAG explainer, so check YouTube directly.
- **How this Talk differs:**
  - It starts from the window, i.e. why RAG has to exist.
  - It shows the real published curves (the U-curve, claimed vs effective length) instead of saying "LLMs have limited memory".
  - It gives a rule for when NOT to use RAG.
  - It works through Bangla with real numbers: our token ratio and a Bangladeshi farmers' retrieval study.
  - There is no code-along.

## Story beats (one Slide each; ▶ = one click; numbers' source in brackets)

1. **Hook: it doesn't remember, it rereads.** "একটা গোপন কথা বলি। ChatGPT আপনাকে মনে রাখে না। আপনি যতবার message পাঠান, সে পুরো কথোপকথন প্রথম লাইন থেকে আবার পড়ে।" Then the tease (inside 20 s): "আর আজকের সবচেয়ে অদ্ভুত তথ্য: ঠিক উত্তরটা হাতে ধরিয়ে দিলেও AI ভুল করতে পারে, শুধু সেটা মাঝখানে রাখলেই।" **[Simulation, Illustration]**
   - *Visual:* chat sheets on the lit glass. On every send, all earlier sheets slide back under a scan bar that sweeps top to bottom. A grease-pencil tally beside the pile reads "এবার পড়ল".
   - *Clicks:* ▶ message 1 and reply (500 tokens) ▶ message 2: the whole pile is swept again (1,000) ▶ jump to message 20: a long sweep, 10,000 ▶ one yellow-highlighted sheet sinks into the middle of a stack and dims (the tease).
   - *Numbers:* the mechanism is sourced. OpenAI: "each text generation request is independent and stateless". Anthropic: the input "contains all previous conversation history". The token counts are an Illustration (ধরা যাক 500 per turn).

2. **The analogy: a desk, not a library.** "AI-এর দুই রকম মনে রাখা। Training: বহু আগে পড়ে শেখা, আলমারিতে তালাবন্ধ। আর context window: সামনের টেবিল। এই মুহূর্তে সে শুধু টেবিলে যা আছে, তা-ই পড়তে পারে।" Anthropic's own docs call it the model's "working memory".
   - *Visual:* an overhead pull-back reveals the light table in a dim room, with a locked steel cabinet (training) at the edge in shadow. Text is readable only where the glass glows.
   - *Clicks:* ▶ the cabinet locks ▶ the glass lights up ▶ the "working memory" sheet lands.
   - *Numbers:* none (Anthropic docs quote).

3. **Rule 1: a long chat costs more on every turn.** "নিয়ম এক: যেহেতু প্রতিবার সব আবার পড়ে, chat যত লম্বা, প্রতিটা নতুন প্রশ্নের বিল তত বড়। ধরা যাক প্রতি দফায় ৫০০ token: বিশ নম্বর প্রশ্নে AI পড়ছে দশ হাজার token, বিশ দফায় মোট এক লাখ পাঁচ হাজার। বাংলায় লিখলে প্রায় ১.৮ লাখ।" Fixes: a new topic gets a new chat; apps use prompt caching, where a re-read cached part costs 5–10% of the base input price on Claude. **[Simulation, Illustration]**
   - *Visual:* a staircase of stacked sheets, one column per turn. The area of the triangle is the total tokens read.
   - *Clicks:* ▶ turns 1–5 ▶ fast-forward to 20 (105,000) ▶ a Bangla overlay grows each column ×1.71 ▶ caching: the repeated lower part of each column turns translucent.
   - *Numbers:* 500 per turn is an Illustration. 1.71× is our Talk 1 Experiment. The cache multipliers (0.05×, or 0.1× on most models) are from Anthropic's pricing page.

4. **The desk grew 250×.** "২০২৩-এ GPT-3.5-Turbo-র টেবিল ছিল ৪ হাজার token। আজ, ২০২৬-এর নভেম্বরে, Claude, GPT আর Gemini-র নতুন model-এর টেবিল প্রায় ১০ লাখ token; Anthropic-এর হিসাবে প্রায় সাড়ে পাঁচ লাখ শব্দ। তাহলে কি সব বই টেবিলে ঢেলে দিলেই হলো?"
   - *Visual:* the glass physically extends as the camera pulls back, from a postcard to a hall-sized table. Each size is a sheet pinned at the new edge.
   - *Clicks:* ▶ 4K (GPT-3.5-Turbo, 2023) ▶ 100K (Claude-1.3 100K, 2023) ▶ 1M (Claude Opus/Sonnet 5.5, Gemini 4 Argon) and 1.05M (GPT-6.1 Sol), 2026. In Vertical the glass grows downward.
   - *Numbers:* Liu et al. §2.2; the Anthropic, OpenAI and Google model docs; Anthropic's "1M tokens is roughly 555k words".

5. **Rule 2: when the desk is full, the oldest page falls off, and in Bangla it fills sooner.** "টেবিল যত বড়ই হোক, একদিন ভরবে। তখন chat app অনেক সময় সবচেয়ে পুরনো কথাটা সরিয়ে দেয়: আগে এলে আগে বাদ। আমাদের প্রথম ভিডিওর পরীক্ষা মনে আছে? একই কথা বাংলায় লিখতে GPT-4o-যুগের tokenizer-এ ১.৭১ গুণ token, GPT-4-যুগে ৫.৮৮ গুণ। মানে বাংলায় আপনার প্রথম নির্দেশটাই আগে পড়ে যায়।" Fixes: keep standing instructions in the system prompt or repeat them; some systems summarise old turns (Anthropic calls this compaction). **[Simulation + Demo, Illustration]**
   - *Visual:* two glasses holding the same conversation, English on the left and Bangla on the right (stacked top and bottom in Vertical). The Bangla sheets are 1.71× taller. When a sheet crosses the rim it slides into the dark.
   - *Clicks:* ▶ messages flow into both ▶ the first Bangla message falls off while English still holds it ▶ English loses it later ▶ the Demo opens.
   - *Numbers:* 1.71× and 5.88× are our Experiment. The FIFO behaviour is from Anthropic's docs ("rolling 'first in, first out'"). The desk size in the simulation is an Illustration.

6. **The experiment: is it read just because it's on the desk?** "২০২৩ সালের একটা গবেষণা। একটা প্রশ্ন, সাথে Wikipedia-র ২০টা ছোট পাতা। উত্তর আছে ঠিক একটা পাতায়, বাকি ১৯টা কাছাকাছি বিষয়ের, কিন্তু উত্তর নেই। তারপর উত্তরের পাতাটা সরিয়ে সরিয়ে দেখা হলো: প্রথমে, পঞ্চমে, দশমে… বিশে।"
   - *Visual:* 20 tracing sheets fanned on the glass. The yellow-highlighted answer sheet walks from position 1 to 20.
   - *Clicks:* ▶ question card ▶ 20 sheets ▶ the answer sheet walks.
   - *Numbers:* Liu et al. §2.1 (NaturalQuestions-Open, passages of at most 100 tokens, exactly one with the answer).

7. **Rule 3, and the surprise: the right page in the middle is worse than no page.** "উত্তর প্রথম পাতায় থাকলে GPT-3.5-Turbo ঠিক বলেছে প্রায় ৭৬%। শেষ পাতায় ৬৩%। মাঝখানে, দশ নম্বরে? ৫৪%। (থামুন) কোনো পাতাই না দিলে, শুধু নিজের মনে রাখা থেকে: ৫৬%। মানে ঠিক উত্তরটা হাতে দিলেন, মাঝখানে রাখলেন, আর ফল হলো না দেওয়ার চেয়েও খারাপ। আর শুধু ঠিক পাতাটা একা দিলে? ৮৮%।" Rule: "জরুরি কথা শুরুতে বা শেষে। প্রশ্নটা শেষে। আর কম পাতা, ঠিক পাতা।" **[Graph 1]**
   - *Visual:* the U-curve drawn on the glass in grease pencil, with the glass's brightness under it following the same curve (light = attention, driven by the data). A dashed closed-book line runs at 56.1 and an oracle marker sits at 88.3.
   - *Clicks:* ▶ points 1 and 20 ▶ points 5, 10 and 15 close the U ▶ the closed-book line drops in and the middle point sits below it ▶ the oracle point ▶ the rule note lands.
   - *Numbers:* Liu et al. Table 6 (75.8 / 57.2 / 53.8 / 55.4 / 63.2) and Table 1 (closed-book 56.1, oracle 88.3).

8. **Rule 4: read the working window, not the label.** "এবার নতুন model। ২০২৫-এর NoLiMa পরীক্ষায় প্রশ্ন আর উত্তরে একই শব্দ নেই। পাতায় লেখা: 'Yuki থাকে Semper Opera House-এর পাশে।' প্রশ্ন: 'কে Dresden গিয়েছে?' GPT-4o: ছোট লেখায় ৯৯%, ৩২ হাজার token-এ ৭০%। Claude 3.5 Sonnet ৮৮% থেকে ৩০%। অথচ গায়ে লেখা window ১ লাখ ২৮ হাজার, ২ লাখ।" NVIDIA's RULER agrees: all 17 models claim 32K or more, and only half stay satisfactory at 32K. "নিয়ম চার: গায়ের লেখা নয়, কাজের window দেখুন, নিজের ডেটায় মেপে।" **[Graph 2]**
   - *Visual:* the needle and question as two sheets, with a dotted inference line from "Opera House" to "Dresden". Then a line chart across 1K–32K on a log axis.
   - *Clicks:* ▶ the example sheets ▶ the GPT-4o line ▶ the Llama 3.3 70B and Claude 3.5 Sonnet lines ▶ the "claimed" markers (128K, 200K) slide in far right with an empty stretch of glass between ▶ the RULER sheet.
   - *Numbers:* NoLiMa Table 3; RULER abstract and Table 3.

9. **Second surprise: length alone hurts, even blank length.** "২০২৫-এর আরেক পরীক্ষায় AI দরকারি তথ্য ঠিকই খুঁজে পেয়েছে, তারপর বাকি জায়গা ভরা হলো শুধু ফাঁকা space দিয়ে। কিছুই লেখা নেই। তবু লেখা লম্বা হতেই ফল ১৪% থেকে ৮৫% পর্যন্ত খারাপ। Chroma ২০২৫-এ ১৮টা model মেপেছে, Claude Opus 4, GPT-4.1, Gemini 2.5 Pro সহ: input লম্বা হলে ফল খারাপ, প্রায়ই অসমানভাবে। আর আজ Anthropic-এর নিজের documentation-এ লেখা: বেশি context মানেই ভালো নয়; এর নাম context rot।"
   - *Visual:* blank sheets pile onto the glass and the yellow sheet's ink fades as they pile. The Anthropic docs line arrives as a printed sheet.
   - *Clicks:* ▶ the blanks pile up ▶ the range 13.9%–85% ▶ the Chroma line ▶ the Anthropic quote.
   - *Numbers:* Du et al. (Findings of EMNLP 2025); Chroma; Anthropic's context-windows doc.

10. **Rule 5: a bigger desk means a bigger bill and a longer wait.** "Anthropic-এর নিজের মাপে: ১০ হাজার token-এর prompt-এ উত্তরের প্রথম শব্দ আসতে ১.৬ সেকেন্ড, ১ লাখ token-এ ১১.৫ সেকেন্ড। দাম? Anthropic লিখেছে, ৯ লাখ token-এর request আর ৯ হাজার token-এর request একই rate-এ বিল হয়: rate একই, বিল একশো গুণ। OpenAI-এর GPT-6.1 Sol-এ ২ লাখ ৭২ হাজার token পেরোলে পুরো request-এর input দ্বিগুণ দাম। ধরা যাক Claude Sonnet 5.5-এ প্রতি প্রশ্নে পুরো ১০ লাখ token: দিনে ১০০০ প্রশ্নে শুধু input ২,০০০ ডলার; ঠিক ২০টা ছোট টুকরো পাঠালে প্রায় ৩২ ডলার।" Honest: "একই বড় document বারবার পাঠালে caching বিল অনেক কমায়, প্রায় ১০০ ডলারে। কিন্তু টেবিলের ভিড় কমায় না।" **[Graph 3 + Illustration]**
   - *Visual:* the scan bar sweeps a 10K glass in 1.6 s and a 100K glass in 11.5 s, timed to the measured values so the wait is felt. Then cost bars drawn on the glass.
   - *Clicks:* ▶ the 10K sweep ▶ the 100K sweep ▶ the "same rate" quote ▶ the OpenAI ×2 rule ▶ the Illustration bars ($2,000 / $100 cached / $32).
   - *Numbers:* the TTFT figures are from Anthropic's prompt caching post (2024-era model). Price rules are from Anthropic's pricing page and the OpenAI GPT-6.1 Sol page. The daily-bill math is an Illustration on official prices ($2/MTok input, $0.10/MTok cache read).

11. **RAG: photocopy four pages, not the library.** "নীলক্ষেতে কেউ পুরো লাইব্রেরি ফটোকপি করে না, দরকারি চার পাতা করে। RAG ঠিক এটাই: Retrieval-Augmented Generation। প্রশ্ন এলে আগে আলমারি থেকে ঠিক কয়েকটা পাতা খুঁজে আনো, টেবিলে রাখো, তারপর উত্তর লেখো। ২০২০ সালে Facebook AI-এর Patrick Lewis আর সহকর্মীরা নামটা দেন। পুরো Wikipedia ভেঙেছিলেন ১০০ শব্দের টুকরোয়, মোট ২ কোটি ১০ লাখ; প্রতি প্রশ্নে টেবিলে আনতেন মাত্র ৫ থেকে ১০টা।"
   - *Visual:* a steel plan-chest drawer slides open at the frame edge to show a dense wall of slivers (21M). Five sheets lift out and glide onto the glass.
   - *Clicks:* ▶ the drawer opens ▶ five sheets arrive ▶ the question sheet and the answer line.
   - *Numbers:* Lewis et al. 2020 (21M 100-word chunks; k = 5 or 10).

12. **How RAG works, in four steps.** "দুটো ধাপ আগে একবার: document-কে টুকরো করা (chunk), প্রতিটা টুকরোকে সংখ্যার তালিকায় বদলানো (embedding)। দুটো প্রতিটা প্রশ্নে: প্রশ্নের কাছাকাছি টুকরো খোঁজা (search), সেগুলো prompt-এ বসানো। তারপর AI উত্তর লেখে।" **[Diagram]**
   - *Visual:* a pipeline drawn on the glass with DrawSVG in two lanes. Lane "একবার": document → paper cutter → number strips → drawer. Lane "প্রতি প্রশ্নে": question → search → top chunks onto the prompt sheet → answer. In Vertical the lanes stack top and bottom and flow downward.
   - *Clicks:* ▶ chunk ▶ embed ▶ search ▶ into the prompt ▶ answer.
   - *Numbers:* none (Anthropic Contextual Retrieval and OpenAI embeddings guide for the definitions).

13. **The meaning map (embeddings).** "প্রতিটা লেখা একটা লম্বা সংখ্যার তালিকা হয়ে যায়; OpenAI-এর ছোট model-এ ১৫৩৬টা সংখ্যা। অর্থ কাছাকাছি হলে সংখ্যাও কাছাকাছি। ১৫৩৬ মাত্রা আঁকা যায় না, তাই ধরা যাক মানচিত্রটা দুই মাত্রার। ক্রিকেট এক পাড়ায়, ধান চাষ আরেক পাড়ায়, মোবাইল বিল আরেক পাড়ায়। প্রশ্ন এল: 'ধানের পাতা হলুদ হচ্ছে কেন?' সে নামল ধান চাষের পাড়ায়; সবচেয়ে কাছের তিনটা টুকরো উঠে গেল টেবিলে। পাশেই ইংরেজি 'rice leaves turning yellow': ভালো multilingual model ভাষা পেরিয়ে অর্থ মেলায়।" Last line: "মানচিত্র কতটা ভালো, সেটা model-এর ওপর। বাংলা প্রশ্নের বড় পরীক্ষা MIRACL-এ পুরনো mDPR ৪৪, BGE-M3 ৮০।" **[Simulation, Illustration + sourced close]**
   - *Visual:* about 40 small sheets (3–5 word Bangla and English snippets) laid out by a D3 force layout into clusters ringed in grease pencil. The question sheet drops in, and three lines draw to its nearest neighbours.
   - *Clicks:* ▶ the dots scatter, then settle into clusters ▶ the question lands ▶ three neighbour lines, and those sheets fly to the desk ▶ the English neighbour lights up ▶ the clusters loosen (a weaker model, Illustration) and the bars for 44.3 and 80.0 appear. In Vertical the map stays square in the middle and the desk sits below.
   - *Numbers:* the 1536 dimensions and "distance measures relatedness" are from the OpenAI guide. The positions are an Illustration. The MIRACL bn nDCG@10 scores (mDPR 44.3, BGE-M3 Dense 80.0) are from BGE-M3 Table 1.

14. **Rule 6: if it's small, give it all; if it's big, use RAG.** "সবকিছুতে RAG লাগে না। Anthropic-এর পরামর্শ: পুরো জ্ঞানভান্ডার ২ লাখ token-এর কম হলে, মোটামুটি ৫০০ পাতা, পুরোটাই prompt-এ দিন। বাংলায়? ধরা যাক অনুপাত ১.৭১: একই টেবিলে প্রায় ২৯০ পাতার সমান বাংলা। Google DeepMind ২০২৪: যথেষ্ট খরচ করলে long context গড়ে RAG-কে হারায়, কিন্তু RAG অনেক সস্তা, আর ৬০%-এর বেশি প্রশ্নে দুটো হুবহু একই উত্তর দেয়। তাই উপায়: আগে RAG; model নিজে বুঝলে যে পারছে না, তখন পুরোটা। খরচ কমেছে Gemini-1.5-Pro-তে ৬৫%, GPT-4o-তে ৩৯%।"
   - *Visual:* pages rain onto the glass. 500 English pages fit, then the Bangla equivalent (~290) fits. At 5,000 pages they spill over the rim, the drawer opens, and RAG takes over. Then the Self-Route fork is drawn: RAG first → "পারছি?" → answer, or the full desk.
   - *Clicks:* ▶ 500 pages ▶ Bangla ~290 [Illustration] ▶ the overflow sends it to RAG ▶ the Self-Route fork and its numbers.
   - *Numbers:* the 200K and 500-page advice is from Anthropic Contextual Retrieval. 290 is an Illustration from our 1.71×. The rest is from Li et al. (Self-Route).

15. **Rule 7: small chunks, with their context attached.** "OpenAI-এর file search নিজে থেকে কাটে ৮০০ token-এ, পাশের টুকরোর সাথে ৪০০ token মিলিয়ে; Anthropic বলে সাধারণত কয়েকশো token। কিন্তু token মানে বাংলায় কম শব্দ: আমাদের পরীক্ষার হিসাবে ৮০০ token-এ ইংরেজির প্রায় ৬৫০ শব্দ, বাংলার প্রায় ৩৪০, আর GPT-4-যুগের tokenizer-এ মাত্র ১০০-র মতো। তাই মাপ শব্দে নয়, আপনার model-এর token-এ গুনুন। আরেক ফাঁদ: 'আয় ৩% বেড়েছে': কার আয়? কবে? প্রতিটা টুকরোর মাথায় এক লাইনের প্রসঙ্গ জুড়ে দিন।" **[Simulation, Illustration]**
   - *Visual:* a long sheet feeds through a photocopy-shop paper cutter. Overlap bands are shaded. The English and Bangla sheets show how many words each chunk holds. An orphan chunk reading "আয় ৩% বেড়েছে" then gets a header strip glued on.
   - *Clicks:* ▶ the 800/400 cut ▶ word counts for English vs Bangla ▶ the orphan chunk ▶ the context strip is glued on.
   - *Numbers:* the 800/400 defaults are from OpenAI's retrieval guide and "a few hundred tokens" from Anthropic. 650/340/100 words are derived from our Experiment's tokens per word (1.23 / 2.36 / 8.20). The ACME example is Anthropic's, translated.

16. **Rule 8: search by meaning and by word.** "Anthropic মেপেছে ঠিক টুকরোটা খুঁজে না পাওয়ার হার: সাধারণ embedding-এ ৫.৭%। প্রসঙ্গ জুড়লে ৩.৭%। সাথে শব্দ-খোঁজা BM25 যোগ করলে ২.৯%। শেষে আরেকবার বাছাই (reranking): ১.৯%। Embedding অর্থ খোঁজে, কিন্তু 'TS-999'-এর মতো error code-এর হুবহু মিল ধরতে শব্দ-খোঁজা লাগে।" **[Graph 4]**
   - *Visual:* four failure-rate bars shrinking on the glass. Each step adds one tool to the desk: a header strip, a keyword stamp, a sieve.
   - *Clicks:* ▶ 5.7 ▶ 3.7 ▶ 2.9 ▶ 1.9 ▶ the TS-999 sheet.
   - *Numbers:* Anthropic Contextual Retrieval (top-20 retrieval failure rate).

17. **Rule 9: test in your users' language (the Bangla surprise).** "একদম আমাদের দেশের গবেষণা। ২০২৬-এর আগস্টে North South University-র গবেষকেরা সরকারি কৃষি প্রকাশনার ২৮৪টা document দিয়ে RAG মাপলেন। বইয়ের ভাষার, formal প্রশ্নে embedding-খোঁজা ঠিক পাতা আনল ৯৭% ক্ষেত্রে। কৃষক যেভাবে বলেন, লক্ষণ দিয়ে, নিজের ভাষায়, সেই প্রশ্নে মাত্র ৯%। কারণ কৃষকের প্রশ্নে document-এর বৈজ্ঞানিক নাম হুবহু আসে মাত্র ৩.৫% ক্ষেত্রে। একই প্রশ্নে শব্দ-খোঁজা পেয়েছে ৫২%; সবচেয়ে ভালো দুটো মিলিয়ে। আর ইংরেজি প্রশ্নে বাংলা document খুঁজলে শব্দ-খোঁজা প্রায় শূন্য, embedding টিকে থাকে।" **[Graph 5]**
   - *Visual:* grouped bars, embedding vs BM25, for formal-safety, KG-formal and farmer queries. Beside them, two sheets: a colloquial symptom question and a formal document line with a scientific name. The wording is an Illustration, labelled ধরা যাক.
   - *Clicks:* ▶ formal 0.970 ▶ farmer 0.093 drops ▶ the BM25 bars (0.539 / 0.478 / 0.523) ▶ cross-language (BM25 0.506 → 0.004, embedding 0.464 → 0.425). In Vertical the groups stack.
   - *Numbers:* arXiv 2608.14886 (preprint), §results. R@10 = the share of queries whose right passage is in the top 10.

18. **Limits (honest).**
    - Most of these studies are in English and use 2023–2025 models. Models are improving fast: Anthropic reports Opus 4.6 at 76% vs Sonnet 4.5 at 18.5% on a 1M-token multi-needle test (company-reported).
    - RAG can bring similar but wrong pages ("even a single distractor reduces performance", Chroma). If search misses the right page, the AI can't use it.
    - The NSU study is a preprint covering one domain, and one wrong setting dropped its scores from 0.464 to 0.063.
    - Our token ratios are for OpenAI tokenizers only. Embedding models have their own tokenizers.
    - Prices change; these were checked on 9 Nov 2026.
    - "RAG যে পাতা আনে, তাতে কেউ লুকিয়ে নির্দেশ লিখে রাখলে? সেটা পরের আলোচনা।"
    - *Visual:* each limit lands as a grease-pencil asterisk note at the glass rim, then the rim notes slide off.

19. **The 9 rules on one desk.** "AI মনে রাখে না, সে পড়ে। তাই টেবিলে কম রাখুন, ঠিক রাখুন, জরুরিটা শুরুতে বা শেষে, আর বাংলায় মেপে দেখুন।" Each rule is a sheet that arrives as it is named, then the desk tidies into one stack (not a list slide).
    - *Clicks:* ▶ rules 1–5 (the window) ▶ rules 6–9 (RAG).

20. **Close + comment question.** "কমেন্টে লিখুন: আপনি AI-কে কোন document পড়াতে চান: কত পাতা, কোন ভাষায়? সবটা টেবিলে আঁটবে, নাকি RAG লাগবে, হিসাব করে উত্তর দেব। আর পরের আলোচনায়: RAG যে পাতা আনে, তাতে যদি কেউ লুকিয়ে নির্দেশ লিখে রাখে?"
    - *Visual:* the scan bar sweeps the empty glass once and stops mid-sweep.

## Evidence (published sources + our Talk 1 Experiment; no new Experiment)
Full quotes and URLs are in `SOURCES.md`.

**Graphs of sourced numbers (5):**
1. Lost in the Middle U-curve: GPT-3.5-Turbo, 20 documents, accuracy by answer position 1 / 5 / 10 / 15 / 20 = 75.8 / 57.2 / 53.8 / 55.4 / 63.2%; closed-book 56.1%; oracle 88.3% (Liu et al., TACL 2024, Tables 1 and 6).
2. NoLiMa, accuracy at 1K…32K:
   - GPT-4o 98.1 → 69.7 (base 99.3, claimed 128K, effective 8K);
   - Llama 3.3 70B 94.2 → 42.7 (base 97.3);
   - Claude 3.5 Sonnet 85.4 → 29.8 (base 87.5, claimed 200K).
   - Plus the RULER line: 17 models, half satisfactory at 32K; GPT-4 96.6 (4K) → 81.2 (128K), effective 64K.
3. Time to first token: 10K-token prompt 1.6 s vs 100K-token prompt 11.5 s (Anthropic, prompt caching post).
4. Retrieval failure rate (top-20): 5.7 → 3.7 → 2.9 → 1.9% (Anthropic Contextual Retrieval).
5. Bangla agricultural RAG, R@10:
   - by query type: embedding vs BM25 = formal-safety 0.970 / 0.539, KG 0.489 / 0.478, farmer 0.093 / 0.523;
   - cross-language: BM25 0.506 → 0.004, embedding 0.464 → 0.425 (Reza, Maria & Nimi, NSU, arXiv 2608.14886, preprint).

**Other sourced numbers on screen:**
- Desk sizes: 4K and 100K (Liu et al.); 1M for Claude 5.5 models and Gemini 4 Argon; 1.05M for GPT-6.1 Sol.
- "1M tokens ≈ 555k words" (Anthropic).
- Du et al.: a 13.9%–85% drop even with perfect retrieval and whitespace padding.
- Chroma: 18 models.
- Price rules: Anthropic's same rate at 9k and 900k; OpenAI's ×2 input above 272K; Sonnet 5.5 at $2/MTok input and $0.10 cache read.
- Lewis et al.: 21M chunks, k = 5–10.
- OpenAI embeddings: 1536 dimensions. OpenAI chunk defaults: 800 / 400.
- Anthropic: "smaller than 200,000 tokens (about 500 pages)".
- Self-Route: >60% identical; cost −65% and −39%.
- MIRACL Bengali: mDPR 44.3 vs BGE-M3 80.0.
- Opus 4.6 76% vs Sonnet 4.5 18.5% (company-reported, Limits only).

**From our Talk 1 Experiment (reused):** Bangla ÷ English tokens 1.71× (`o200k_base`: GPT-4o, GPT-4.1, o1, o3, o4-mini, GPT-5) and 5.88× (`cl100k_base`: GPT-3.5, GPT-4). Tokens per word, English vs Bangla: 1.23 vs 2.36 (o200k) and 1.24 vs 8.20 (cl100k).

**Illustrations (labelled ধরা যাক on the Slide):**
- 500 tokens per turn, giving 10,000 at turn 20, 105,000 in total, and ~1.8 lakh in Bangla (beats 1 and 3).
- The sliding-window desk size (beat 5).
- The daily bill, using 1,000 questions × official prices: $2,000 full, ~$100 cached, ~$32 with RAG (beat 10).
- The 2D meaning map positions and the "weaker model" loosening (beat 13).
- ~290 Bangla pages (beat 14).
- 650 / 340 / 100 words per 800-token chunk (beat 15).
- The farmer-vs-document wording (beat 17).

## Visuals at a glance
- **Graphs (5):** the U-curve (Chart.js line + data-driven glass brightness); NoLiMa lines (Chart.js, log x); TTFT as timed scan sweeps plus bars; the failure-rate bars; the NSU grouped bars.
- **Simulations (4):**
  - the reread tally;
  - the reread staircase with its Bangla overlay;
  - the sliding window, English vs Bangla;
  - the embedding meaning map (D3 force) and the chunk cutter.
  - All are GSAP-driven so they reverse.
- **Diagram (1):** the two-lane RAG pipeline (SVG + DrawSVG).
- **Idea sources:** shot cards `camera/overhead-camera-moves` (tabletop tour then drop onto one sheet, for beats 2 and 11), `effects/spotlight-sweep-moves` (a linear sweep light that reveals what is read, used as the scan bar), `data/chart-live-moves` B (a dot swarm regrouping into clusters, for beat 13).
- **Slop avoided:**
  - No page chrome.
  - Rule numbers live on sheets in the world, not as counters.
  - No stat slide: every number sits inside a chart or on a sheet.
  - The ground is bright glass, not a near-black void.
  - The one light has a source.

## Demo (offline, live in the Slide)
"টেবিল-মিটার" in beat 5. The presenter pastes Bangla and English text, and the Slide counts it with the real `o200k_base` and `cl100k_base` tokenizers already bundled in `vendor/js-tiktoken/` (from Talk 1). Each message becomes a sheet sized by its real token count on a small desk (2,000 tokens, an Illustration size), and the oldest sheet falls off when the desk is full. No model is called.

## Look (my proposal; I design it after the Script)
**"আলোর টেবিল": a light table seen from above.**
- **Ground:** frosted glass, lit from below, fills most of the frame as a bright, cool-white ground. The glass is the context window. Past its brushed-aluminium rim the room falls to a dim slate blue, and pages that "fall off" slide into that dark.
- **Light:** one source, the panel under the glass. A brighter scan bar sweeps across every time the model "reads". Brightness means attention: in beat 7 the glass dims in the middle along the measured U-curve.
- **Material:** translucent tracing-paper sheets printed in ink-blue Bangla. One highlighter-yellow mark shows the page that matters (the only accent colour). Charts are grease-pencil lines drawn on the glass. A steel plan-chest drawer is the archive.
- **Type:** Tiro Bangla (serif, OFL) for text printed on the sheets, like book pages. Anek Bangla (already in `vendor/fonts/`) for spoken claim lines and chart labels. Both are new to this Deck, since Talk 1 uses IBM Plex Mono and Hind Siliguri. Tiro Bangla needs adding through `vendor/update.mjs`.
- **How it differs from Talk 1:** Talk 1 is opaque cream receipts, mono print and a dark counter. This Look is light through glass and translucent sheets on a bright ground.
- **Vertical:** the table turns portrait, sheets stack top to bottom, the scan bar sweeps vertically and the drawer sits at the bottom edge.

## Sources
`SOURCES.md`. Not verified (not used for any beat):
- the ChatGPT Memory FAQ (403);
- the RULER GitHub repo (504; the paper was used instead);
- the NeurIPS proceedings page (refused; arXiv was used);
- YouTube video details (secondary summaries, colour only);
- the abstract's "passage length ×7" claim in the NSU preprint, which its own body doesn't support (not used);
- secondary-blog MRCR figures for GPT-5.x and Gemini 3.x.
