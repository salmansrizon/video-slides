// Collects analytics job posts in Bangladesh from the last ~90 days, for the "what employers want" chart.
// Sources: bdjobs.com (its public search API; it only lists open jobs) and LinkedIn's public guest job search
// (location Bangladesh, posted in the last 90 days). One request every ~1.5 s. Writes posts.json with the
// title, company, date, link and the full requirement text of each post.
//   node collect.mjs            then: node count.mjs
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const KEYWORDS = ['data analyst', 'data analytics', 'business intelligence', 'power bi', 'data engineer', 'data scientist', 'MIS', 'reporting analyst',
  'analytics', 'SQL', 'tableau', 'python', 'insights', 'data management', 'machine learning'];
// An analytics role by its title; excludes look-alikes (data entry, business development, accounts).
const RELEVANT = /data|analyt|business intelligence|\bBI\b|power ?bi|\bMIS\b|management information|insight|reporting/i;
const EXCLUDE = /data entry|business development|accounts?\b|sales|security analyst|soc analyst|qa\b|quality assurance|data cent|network|enumerator|professor|lecturer|teacher|financial reporting|admin|electrical|database administrator|dba|software engineer|developer|intern|hr|human resources|annotat|data partner|data trainer|data collection|it & mis|it and mis|scraping|floor operation|finance & mis/i;
const CUTOFF = new Date(Date.now() - 92 * 864e5);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const get = async (url, headers = {}) => { await sleep(1500); const r = await fetch(url, { headers: { 'User-Agent': UA, ...headers } }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); };
const text = h => h.replace(/<(br|\/p|\/li|\/div|\/h\d)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();

const posts = existsSync('posts.json') ? JSON.parse(readFileSync('posts.json', 'utf8')) : [];
const seen = new Set(posts.map(p => p.url));
const save = () => { for (let i = 0; i < 5; i++) try { return writeFileSync('posts.json', JSON.stringify(posts, null, 1)); } catch {} };   // Windows may lock the file briefly
const keep = p => { const key = (p.title + '|' + p.company).toLowerCase(); if (seen.has(p.url) || posts.some(q => (q.title + '|' + q.company).toLowerCase() === key)) return false; seen.add(p.url); return true; };

// bdjobs renders the job client-side; its fields arrive in the page's ng-state JSON (the jobDetails API response).
function bdText(p, h) {
  const state = JSON.parse(h.match(/<script id="ng-state" type="application\/json">([\s\S]*?)<\/script>/)?.[1] || '{}');
  const j = Object.values(state).find(v => /jobDetails/.test(v?.u || ''))?.b?.data?.[0];
  if (!j || j.JobFound !== 'True') return false;
  p.text = ['JobDescription', 'EducationRequirements', 'AdditionJobRequirements', 'SkillsRequired'].map(k => text(j[k] || '')).filter(Boolean).join('\n');
  p.skillsTagged = j.SuggestedSkills || ''; p.experience = j.experience || p.experience; p.salary = j.JobSalaryRangeText || p.salary;
  return true;
}
// Older runs stored the page's scripts as text: refresh those from the same page.
for (const p of posts.filter(p => p.source === 'bdjobs' && /^\(\(\)=>/.test(p.text))) {
  const h = await get(p.url).catch(() => '');
  if (!h || !bdText(p, h)) p.text = ''; save(); console.log('refreshed', p.title);
}

// bdjobs: search API, then the detail page for the requirement text.
for (const kw of KEYWORDS) for (let pg = 1; pg <= 10; pg++) {
  const api = `https://api.bdjobs.com/jobs/api/v1/JobSearch/GetJobSearch?keyword=${encodeURIComponent(kw)}&pg=${pg}&rpp=100&ToggleJobs=true&isFresher=false`;
  const d = await get(api, { Origin: 'https://bdjobs.com', Referer: 'https://bdjobs.com/' }).then(JSON.parse).catch(() => ({}));
  const list = [...(d.data || []), ...(d.premiumData || [])];
  if (!list.length) break;
  for (const j of list) {
    if (!RELEVANT.test(j.jobTitle) || EXCLUDE.test(j.jobTitle) || new Date(j.publishDate) < CUTOFF) continue;
    const p = { source: 'bdjobs', id: j.Jobid, title: j.jobTitle.trim(), company: j.companyName.trim(), posted: j.publishDate.slice(0, 10),
      experience: j.experience, salary: j.Salary, url: `https://bdjobs.com/h/details/${j.Jobid}` };
    if (!keep(p)) continue;
    const h = await get(p.url).catch(e => (console.log('skip', e.message), ''));
    if (!h) continue;
    if (!bdText(p, h)) continue;
    posts.push(p); save(); console.log('bdjobs', p.posted, p.title, '|', p.company);
  }
}

// LinkedIn guest search: 10 cards per page; then the guest job-posting page for the description.
if (!process.env.SKIP_LINKEDIN) for (const loc of ['Bangladesh', 'Dhaka%2C%20Bangladesh']) for (const kw of KEYWORDS) {
  for (let start = 0; start < 100; start += 10) {
    const h = await get(`https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(kw)}&location=${loc}&f_TPR=r7776000&start=${start}`).catch(() => '');
    const cards = [...h.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
    if (!cards.length) break;
    for (const c of cards) {
      const title = text(c.match(/base-search-card__title">([\s\S]*?)</)?.[1] || ''), company = text(c.match(/hidden-nested-link[^>]*>([\s\S]*?)</)?.[1] || '');
      const posted = c.match(/datetime="([^"]+)"/)?.[1], url = c.match(/href="(https:\/\/[^"?]+\/jobs\/view\/[^"?]+)/)?.[1], id = url?.match(/(\d+)$/)?.[1];
      const where = text(c.match(/job-search-card__location">([\s\S]*?)</)?.[1] || '');
      if (!id || !RELEVANT.test(title) || EXCLUDE.test(title) || !/bangladesh|dhaka|chattogram|chittagong|sylhet|khulna|rajshahi/i.test(where)) continue;
      const p = { source: 'linkedin', id, title, company, posted, location: where, url };
      if (!keep(p)) continue;
      const d = await get(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${id}`).catch(() => '');
      p.text = text(d.match(/show-more-less-html__markup[^>]*>([\s\S]*?)<\/div>/)?.[1] || '').slice(0, 12000);
      p.level = text(d.match(/Seniority level<\/h3>\s*<span[^>]*>([\s\S]*?)<\/span>/)?.[1] || '');
      if (!p.text) continue;
      posts.push(p); save(); console.log('linkedin', p.posted, p.title, '|', p.company);
    }
  }
}
writeFileSync('posts.json', JSON.stringify(posts, null, 1));
console.log(`${posts.length} posts (bdjobs ${posts.filter(p => p.source === 'bdjobs').length}, linkedin ${posts.filter(p => p.source === 'linkedin').length})`);
