# Sources: Data Analytics Career 2027 webinar

Fetched and read on 2026-11-12. Our own count is in `jobposts/`. Lines marked **(verify)** come from secondary coverage and need checking before the Script quotes them.

## Our job-post count (Topic 2)
- **Code and data:** `jobposts/collect.mjs` collects the posts, `jobposts/count.mjs` counts them, `jobposts/posts.json` holds every post with its link and full text, `jobposts/review.json` + `review-notes.json` record the hand review, and `jobposts/counts.json` is the result.
- **Sources:**
  - bdjobs.com through its public search API. It only lists open posts, so these are posts still open on 12 Nov 2026.
  - LinkedIn's public guest job search, location Bangladesh/Dhaka, posted in the last 90 days.
  - One request every ~1.5 s, no login.
- **Keywords:** data analyst, data analytics, business intelligence, power bi, data engineer, data scientist, MIS, reporting analyst, analytics, SQL, tableau, python, insights, data management, machine learning. Posts were kept only when the job title is an analytics role.
- **Hand review:** 63 collected → 33 kept. Dropped:
  - reposts: nextjobz copying bdjobs posts, and Athelas copying Commure
  - data annotation and "AI data trainer" gigs
  - IT and network infrastructure, DBA
  - finance and HR roles
  - one post with no text
- **Counting:** each skill counts once per post, matched by keyword on the title plus the requirement text. "AI tools" counts only AI asked as a skill (AI-assisted tools, AI automation, LLM, ChatGPT, Copilot, generative AI), not a company's own AI pitch.
- **Result (33 posts, 3 Sep – 12 Nov 2026; bdjobs 16, LinkedIn 17):**
  - reporting & dashboards 94%, communication 73%, Excel 64%, Power BI 55%, statistics 45%, analytical thinking 42%, SQL 36%, ERP/SAP 36%, pipelines 30%, Python 27%, AI tools 21%, English 18%, Tableau 15%, cloud 0%
  - by role: MIS 15, Data Analyst 9, BI/Reporting 4, Data Engineer 4, Data Scientist 1
  - experience asked: 0–1 yr 5, 2–3 yrs 13, 4–5 yrs 4, 6+ yrs 4, not stated 7
- **Limits** (say these on screen): a small sample, open posts only on bdjobs, LinkedIn guest search shows a subset, keyword matching is approximate. It shows the direction, not the size of the market.
- **Screenshots:** in `../assets/jobposts/`, each logged in `../assets/SOURCES.md` with its URL and date.

## Global picture (Topic 1)
- World Economic Forum, *Future of Jobs Report 2025*, January 2025. https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf
  - Survey: "over 1,000 leading global employers—collectively representing more than 14 million workers across 22 industry clusters and 55 economies" (p. 5). Bangladesh is not among the economies profiled; the word does not appear in the report.
  - "Analytical thinking remains the most sought-after core skill among employers, with seven out of 10 companies considering it as essential in 2025." (p. 6)
  - "AI and big data top the list of fastest-growing skills, followed closely by networks and cybersecurity as well as technology literacy." (p. 6)
  - "workers can expect that two-fifths (39%) of their existing skill sets will be transformed or become outdated over the 2025-2030 period" (p. 6); "down from 44% in 2023" (p. 32).
  - "if the world's workforce was made up of 100 people, 59 would need training by 2030" (p. 6).
  - Fastest-growing roles include "Big Data Specialists"; fastest-declining include "Data Entry Clerks" (p. 6).
  - Figure 3.4 (p. 37), net increase in skill importance 2025–2030: AI and big data 87, networks and cybersecurity 70, technological literacy 68, creative thinking 66, resilience/flexibility/agility 66, curiosity and lifelong learning 61, leadership and social influence 58, talent management 58, analytical thinking 55 … programming 30. The values are read in figure order from the PDF text; check them against the chart image before the Slide.

## AI and analytical work (Topic 3)
- Dell'Acqua, McFowland, Mollick and others, "Navigating the Jagged Technological Frontier", HBS Working Paper 24-013 (SSRN 4573321, Sept 2023). Published in *Organization Science* (2026) **(verify the published citation)**. https://papers.ssrn.com/abstract=4573321
  - 758 BCG consultants, about 7% of the firm's individual contributors.
  - Inside the frontier: 12.2% more tasks, 25.1% faster. The quality gain differs between versions (over 40% in the working paper, above 30% in the published abstract), so use one with its version named, or leave it out.
  - Outside the frontier, AI users were "19 percentage points less likely to produce correct solutions" **(verify the wording on the SSRN PDF)**.

## Bangladesh context (optional)
- Towfiqul Islam Khan (CPD), "The future of work, artificial intelligence, and Bangladesh's narrowing window of opportunity", 20 Jan 2026. https://cpd.org.bd/the-future-of-work-artificial-intelligence-and-bangladeshs-narrowing-window-of-opportunity/
  - "In Bangladesh, the more educated an individual is, the higher the risk of unemployment."

## Portfolio datasets (Topic 4)
- **World Bank, World Development Indicators.** The data catalog lists the licence as CC BY 4.0. Credit "The World Bank: World Development Indicators". https://datacatalog.worldbank.org/search/dataset/0037712/World-Development-Indicators. Check each series' licence; a few are CC BY-NC.
- **Bangladesh Bank, monthly wage earners' remittance.** https://www.bb.org.bd/en/index.php/econdata/wageremitance, plus the monthly PDF reports with country and district tables. These are public statistics, cited **(no explicit open licence found; cite, don't redistribute the files)**.
- **Open-Meteo:** data is CC BY 4.0. The free tier is non-commercial, up to 10,000 calls a day; historical archive access may need a paid plan **(verify)**. https://open-meteo.com/
- **OpenAQ:** it only ingests openly licensed data, and the licence is per station (read it from the API's location metadata). The API needs free registration. https://docs.openaq.org/about/terms

## Logos and photo
- See `../assets/SOURCES.md`.
