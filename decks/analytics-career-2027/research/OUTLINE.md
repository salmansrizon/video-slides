# Outline: Data Analytics Career 2027: Bangladesh-এ চাকরি পেতে যা লাগবে

**Kind:** webinar Deck, hosted and presented live by Salman Sakib. Later it becomes a voiced video (`?play`) with the same Slides and no outro.
**Length:** 60 min: ~5 intro, ~40 content, ~15 Q&A. 34 Slides.
**Look:** Clay (`lib/looks/clay.css`) on the Talk format.
**Keys:** → next Step/Slide, ← back; no ↓/↑.
**Language:** Bangla narration; Bangla sentences on the Slides, with English job titles and tool names.
**Script:** `scripts/analytics-career-2027.txt`, not written yet.

**Promise to the viewer:** After this, you know which skills Bangladesh employers really ask for (counted from 33 real job posts), how to use AI to work faster without being fooled by it, which of four paths suits you, what to build when you have no experience, how interviews here run, and what to do in the next 90 days.

**What makes it different:**
1. **The job-post count.** 33 real analytics job posts from Bangladesh, from the last 90 days, counted skill by skill. Screenshots of the posts are shown on screen, so nobody has to take it on trust.
2. **A hiring manager's view.** Salman runs Data & BI at US-Bangla Group and has helped grow Daraz, Cartup, Upay, foodi and wagely. His answers to `QUESTIONNAIRE.md` are labelled "আমার অভিজ্ঞতায়".
3. **Global data for the 2027 picture.** WEF Future of Jobs 2025, and the Harvard/BCG study on AI and analysis work.

Numbers come from `jobposts/counts.json` (33 posts, made 2026-11-12).

## Story beats
*Visual* = what's on screen; *Steps* = what moves on each → click; *Numbers* = where they come from. **[Example]** = an assumed scenario, labelled "ধরা যাক…". **[Live]** = webinar only; `?play` skips it or swaps its text.

### Opening (Slides 1–4, ~5 min)
1. **Title.** "Data Analytics Career 2027", with "Bangladesh-এ চাকরি পেতে যা লাগবে" below and the host name. No date.
2. **Your intro card, rebuilt in Clay.**
   - The photo (cut from the screenshot) sits in a rounded frame. Under it: a coral-edged name block with "Salman Sakib" and "Manager, Data & BI · US-Bangla Group", then a "✓ 7+ years of experience" chip.
   - On the right: a "Webinar Focus" panel (rewritten text) and a "Speaker Profile" panel (your text, word for word).
   - Below: a "Helped to grow" strip with five official logos on small tiles: Daraz, Cartup, Upay, foodi, wagely.
   - *Steps:* the panels arrive, then the logos one by one.
3. **আজ যা শিখবেন.** The seven outcomes as numbered chips (`.num`). This becomes the running agenda, and each topic opens with its chip lit.
4. **Hook: one fact from the count.** "গত ৯০ দিনে Bangladesh-এ ৩৩টা analytics job post পড়লাম। ১০টার ৬টায় Excel চেয়েছে, অর্ধেকের বেশিতে Power BI, আর SQL মাত্র তিনটায় একটা।" A big number, then a small stack of job-post screenshots fanning in. "আজকের সব কথা এই post-গুলো থেকে।"

### Topic 1: skills for 2027 (Slides 5–8, ~5 min)
5. **What's rising worldwide (graph 1).** Horizontal bars from WEF Figure 3.4 (net share of employers expecting each skill to grow, 2025–2030): AI and big data 87, networks and cybersecurity 70, technological literacy 68, creative thinking 66 … analytical thinking 55. Our three are highlighted in clay; the rest are dimmed. Source: WEF Future of Jobs 2025, p. 37, over 1,000 employers in 55 economies.
6. **The core skill is still thinking.** "সাতটার মধ্যে সাতটা না, তবু ১০টা কোম্পানির ৭টা বলছে analytical thinking-ই মূল।" A dot row of 10 with 7 lit, then two chips: "৩৯% skill বদলাবে ২০৩০-এর মধ্যে", "১০০ জনে ৫৯ জনের training লাগবে". Source: WEF pp. 6 and 32.
7. **The 2027 analyst is T-shaped (diagram).**
   - The bar of the T is the base every role needs: SQL, Excel, statistics, communication.
   - The stem is depth in one tool and one domain.
   - *Steps:* the base fills cell by cell, then the stem grows down from it.
   - The counts from topic 2 confirm this later.
8. **What's falling.** WEF lists Data Entry Clerks among the fastest-declining jobs. "Data entry আর data analysis এক জিনিস না। একটা কমছে, আরেকটা বাড়ছে।" Two cards: one sinking (dim), one rising (clay).

### Topic 2: what Bangladesh employers want (Slides 9–13, ~7 min)
9. **How we counted.** A short method line: 33 posts, bdjobs 16 + LinkedIn 17, from 3 Sep to 12 Nov 2026, analytics roles only, each skill counted once per post, links kept. Behind it, 7 real job-post screenshots (`assets/jobposts/`: ATI, banglalink, Gildan, JLL, Northern Tosrifa, ONE Bank, Singer) in a loose grid with company names visible. *Steps:* the screenshots land one by one.
10. **The skills chart (graph 2).** Horizontal bars, % of 33 posts: reporting & dashboards 94%, communication 73%, Excel 64%, Power BI 55%, statistics 45%, analytical thinking 42%, SQL 36%, ERP/SAP 36%, pipelines 30%, Python 27%, AI tools 21%, English 18%, Tableau 15%. *Steps:* one bar per click for the top 8, with the rest as one dimmed line. The surprise: in Bangladesh, Excel and Power BI come before SQL and Python, and ERP (SAP, Logic ERP) shows up because so many posts are MIS roles at manufacturers.
11. **It depends on the role (graph 3).** A small multiple of posts by role: MIS 15, Data Analyst 9, BI/Reporting 4, Data Engineer 4, Data Scientist 1. Top skills per role:
     - MIS: reporting, Excel, ERP.
     - Data Analyst: communication, SQL, statistics.
     - Data Engineer: Python, SQL, pipelines.
   - The point: "Bangladesh-এ সবচেয়ে বেশি চাকরি MIS-এ; Data Scientist post প্রায় নেই।"
12. **Read a real post with me.** The ATI Limited "Data Analyst Intern" post, large (it asks a fresher for SQL, Python, Power BI, Excel, statistics and a GitHub/portfolio link). *Steps:* `mark` highlights on its requirement lines (SQL, Power BI, "attention to detail", English), each tagged with which chart bar it feeds.
13. **Experience asked + what I check in 30 seconds.** A bar for the experience requirement: 0–1 yr 5, 2–3 yrs 13, 4–5 yrs 4, 6+ yrs 4, not stated 7. Most ask for 2–3 years, so freshers need proof, which is the bridge to topic 4., then a "আমার অভিজ্ঞতায়" panel answering questionnaire items 1–3.

### Topic 3: AI tools for analytical productivity (Slides 14–18, ~7 min)
14. **What the evidence says (graph 4).** The Harvard/BCG experiment with 758 consultants:
   - Inside AI's frontier: +12.2% more tasks done, 25.1% faster.
   - Outside it (a business-analysis task with data and interviews): AI users were **19 percentage points less often correct**.
   - The quality-gain figure differs by version (>30% in the published abstract, ~40% in the working paper); show it with a note, or leave it out.
   - Line: "AI আপনাকে দ্রুত করে, কিন্তু ভুল জায়গায় আত্মবিশ্বাসী ভুলও করায়।"
15. **Scenario 1: question → SQL [Example].** "ধরা যাক, manager জানতে চাইলেন: গত মাসে কোন জেলায় অর্ডার সবচেয়ে বেশি কমেছে?" *Steps:* the prompt types out in a chat bubble, the AI's SQL types out in a `.code` panel, then "আপনি যা check করবেন" chips (the date filter, the join, NULL districts).
16. **Scenario 2: messy data → cleaning plan, or "explain this query" [Example].** A `.code` panel with an inherited query; the AI explains it line by line (`line` cur Steps).
17. **Scenario 3: result → a 3-line insight for a manager [Example].** A small result table, then the AI's summary, then your edit: the number added, the cause hedged, a next step named.
18. **The confident wrong answer [Example].** The AI's SQL joins orders to a payments table with several rows per order, so revenue doubles. *Steps:* the result looks fine, then a sanity check (`SUM` vs the known monthly total) turns pink, then the fix. Rule card: "AI-এর উত্তর একটা draft। Total মিলিয়ে দেখুন, sample row দেখুন। আর customer data AI-এ paste করার আগে অফিসের নিয়ম জানুন।"

19. **[Live] "এ পর্যন্ত কোনো প্রশ্ন?"** A 2–3 min pause, skipped in `?play`.

### Topic 4: a portfolio without experience (Slides 20–23, ~6 min)
20. **Experience vs proof.** "অভিজ্ঞতা নেই? প্রমাণ দেখান।" Two cards: "৩ বছর কাজ করেছি" (a claim) vs a link to a dashboard (proof).
21. **Four starter projects, one per path.** Each is a `.panel` with the question it answers, the dataset and the deliverable:
   - **Data Analyst (SQL case study):** World Bank WDI, Bangladesh vs South Asia (remittance % of GDP, internet users, youth unemployment). Licence: CC BY 4.0.
   - **BI (Power BI dashboard):** Bangladesh Bank monthly wage-earner remittance by month and country.
   - **Data Engineer (daily pipeline):** Open-Meteo weather for the 8 divisional cities into a small warehouse table, scheduled. Licence: CC BY 4.0; the free tier is non-commercial.
   - **Data Scientist (forecast):** Dhaka PM2.5 from OpenAQ joined with weather, predicting the next day. Each station's licence is checked through the API.
22. **The anatomy of a good project (diagram).** A flow: question → data → cleaning → analysis → insight → recommendation. *Steps:* each box lights, and a red ✕ marks where tutorial copies stop (at "analysis").
23. **The 30-second checklist.** "আমার অভিজ্ঞতায়" (questionnaire items 8–9): a README with the question and the answer, one chart that tells the story, the code is runnable, a LinkedIn post explaining it.

### Topic 5: which path fits you (Slides 24–26, ~5 min)
24. **Four paths.** A 2×2 grid: Data Analyst, BI Analyst, Data Engineer, Data Scientist. Each card shows the daily work, the main tools, how hard it is to enter, and the local demand (MIS 15, Analyst 9, BI 4, Engineer 4, Scientist 1, out of 33 posts). Below it, one line: "যেকোনো path + domain knowledge (finance, marketing, supply chain) = আরও শক্ত profile".
25. **The path finder [Live / Example] (simulation 1).** Four questions, two answers each:
   - People or pipelines?
   - Charts or code?
   - A business question, or a prediction?
   - Daily reports, or long projects?
   - *Steps:* each click lights the majority answer from chat. Scores fill the four cards, and the winner gets a clay outline.
   - In `?play` it runs as "ধরা যাক, আপনি…".
26. **Where each path leads in 3 years.** A small table: the next role and the typical step up, plus a salary range only if posts or your experience support it (questionnaire 14–15).

### Topic 6: interviews (Slides 27–30, ~6 min)
27. **The pipeline (diagram).** A flow from CV screen → written/SQL test → technical round → case or presentation → HR, filled from your team's stages (questionnaire 10). *Steps:* each stage lights with "এখানে মানুষ যেখানে বাদ পড়ে" (your experience).
28. **A SQL question, try it in chat [Live] (simulation 2).** A small two-table schema in a `.code` panel and a question ("প্রতি মাসে নতুন customer কতজন?"). *Steps:* a timer chip (the `?play` text says "pause করুন"), then the answer types out, then the common wrong answer shown struck through.
29. **A case question.** "Sales ২০% কমেছে। কী দেখবেন?" A tree that branches into: is it real (a data issue?), where (region / product / channel), when, and why. *Steps:* one branch per click.
30. **STAR + the top 3 mistakes.** One behavioural question answered in STAR as four chips, then "আমার অভিজ্ঞতায়: সবচেয়ে বেশি দেখা ৩টা ভুল" (questionnaire 12).

### Topic 7: the 90-day plan (Slides 31–32, ~4 min)
31. **90 days (simulation 3: the timeline fills).**
   - **Weeks 1–4:** SQL + Excel.
   - **Weeks 5–8:** Power BI + basic statistics.
   - **Weeks 9–12:** one portfolio project + interview prep.
   - About 8–10 hours a week. The skill order follows the job-post chart.
   - *Steps:* each block fills with its weekly goal.
32. **Your path changes the middle.** One line per path, e.g. "Data Engineer: সপ্তাহ ৫–৮-এ Power BI-এর বদলে Python + pipeline (project 3)", "Data Scientist: Python + statistics, project 4". Then free resources as small chips, verified before use.

### Close (Slides 33–34)
33. **Recap.** The seven agenda chips, each ticked green.
34. **Q&A.** Live: "প্রশ্ন করুন". In `?play` the text swaps to "প্রশ্ন থাকলে comment করুন". No outro.

**Visual count:**
- **Graphs: 4.** WEF skills, the job-post skills chart, skills by role, the AI-study figures.
- **Simulations: 3.** The path finder, the SQL question, the 90-day timeline. The AI scenarios type out as well.
- **Diagrams: 3.** The T-shape, the project anatomy, the interview pipeline.
- **Real job-post screenshots:** Slides 4, 9 and 12.

## Open items
- **The job-post count is done:** 33 posts after a hand review, which dropped 30 reposts and non-analytics roles (reasons in `jobposts/review-notes.json`). Say it plainly on Slide 9: "৩৩টা post: ছোট নমুনা, শুধু খোলা বিজ্ঞাপন; দিক বোঝায়, বাজারের পুরো মাপ না।"
- **Your answers to `QUESTIONNAIRE.md`:** Slides 13, 23, 26, 27, 30.
- **Logos:** Daraz's official logo is white-only. Find its orange version, or put it on a dark tile.
- **The photo:** cut from your screenshot.
- **Datasets:** check the licence of each Dhaka OpenAQ station, and Bangladesh Bank's reuse terms (public statistics, cited).
