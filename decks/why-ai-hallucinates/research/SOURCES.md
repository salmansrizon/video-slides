# Sources: ChatGPT কীভাবে উত্তর বানায়, আর কেন "জানি না" বলে না

Fetched 2026-11-09. Every number on a Slide traces to one line here. Quotes are exact and short. "Derived" means we counted or subtracted from the primary source ourselves; it is said so on the Slide.

## The paper behind the reveal
- Kalai, Nachum, Vempala, Zhang. "Why Language Models Hallucinate." arXiv:2509.04664v1, 4 Sep 2025 (OpenAI). https://arxiv.org/abs/2509.04664 (full text: https://arxiv.org/html/2509.04664v1)
  - Abstract: "language models are optimized to be good test-takers, and guessing when uncertain improves test performance"
  - Abstract: "Hallucinations need not be mysterious"
  - §1, birthday hook (model: DeepSeek-V3, told to answer only if it knew): "output three incorrect dates: “03-07”, “15-06”, and “01-01”."
  - §1, Table 1, Kalai's dissertation title asked to ChatGPT (GPT-4o), DeepSeek, Llama: "None generated the correct title or year."
  - §1.2, the exam analogy: "students may guess on multiple-choice exams and even bluff on written exams."
  - §1.1, arbitrary facts (worked example with an assumed 20%): "if 20% of birthday facts appear exactly once in the pretraining data" → "one expects base models to hallucinate on at least 20% of birthday facts." The 20% is the paper's own assumption; on the Slide it is "paper-এর উদাহরণ".
  - §1.1: "Language models avoid many types of errors such as spelling mistakes, and not all errors are hallucinations."
  - §3.1: "The pretrained model is well calibrated." (caption of Fig. 2, GPT-4 "before (left) and after (right) reinforcement learning")
  - §4.1, Observation 1: "Under binary grading, abstaining is strictly sub-optimal." and "IDK-type responses are maximally penalized while an overconfident 'best guess' is optimal."
  - §4.1, Table 2: of 10 popular benchmarks (GPQA, MMLU-Pro, IFEval, Omni-MATH, WildBench, BBH, MATH L5, MuSR, SWE-bench, HLE), only WildBench gives "Partial" credit for IDK; the other nine are marked "None".
  - §4.2, the fix: "Answer only if you are >t confident, since mistakes are penalized t/(1-t) points." Examples: "t=0.5 (penalty 1), t=0.75 (penalty 2), and t=0.9 (penalty 9)".
  - §4.2 names human exams that penalise wrong answers: Indian JEE, NEET and GATE, MAA's AMC, and "US standardized SAT, AP, and GRE tests in earlier years."

## Real numbers: guessing vs saying "জানি না"
- OpenAI. "GPT-5 System Card" (dated 13 Aug 2025; arXiv:2601.03267v1, 19 Dec 2025). https://arxiv.org/html/2601.03267v1
  - §3.7, Table 8, "SimpleQA (no web)": accuracy / hallucination rate: gpt-5-thinking-mini 0.22 / 0.26; OpenAI o4-mini 0.24 / 0.75; gpt-5-thinking 0.55 / 0.40; OpenAI o3 0.54 / 0.46; gpt-5-main 0.46 / 0.47; GPT-4o 0.44 / 0.52.
  - §3.7, right before Table 8: "gpt-5-thinking-mini reasoning shows significant improvement in abstention behavior over OpenAI o4-mini."
  - §3.7: "gpt-5-thinking has a hallucination rate 65% smaller than OpenAI o3"
  - §3.8, Table 9, CharXiv Missing Image ("all of the images are removed"), deception rate: OpenAI o3 0.87, gpt-5-thinking 0.09.
  - Derived: "উত্তর দেয়নি" = 100 − 22 − 26 = 52% for gpt-5-thinking-mini and 100 − 24 − 75 = 1% for o4-mini. The card does not define whether the two rates share the denominator "all questions"; OpenAI's blog post shows the same split as abstention 52% / 1%, but we could not fetch it (see Not verified). On the Slide show the two sourced numbers and leave the rest of the bar blank, labelled "বাকিটা: উত্তর দেয়নি".
- Wei, Karina, Chung, Jiao, Papay, Glaese, Schulman, Fedus. "Measuring short-form factuality in large language models" (SimpleQA). arXiv:2411.04368v1, 7 Nov 2024 (OpenAI). https://arxiv.org/html/2411.04368v1
  - "4,326 short, fact-seeking questions"; "adversarially collected against GPT-4 responses."
  - Grading: incorrect = "The predicted answer contradicts the reference answer in any way, even if the contradiction is hedged."
  - Correct / not attempted / incorrect (%): GPT-4o 38.2 / 1.0 / 60.8; GPT-4o-mini 8.6 / 0.9 / 90.5; o1-preview 42.7 / 9.2 / 48.1; Claude-3.5-sonnet 28.9 / 35.0 / 36.1; Claude-3-haiku 5.1 / 75.3 / 19.6.
  - Stated confidence: "models consistently overstate their confidence."
  - Asking the same question 100 times: "We see across all models that accuracy increases with frequency," (basis for the "ask it 3–5 times" takeaway).
- Artificial Analysis. "AA-Omniscience: Evaluating Cross-Domain Knowledge Reliability in Large Language Models." arXiv:2511.13029v1, 17 Nov 2025. https://arxiv.org/html/2511.13029v1
  - Scoring: "a correct answer is worth 1, an abstention is worth 0, and an incorrect answer is worth some penalty" of "the same magnitude as the reward for a correct answer".
  - "The dataset comprises 6,000 total questions"
  - "only three frontier models at launch able to achieve an Omniscience Index score of above 0."
  - Hallucination rate here = "the proportion of questions it attempted to answer when it was unable to get the answer correct" (not a share of all questions; say so on the Slide).
  - "Grok 4 and GPT-5 (high) record the highest accuracy at 39%, their hallucination rates of 64% and 81%."
  - "Claude 4.5 Haiku, for example, achieves only 16% accuracy but a 26% hallucination rate."

## Confidence vs correctness
- Phan et al. "Humanity's Last Exam." arXiv:2501.14249 (v12, 19 Oct 2026). https://arxiv.org/html/2501.14249
  - "To measure calibration, we prompt models to provide both an answer and their confidence from 0% to 100%"
  - "Models frequently provide incorrect answers with high confidence on HLE"
  - Table 1, accuracy % / RMS calibration error %: GPT-4o 2.7 / 89; Grok 2 3.0 / 87; Claude 3.5 Sonnet 4.1 / 84; Gemini 1.5 Pro 4.6 / 88; Gemini 2.0 Flash Thinking 6.6 / 82; o1 8.0 / 83; DeepSeek-R1 8.5 / 73 (text-only subset); o3-mini (high) 13.4 / 80 (text-only subset).
  - Wording on the Slide: "নিজের দেওয়া আত্মবিশ্বাস আর আসল সঠিকতার ফাঁক" (RMS calibration error), not "৮৯% নিশ্চিত ছিল".
- OpenAI. "GPT-4 Technical Report." arXiv:2303.08774. https://arxiv.org/html/2303.08774
  - "GPT-4 is a Transformer-style model pre-trained to predict the next token in a document"
  - "it still is not fully reliable (it "hallucinates" facts and makes reasoning errors)."
  - "the pre-trained model is highly calibrated" … "its predicted confidence in an answer generally matches the probability of being correct"; figure caption: "The post-training hurts calibration significantly." (The ECE values sit in the figure image, not the text; not used.)
- Meta. "Muse Spark Safety & Preparedness Report." arXiv:2606.12429v1, 14 May 2026. https://arxiv.org/html/2606.12429v1
  - §4.1.4, CharXiv Missing Images: "Uses a modified version of the CharXiv benchmark with images removed."; hallucination rate = "how often the model fabricates an answer rather than acknowledging the missing data."
  - Rates: Gemini 3.1 Pro 86.8%, Claude Opus 4.6 81.7%, GPT-5.4 48.8%, Muse Spark 35.0%. (Meta graded its own model and its rivals; OpenAI's 0.87/0.09 above used a different grader, so never plot the two on one axis.)
  - §1.1.3: "All models exhibit poor confidence calibration when measured on Humanity's Last Exam."

## Inside the model: the "can't answer" brake
- Anthropic. "On the Biology of a Large Language Model" (attribution graphs), 27 Mar 2025. https://transformer-circuits.pub/2025/attribution-graphs/biology.html
  - "can't answer" features are "activated by default, for any Human/Assistant prompt."
  - The default is suppressed by "features which represent entities or topics that the model is knowledgeable about." (Michael Jordan → answers.)
  - Unknown name: "I apologize, but I cannot find a definitive record of a sports figure named Michael Batkin."
  - Misfire: asked for a paper by Andrej Karpathy, the model "activates 'known answer / entity' features (on account of recognizing Andrej Karpathy's name)" and names "ImageNet Classification with Deep Convolutional Neural Networks", which Karpathy did not write.

## Bangla
- Datta, Chilukuri, Kumar, Ghosh, Zafar. "Do LLM hallucination detectors suffer from low-resource effect?" arXiv:2601.16766v1, 23 Jan 2026. https://arxiv.org/html/2601.16766v1
  - §6.1: "On average, accuracies decrease by more than 62% for BN" (relative to English, mTREx factual recall).
  - Table 8, mTREx Capitals, English vs Bengali accuracy: Mistral-7B 69 vs 19; Llama-8B 74 vs 28; Mistral-24B 80 vs 29; Llama-70B 86 vs 37. Country: Llama-70B 84 vs 45. Official language: Llama-70B 87 vs 40.
  - Limit: open models 7B–70B only, questions machine-translated from English; not ChatGPT.

## Incidents
- Mata v. Avianca, Inc., No. 22-cv-1461 (PKC) (S.D.N.Y.), Opinion and Order on Sanctions, Judge P. Kevin Castel, 22 June 2023. First two pages read at https://www.docketalarm.com/cases/New_York_Southern_District_Court/1--22-cv-01461/Mata_v._Avianca_Inc/54/
  - Respondents "submitted non-existent judicial opinions with fake quotes and citations created by the artificial intelligence tool ChatGPT"
  - The ChatGPT exchange, from the lawyer's affidavit screenshots as transcribed by Simon Willison, 27 May 2023 (secondary, colour only): "Is varghese a real case" → "Yes, Varghese v. China Southern Airlines Co Ltd, 925 F.3d 1339 (11th Cir. 2019) is a real case." Then "Are the other cases you provided fake" → "No, the other cases I provided are real and can be found in reputable legal databases such as Lexis Nexis and Westlaw." https://simonwillison.net/2023/May/27/lawyer-chatgpt/
- Google Bard launch demo, Feb 2023.
  - Primary: Sundar Pichai, "An important next step on our AI journey", Google blog, 6 Feb 2023. The image caption: "Use Bard to simplify complex topics, like explaining new discoveries from NASA's James Webb Space Telescope to a 9-year-old." https://blog.google/technology/ai/bard-google-ai-search-updates/ (Bard's wrong line is inside the image, which we could not read.)
  - Colour: NPR (Emily Olson, 9 Feb 2023, via WUNC): Bard said the telescope took the first pictures of "exoplanets". https://www.wunc.org/2023-02-09/google-shares-drop-100-billion-after-its-new-ai-chatbot-makes-a-mistake
  - The correction: NASA, "2M1207 b is the first exoplanet directly imaged and the first discovered orbiting a brown dwarf." Imaged in 2004 by ESO's Very Large Telescope. https://science.nasa.gov/resource/2m1207-b-first-image-of-an-exoplanet/
- Damien Charlotin, "AI Hallucination Cases" database. https://www.damiencharlotin.com/hallucinations/ ("Last updated: 5 November 2026")
  - "While seeking to be exhaustive (2266 cases identified so far), it is a work in progress"
  - Inclusion: "all documents where the use of AI, whether established or merely alleged, is addressed in more than a passing reference" by the court or tribunal.
  - Party filter: Pro Se Litigant 1305, Lawyer 898, Judge 33, Expert 17. Nature filter: Fabricated 1856, Misrepresented 960, False Quotes 602.
  - Jurisdictions: USA 1535, Canada 241, Australia 112, UK 90, India 16. Bangladesh, Pakistan and Sri Lanka are not listed.
  - Derived, cases per year by decision date (we paged the listing on 2026-11-09: 50 rows per page, sorted newest first, 46 pages): 2023: 16 (all of page 46, earliest 14 Apr 2023, Mata v. Avianca listed at 22 Jun 2023); 2024: 56 (page 44 rows 45–50 + page 45); 2025: 865 (page 27 rows 30–50 + pages 28–43 + page 44 rows 1–44); 2026 to 5 Nov: 1329 (pages 1–26 + page 27 rows 1–29). Sum 2266. Recount the week of recording: the database grows daily and adds older cases late.

## Even with the source text in hand
- Vectara, Hallucination Leaderboard (HHEM-2.3, summarising "over 7700 articles", temperature 0), "Last updated on October 22, 2026". https://github.com/vectara/hallucination-leaderboard (read via raw README)
  - Lowest: antgroup/finix_s1_32b 1.8 %. Highest: mistralai/ministral-3b-2512 24.2 %.
  - Same model, more reasoning: gpt-5.2-low 8.4 % vs gpt-5.2-high 10.8 %; gpt-5.1-low 10.9 % vs gpt-5.1-high 12.1 %; grok-4-1-fast-non-reasoning 17.8 % vs -reasoning 19.2 %. (Longer summaries in the high settings, e.g. 165.5 vs 254.4 words for gpt-5.1: more claims, more chances to slip. Say so.)
  - Others: openai/gpt-5.5 9.3 %, anthropic/claude-opus-4-6 12.2 %, google/gemini-3-pro-preview 13.6 %, deepseek-ai/DeepSeek-V3 6.1 %.

## Developer tools
- OpenAI Cookbook, "Using logprobs": `logprobs` = "Whether to return log probabilities for the output tokens."; such evaluations "can reduce retrieval-based hallucinations and enhance accuracy." https://github.com/openai/openai-cookbook/blob/main/examples/Using_logprobs.ipynb

## Existing videos (search only, not watched)
- English: IBM Technology, "Why Large Language Models Hallucinate" (Martin Keen; whiteboard of hallucination types and prompting tips); reaction and summary videos on OpenAI's Sept 2025 paper; Sabine Hossenfelder, "Are Hallucinations Popping the AI Bubble?". Found through summaries at https://echai.ventures/how-founders-use-ai/r/why-large-language-models-hallucinate--1545 and https://rosetta.to/u/sabinehossenfelder/are-hallucinations-popping-the-ai-bubble
- Bangla: no evidence-led video found. Coverage is news text, e.g. bdnews24, 19 Sep 2025, "চ্যাটবট কেন বিভ্রান্ত করে? ব্যাখ্যা দিলেন ওপেনএআই গবেষকরা" https://bangla.bdnews24.com/tech/0d7c80c61ce3

## Not verified (could not fetch; check in a browser before recording; no beat depends on them)
- OpenAI blog, "Why language models hallucinate" (Sept 2025), and its Bangla version: HTTP 403. https://openai.com/index/why-language-models-hallucinate/ and https://openai.com/bn-BD/index/why-language-models-hallucinate/ Its SimpleQA table (abstention 52% / 1%) is reported by search summaries. Our Slide uses the system card numbers instead.
- Moffatt v. Air Canada, 2024 BCCRT 149 (14 Feb 2024, Member Christopher C. Rivers): CanLII and the CRT site return 403. Secondary reports quote para 27, "Air Canada suggests the chatbot is a separate legal entity that is responsible for its own actions" and a total award of $812.02. Strong colour for "দায় আপনার", but not used until the decision is read.
- Mata v. Avianca: the $5,000 penalty and "six" fake cases are in the parts of the opinion and the May 2023 order we could not read (PDFs not parseable, Justia and CourtListener 403). Not said on screen.
- Bard: Alphabet's "$100 billion" drop in market value (NPR) is a secondary number. Not on screen.
- Artificial Analysis live Omniscience page (v1.1, Oct 2026): partial read shows top net scores now positive (e.g. 54, 48). Model names and values were incomplete in the fetch. Do not show; recheck if the presenter wants an "it is improving" line.
- Bangladesh BCS / admission-test negative-marking values: no official BPSC or university notice fetched. The Slide uses "ধরা যাক ভুলে −০.২৫" as an Illustration and cites the paper's JEE/NEET/SAT mention for "real exams do this".
- Nature 2024 semantic-entropy paper (Farquhar et al.): redirect to login. Not used; SimpleQA's frequency result carries the takeaway.
