# Outline: ChatGPT কীভাবে উত্তর বানায়, আর কেন "জানি না" বলে না | AI Hallucination

**Series:** LLM & AI, Talk 2 · **Level:** Intermediate (18–22 min, 20 Slides; Script: `scripts/why-ai-hallucinates.txt`) · **Arc:** Mystery → reveal
**Promise to the viewer:** After this, you know how ChatGPT builds an answer one token at a time, why it states a guess in the same confident voice as a fact, why training and grading reward that guess, and five checks that catch it.

Title options. The first is my pick: it keeps both search phrases ("how chatgpt works", "ai hallucination"), and its question is the one the Talk answers.
1. ChatGPT কীভাবে উত্তর বানায়, আর কেন "জানি না" বলে না | AI Hallucination
2. Hallucination: ChatGPT কেন আত্মবিশ্বাসের সাথে ভুল বলে? দোষটা পরীক্ষার খাতার
3. কমন পড়েনি, তবু খাতা খালি রাখেনি: AI Hallucination-এর আসল কারণ

## The angle
Most hallucination videos list types and tips ("AI sometimes makes things up, so verify"). This Talk solves it like a case. It opens with three confident wrong birthdays, a fake court case and a launch-ad mistake. It shows how the answer is built: one token at a time, each a best guess whose doubt never reaches the screen. Then comes the reveal: the model is a student sitting an exam with no negative marking, and every leaderboard grades it that way. We run that exam as a simulation, then show the real numbers agreeing: the model with higher accuracy makes three times the errors. Every Bangladeshi student knows OMR sheets and negative marking, so the whole Talk lives on an exam sheet.

What existing videos do (search, Nov 2026): English explainers (e.g. IBM Technology's whiteboard) define hallucination types and give prompting tips; next-token videos stop at "it predicts words"; videos on OpenAI's Sept 2025 paper mostly read the blog aloud. In Bangla I found news articles and no evidence-led video. This Talk differs in five ways:
- a scoring simulation that flips the leaderboard while you watch;
- 2025–26 numbers from system cards and benchmarks;
- inside-the-model evidence (the "can't answer" brake);
- a Bangla-specific result: the same question in Bangla gets far fewer right answers;
- the court-case count up to 5 Nov 2026.

## Story beats
(Each beat: what is on screen, what each click does, where the numbers come from. Format notes say how a beat changes in 9:16 when that isn't obvious.)

**Act 1: the mystery**

1. **Hook: three birthdays (first 20 s).** The researcher who wrote OpenAI's hallucination paper asks a model (DeepSeek-V3) for his own birthday: "only answer if you know". It gives three different dates: 03-07, 15-06, 01-01.
   - *Visual:* the date-of-birth bubble grid of an OMR sheet, the one every SSC and admission candidate has filled.
   - *Clicks:* 1 the pencil fills 03-07 in hard, dark strokes; 2 an eraser smears it, then 15-06 is filled; 3 then 01-01; 4 a red-pen note: "যিনি জিজ্ঞেস করলেন, তিনিই গবেষণাটার লেখক।"
   - *Numbers:* Kalai et al. 2025 §1.
   - "নিজের জন্মদিন জিজ্ঞেস করলেন। AI তিনবার তিনটা আলাদা তারিখ দিল—তিনবারই এমনভাবে, যেন জন্মনিবন্ধন দেখে বলছে।"
2. **It costs real people: Mata v. Avianca (2023).** A New York lawyer asked ChatGPT whether the case it gave him was real. It said yes, "can be found in reputable legal databases such as Lexis Nexis and Westlaw." The judge called them "non-existent judicial opinions with fake quotes and citations".
   - *Visual:* an answer-script page (খাতা) with the exchange in pencil.
   - *Clicks:* 1 the question; 2 "Yes … is a real case."; 3 the Westlaw line; 4 the judge's red pen boxes it, with the court quote in the margin.
   - *Numbers:* none on screen. The $5,000 penalty is unverified (SOURCES).
   - "AI-কে জিজ্ঞেস করা হলো, তুমি বানিয়ে বলছ না তো? সে বলল—না, সব সত্যি, Westlaw-এ খুঁজে দেখো।"
3. **Even the maker's launch ad (Bard, Feb 2023).** Google's own demo said the James Webb telescope took the first pictures of a planet outside our solar system. NASA: the first one was imaged in 2004 by ESO's VLT.
   - *Visual:* one printed answer line.
   - *Clicks:* 1 the claim; 2 a red-pen strike and "2004, VLT" with the NASA quote.
   - *Numbers:* Google blog caption; NPR for the wording; NASA for the correction. Keep it to about 30 s.
4. **It's growing, and it's a question.** A researcher's database of court decisions that deal with AI-made errors: 2,266 as of 5 Nov 2026.
   - *Graph 1 (sourced):* decisions per year by decision date: 2023: 16, 2024: 56, 2025: 865, 2026 to 5 Nov: 1,329.
   - *Clicks:* 1–2 the 2023 and 2024 bars, drawn as tally marks; 3 the 2025 bar breaks through the chart's top line and the axis rescales (shot card `chart-live-moves`, axis-rescale-shock); 4 the 2026 bar breaks it again; 5 by who filed: self-represented 1,305, lawyers 898, judges 33 (red stamp: "বিচারকও"); 6 India 16, and a Bangladesh row left empty: "তালিকায় নেই (মানে গোনা হয়নি, ঘটেনি তা নয়)"; 7 the mystery line.
   - *Numbers:* Charlotin's database; the per-year split is derived by us from its own listing (method in SOURCES).
   - "এরা সবাই কি AI-এর bug-এর শিকার? নাকি AI-কে আমরাই এভাবে শিখিয়েছি? আজ এই রহস্যটা খুলব।"

**Act 2: how the answer is built**

5. **One token at a time.** [Illustration] "GPT-4 is a Transformer-style model pre-trained to predict the next token in a document."
   - *Simulation 1a:* each next token is one OMR question. Its bubbles are the candidate tokens, each shaded with pencil in proportion to its probability (ধরা যাক values). For "বাংলাদেশের রাজধানী …", the ঢাকা bubble is almost black.
   - *Clicks:* 1 the bubbles shade in; 2 the darkest is filled solid and "ঢাকা" drops onto the answer line; 3 the next row (the next token) appears and the sentence grows.
   - "ChatGPT পুরো উত্তর আগে ভেবে রাখে না। প্রতিবার শুধু পরের টুকরোটা বাছে—যে বৃত্ত সবচেয়ে গাঢ়।"
6. **Same machine when it doesn't know.** [Illustration] For "অধ্যাপক কালাইয়ের জন্মদিন …", the day bubbles are all faint and nearly equal.
   - *Simulation 1b, clicks:* 1 faint, flat shading across 31 bubbles; 2 the sampler still fills one solid; 3 both answer lines ("…রাজধানী ঢাকা।" and "…জন্মদিন ১৫ জুন।") sit side by side in the same type at the same confidence; 4 the shading fades from both, because the reader only ever sees the filled bubble.
   - *Format:* side by side in 16:9; stacked in 9:16.
   - "খাতায় শুধু ভরাট বৃত্তটা যায়। কতটা দ্বিধা নিয়ে ভরাট করেছে, সেটা যায় না।"
7. **Why it doesn't know: কমন পড়েনি.** Facts that appear many times in training text (রাজধানী ঢাকা, spelling) are learned; a fact that appears once, like a person's birthday, has no pattern to reason from. The paper's worked example: "if 20% of birthday facts appear exactly once", expect "at least 20%" hallucination on them.
   - *Simulation 2* [Illustration]: training text as a pile of past question papers (প্রশ্নব্যাংক).
   - *Clicks:* 1 repeated facts stack tall; 2 one-off facts glow as single sheets; 3 the paper's 20% → 20% rule, labelled "paper-এর উদাহরণ".
   - "বারবার আসা প্রশ্ন মুখস্থ হয়ে যায়। একবার আসা প্রশ্ন কমন পড়ে না—আর জন্মদিনের কোনো সূত্র নেই যে বুদ্ধি খাটিয়ে বের করবে।"
8. **In Bangla, even less is common.** The same capital-of-a-country questions, asked in English and in Bangla.
   - *Graph 2 (sourced):* paired bars. Capitals: Llama-70B 86% → 37%, Mistral-24B 80 → 29, Llama-8B 74 → 28, Mistral-7B 69 → 19. On average, accuracy is more than 62% lower in Bangla.
   - *Clicks:* 1 the English bars; 2 the Bangla bars stop short; 3 the gap label.
   - Callback to Talk 1: the same reason (less Bangla text in training). Limit, said aloud: open models, not ChatGPT.
   - "একই প্রশ্ন—কোন দেশের রাজধানী কী। ইংরেজিতে ১০০-র মধ্যে ৮৬টা ঠিক। বাংলায় ৩৭টা।"
9. **চেনা লাগা ≠ জানা (inside the model).** Anthropic's 2025 circuit study found a "can't answer" path that is on by default. Recognising a familiar name switches it off. When the name is familiar but the fact isn't there, the model invents.
   - *Diagram 1:* a switch circuit drawn in pencil on the sheet.
   - *Clicks:* 1 the default "জানি না" brake, lit; 2 "Michael Jordan" → known → brake released → answer; 3 "Michael Batkin" → brake stays → "cannot find"; 4 "Andrej Karpathy" → name familiar → brake released, nothing behind it → a famous paper he didn't write; 5 the paper's echo: three chatbots asked for Kalai's thesis title, "None generated the correct title or year."
   - *Format:* drawn left→right in 16:9, top→bottom in 9:16.
   - **Surprise 1:** "ভেতরে model-এর default উত্তর আসলে 'জানি না'। নাম চেনা লাগলেই সে brake ছেড়ে দেয়।"

**Act 3: the reveal (it was graded like an exam)**

10. **The raw model knew its doubt.** GPT-4 report: "the pre-trained model is highly calibrated" and "The post-training hurts calibration significantly."
    - *Visual:* a calibration plot ("কতটা নিশ্চিত" vs "কতবার ঠিক"). [Illustration: the curves show the shape only, no real values]
    - *Clicks:* 1 the y = x line draws; 2 the pre-trained curve hugs it; 3 it morphs and sags below the line after post-training.
    - "শুরুতে model জানত কোথায় তার দ্বিধা। পরে যে training দিয়ে ওকে 'ভালো উত্তরদাতা' বানানো হলো, সেখানে সেটা গুলিয়ে গেল।"
11. **Confidence vs correctness, measured.** Humanity's Last Exam asked models for an answer plus a confidence of 0–100%: "Models frequently provide incorrect answers with high confidence".
    - *Graph 3 (sourced):* 8 models. Accuracy is a short graphite bar (GPT-4o 2.7%, o1 8.0%, o3-mini 13.4%); the calibration gap is a long red bar (89, 83, 80…).
    - *Clicks:* 1 a gauge needle sweeps up as stated confidence, then the accuracy readout lands at 2.7 (shot card `gauge-readout-moves`, needle-sweep); 2 all 8 rows land.
    - Wording: "আত্মবিশ্বাস আর সঠিকতার ফাঁক", not "৮৯% নিশ্চিত".
12. **The exam with no negative marking.** On an OMR sheet with "ঠিক = ১, ভুল = ০, ফাঁকা = ০", the empty bubble can only lose. The paper: "students may guess on multiple-choice exams and even bluff"; "Under binary grading, abstaining is strictly sub-optimal."
    - *Clicks:* 1 the rule box; 2 an unknown question; 3 guess → "০.২৫ পাওয়ার সম্ভাবনা" vs blank → "০".
    - The paper names real exams with penalties (India's JEE and NEET, the older SAT and GRE); our own admission-test negative marking is used only as the analogy.
    - "Negative marking না থাকলে আপনিও কি খাতা খালি রাখতেন? AI-ও রাখে না।"
13. **Simulation 3: two models, one exam.** [Illustration: ধরা যাক 100 প্রশ্ন, দুজনেই 60টা জানে; আন্দাজি বাকি 40-এ আন্দাজ করে, 4টায় 1টা লাগে; সৎ বলে "জানি না"]
    - *Visual:* 100 dots per model: graphite = ঠিক, red = ভুল, blank = জানি না.
    - *Clicks:* 1 the dots drop in (shot card `chart-live-moves`, unit-dot-swarm-regroup); 2 accuracy-only scoring: আন্দাজি 70, সৎ 60, and the leaderboard crowns আন্দাজি; 3 the rule flips to ভুল = −১: আন্দাজি 70 − 30 = 40, সৎ 60, and the ranks swap (Flip); 4 the paper's fix appears: "Answer only if you are >t confident … penalized t/(1-t)", e.g. 75% → ভুলে −২.
    - *Demo:* see the Demo section.
    - "একই জ্ঞান, একই মাথা। শুধু নম্বর দেওয়ার নিয়ম বদলালাম—র‍্যাংকিং উল্টে গেল।"
14. **Today's leaderboards grade with no penalty.** The paper checked 10 popular benchmarks: nine give zero credit for "I don't know" and one (WildBench) gives partial credit.
    - *Diagram 2:* ten answer-sheet strips, each with a benchmark name and its IDK column, feed a loop: benchmark → leaderboard → training target → the model learns to guess → benchmark.
    - *Clicks:* 1 nine red "০" stamps and one "আংশিক"; 2 the loop draws itself and keeps turning.
    - The reveal line: "Hallucination কোনো রহস্যময় bug না। আমরা যে পরীক্ষায় model-দের নম্বর দিই, সেই পরীক্ষাই আন্দাজকে পুরস্কার দেয়।"
15. **Real numbers agree (the payoff).** OpenAI's GPT-5 system card, SimpleQA with no web access.
    - *Graph 4 (sourced):* the simulation's dots regroup into two bars. Accuracy: o4-mini 24%, gpt-5-thinking-mini 22%. Wrong answers: 75% vs 26%. The rest of each bar stays blank: "উত্তর দেয়নি".
    - *Clicks:* 1 accuracy only: the older model wins; 2 the wrong segments slam in; 3 the blank remainder is labelled.
    - **Surprise 2:** "Accuracy দেখলে পুরনো model জেতে—২৪ বনাম ২২। কিন্তু ভুল? ৭৫ বনাম ২৬। প্রায় তিন গুণ।"
16. **When a benchmark adds the penalty.** AA-Omniscience (Nov 2025) uses 6,000 questions scored +1 / 0 / −1, and at launch only three frontier models scored above zero.
    - *Graph 5 (sourced):* GPT-5 (high): accuracy 39%, but it guessed on 81% of the questions it couldn't get right; Grok 4: 39% and 64%. Claude 4.5 Haiku: only 16% accuracy, 26% hallucination rate.
    - *Clicks:* 1 the zero line with a "শূন্যের ওপরে মাত্র ৩টা" stamp; 2 the GPT-5 pair; 3 the Haiku pair.
    - Note on screen: here "hallucination rate" is a share of the non-correct answers, not of all questions.
    - "সবচেয়ে বেশি জানা model-ও না জানলে ১০০-র মধ্যে ৮১ বার আন্দাজে বলে দেয়।"

**Act 4: now, and what to do**

17. **2026: the missing picture.** Meta's May 2026 report removed the images from a chart benchmark and asked about them anyway.
    - *Visual:* an empty dashed frame where the chart should be; the model's confident description writes itself into it.
    - *Graph 6 (sourced):* fabricated answers: Gemini 3.1 Pro 86.8%, Claude Opus 4.6 81.7%, GPT-5.4 48.8%, Muse Spark 35.0%.
    - Caveats, said aloud: Meta graded its rivals. OpenAI's own grader on the same idea gave o3 87% → gpt-5-thinking 9%: a different setup, so it is not plotted on the same axis.
    - "ছবিটাই সরিয়ে নেওয়া হয়েছে। তবু ১০০ বারের মধ্যে প্রায় ৮৭ বার ছবির বর্ণনা দিয়ে দিল।"
18. **What to do: পরীক্ষার্থীদের প্রতি নির্দেশাবলী.** The instruction box printed atop every OMR sheet, one rule per click:
    - (1) Names, dates, numbers, citations and links: open and check them yourself (Mata).
    - (2) Set the rule in the prompt: "৭৫%-এর কম নিশ্চিত হলে বলো 'জানি না'". This is the paper's confidence target; it reduces guessing and does not guarantee anything.
    - (3) Ask the same question 3–5 times. If the answer keeps changing, suspect it (SimpleQA: "accuracy increases with frequency").
    - (4) For a Bangla factual question that matters, ask in English too and compare (Beat 8).
    - (5) Developers: score your own chatbot's eval +1 / 0 / −1 and track its abstention rate; turn on `logprobs` to flag low-confidence tokens; if your app needs facts, hand it the source (→ next Talk, RAG).
    - *Sub-simulation* [Illustration] on click 3: the same question asked 5 times. A known fact returns the same answer 5/5; an unknown one returns 4 different answers.
    - *Format:* 9:16 stacks the rules naturally; 16:9 shows them in two columns of the instruction box.
19. **Limits.**
    - It doesn't reach zero even with the text in hand: on Vectara's summarising test (Oct 2026), the best model makes 1.8% and many sit at 8–13%. More "thinking" didn't lower it there (gpt-5.2: 8.4% low effort, 10.8% high; longer summaries make more claims). *Graph 7 (sourced):* a small dot strip.
    - Every benchmark defines "hallucination rate" its own way.
    - System-card numbers are self-reported, and Meta graded its rivals.
    - mTREx tested open models only.
    - The court database counts what was found.
    - Our simulations are Illustrations.
    - A model that says "জানি না" more often also annoys users: a real trade-off.
20. **Close + comment question.** Back to the DOB grid from Beat 1, now with the "জানি না" bubble filled.
    - "AI আত্মবিশ্বাসী শোনালেই সত্যি না। ও এমন এক পরীক্ষার্থী, যাকে কেউ কখনো খাতা খালি রাখতে শেখায়নি।"
    - "কমেন্টে লিখুন: শেষ কবে AI আপনাকে আত্মবিশ্বাসের সাথে ভুল বলেছে, আর প্রশ্নটা কী ছিল?"
    - Tease Talk 4: "AI-কে বই খুলে পরীক্ষা দিতে দিলে কী হয়—Context window ও RAG।"

## Evidence (published sources only; no Experiment in this batch)
`SOURCES.md` has a quote and URL for every number. Headline numbers:
- **SimpleQA, GPT-5 system card:** o4-mini 24% right, 75% wrong; gpt-5-thinking-mini 22% right, 26% wrong.
- **HLE:** GPT-4o 2.7% accuracy with an 89 calibration-error gap (8 models).
- **AA-Omniscience:** +1 / 0 / −1 scoring; 3 models above zero at launch; GPT-5 (high) 39% accuracy, 81% hallucination rate.
- **mTREx:** capitals, English 86% vs Bangla 37% (Llama-70B); more than 62% lower in Bangla on average.
- **CharXiv with the images removed (Meta, 2026):** 86.8 / 81.7 / 48.8 / 35.0%.
- **Charlotin's database:** 2,266 decisions; per year 16 / 56 / 865 / 1,329 (derived); judges 33; India 16.
- **Vectara (Oct 2026):** 1.8% best; 8.4% → 10.8% from low to high reasoning effort.
- **Kalai et al.:**
  - 3 wrong birthdays;
  - 9 of 10 benchmarks give no IDK credit;
  - t/(1−t) penalty;
  - the 20% → 20% worked example.
- **Anthropic circuits:** the default "can't answer" path (qualitative, no numbers).

Illustrations (labelled "ধরা যাক" on their Slides): token probabilities (Beats 5–6), the question-paper pile (7), calibration curve shapes (10), the two-model exam (13 and the Demo), five repeated answers (18).

Visual count:
- 7 graphs of sourced numbers (Beats 4, 8, 11, 15, 16, 17, 19);
- 5 simulations (Beats 5–6, 7, 13 + Demo, 18);
- 2 diagrams (Beats 9, 14).

## Demo (offline, live in the Slide)
A scoring slider on Beat 13. The presenter drags the penalty for a wrong answer through 0 → −0.25 → −1 → −2 (t = 75%) → −9 (t = 90%). Three ধরা যাক models sit the same 100 questions: আন্দাজি always answers; সৎ answers only when sure; মাঝামাঝি answers when at least 50% sure. Their scores recompute live, and the leaderboard re-sorts with GSAP Flip. Plain JS on fixed Illustration values, no model call, so it runs on file://.

## Look (my proposal; I design it after the Script)
**OMR পরীক্ষার খাতা.** The whole Deck is one exam sheet on a scratched wooden exam-hall bench.
- **Ground:** off-white OMR paper whose grid, bubbles and instruction box are printed in pale drop-out teal.
- **Light:** cool overhead tube light, the faint shadow of a pencil.
- **Material:**
  - HB graphite is the model's voice. Token probability is pencil density in a bubble, so doubt is visible right until the bubble is filled solid.
  - Eraser smudges carry each correction.
  - The examiner's red ballpoint is the only accent, for wrong answers, penalties, the judge and the court stamp.
- **Type:**
  - a traditional Bangla print face for question-paper text (e.g. Tiro Bangla);
  - a condensed grotesk for the printed form labels (e.g. Barlow Condensed);
  - a hand for the red-pen notes (e.g. Kalam, with a Bangla hand face);
  - final picks saved to `vendor/fonts/` at design time.
- **Formats:** the OMR sheet is portrait, so 9:16 shows the whole sheet. In 16:9 the camera crops into one block of it (one question row, the DOB grid, the instruction box) with the bench at the sides.
- **Unique to this Talk:**
  - Unlike Talk 1's receipt: a bright form with graphite and red pen, not a dark counter with mono line items.
  - Clear of the parallel Talks: no library shelves or sliding windows (RAG); no terminals or hidden text (prompt injection).
- **Slop guard:**
  - numbers live inside objects (bubbles, tallies, stamps), never as a stat slide;
  - no page chrome;
  - no caret-typed headlines.

## Sources
`SOURCES.md`. Not verified, and nothing is built on them:
- OpenAI's blog post (403; the system card numbers replace its table);
- Moffatt v. Air Canada (tribunal sites 403; add it as colour for "দায় আপনার" only if read in a browser);
- Mata's $5,000 and "six cases";
- Bard's $100 bn;
- Artificial Analysis' live v1.1 scores;
- the BCS negative-marking value.
