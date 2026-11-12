// Counts how many job posts mention each skill (once per post), overall and per role. Reads posts.json
// (from collect.mjs) and the hand review in review.json ({ "<url>": false } drops a post that isn't an analytics job).
// Writes counts.json for the Deck's chart. node count.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const review = existsSync('review.json') ? JSON.parse(readFileSync('review.json', 'utf8')) : {};
const posts = JSON.parse(readFileSync('posts.json', 'utf8')).filter(p => review[p.url] !== false);

const SKILLS = {
  'SQL': /\bsql\b|mysql|postgres|t-sql|pl\/sql|oracle database|ms sql/i,
  'Excel': /excel|spreadsheet|pivot|vlookup|xlookup/i,
  'Power BI': /power ?bi|\bdax\b|power query/i,
  'Tableau': /tableau/i,
  'Looker / Data Studio': /looker|data studio/i,
  'Python': /python|pandas|numpy/i,
  'R': /\bR\b(?! ?&)|\bRStudio\b/,
  'Statistics': /statistic|regression|hypothesis|a\/b test|probability/i,
  'Machine learning': /machine learning|\bml\b|scikit|tensorflow|pytorch|predictive model/i,
  'ETL / pipelines': /\betl\b|\belt\b|pipeline|airflow|data integration/i,
  'Data warehouse': /warehouse|bigquery|snowflake|redshift|data lake|dimensional model|star schema/i,
  'Cloud (AWS/Azure/GCP)': /\baws\b|azure|\bgcp\b|google cloud/i,
  'Spark / big data': /spark|hadoop|databricks|kafka|big data/i,
  'Reporting & dashboards': /dashboard|report(ing)?\b|visuali[sz]/i,
  'Communication / presentation': /communicat|present(ation)?s?\b|storytell|stakeholder/i,
  'English': /english/i,
  'Problem solving / analytical thinking': /problem.solving|analytical (thinking|skill|mind)|critical thinking/i,
  'Business / domain knowledge': /business acumen|domain knowledge|business understanding|understanding of (the )?business/i,
  'ERP / SAP': /\berp\b|\bsap\b|odoo/i,
  'Google Analytics / marketing data': /google analytics|\bga4\b|mixpanel|amplitude/i,
  'AI tools / LLMs': /\bai[- ](assisted|tools?|automation|-?powered|driven)|chatgpt|copilot|\bllm|generative ai|\bgen ?ai\b|prompt engineering/i,   // AI asked as a skill, not a company's own AI pitch
};
const ROLE = t => /scien|machine learning|\bml\b/i.test(t) ? 'Data Scientist' : /engineer|architect/i.test(t) ? 'Data Engineer'
  : /business intelligence|\bBI\b|power ?bi|dashboard|report/i.test(t) ? 'BI / Reporting' : /\bMIS\b|management information/i.test(t) ? 'MIS' : 'Data Analyst';
const EXP = p => { const s = (p.experience || p.level || '') + ' ' + p.text.slice(0, 3000);
  const m = s.match(/(\d+)\s*(?:\+|to\s*\d+|-\s*\d+)?\s*(?:years?|yrs?)/i); if (/entry|fresher|fresh graduate|internship/i.test(s) && !m) return '0';
  return m ? (+m[1] <= 1 ? '0–1' : +m[1] <= 3 ? '2–3' : +m[1] <= 5 ? '4–5' : '6+') : 'not stated'; };

const count = list => Object.fromEntries(Object.entries(SKILLS).map(([k, re]) => [k, list.filter(p => re.test(p.title + '\n' + p.text)).length])
  .sort((a, b) => b[1] - a[1]));
const by = f => posts.reduce((o, p) => ((o[f(p)] ||= []).push(p), o), {});
const roles = by(p => ROLE(p.title)), exp = by(EXP);
const out = {
  made: new Date().toISOString().slice(0, 10), total: posts.length,
  sources: { bdjobs: posts.filter(p => p.source === 'bdjobs').length, linkedin: posts.filter(p => p.source === 'linkedin').length },
  dates: [posts.map(p => p.posted).sort()[0], posts.map(p => p.posted).sort().at(-1)],
  skills: count(posts),
  roles: Object.fromEntries(Object.entries(roles).map(([r, l]) => [r, { n: l.length, top: Object.entries(count(l)).slice(0, 6) }])),
  experience: Object.fromEntries(Object.entries(exp).map(([e, l]) => [e, l.length])),
};
writeFileSync('counts.json', JSON.stringify(out, null, 1));
console.log(`${out.total} posts, ${out.dates.join(' → ')}`, out.sources);
for (const [k, n] of Object.entries(out.skills)) console.log(String(n).padStart(4), `${Math.round(n / out.total * 100)}%`.padStart(5), k);
console.log('roles', Object.fromEntries(Object.entries(out.roles).map(([r, v]) => [r, v.n])), 'experience', out.experience);
