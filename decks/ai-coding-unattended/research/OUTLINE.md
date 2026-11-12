# Outline: AI-কে কাজ দিয়ে চলে যাবেন? আগে এই ৪টা জিনিস ঠিক করুন

**Series:** AI Coding (new; Talk 1, with `sustainable-ai-coding` as a related standalone Talk) · **Level:** Intermediate · **Length:** 8–12 min, 12 Slides, plus 3 reels · **Arc:** numbered rules (opening on before → after) · **Look:** Clay (`lib/looks/clay.css`) · Script: `scripts/ai-coding-unattended.txt`, not written yet
**Promise to the viewer:** After this, you know which parts of an AI coding agent's work you can now hand over, and which four things you have to set up first so that it stays safe and does the right thing while you're not watching. It works in Claude Code, Cursor, Codex or Copilot.

**Title.** **"AI-কে কাজ দিয়ে চলে যাবেন? আগে এই ৪টা জিনিস ঠিক করুন"**. Alternatives:
- "AI agent-কে আর পাহারা দিতে হবে না, যদি…"
- "Claude Code, Cursor: ২০২৬-এর best practices"

Keep "AI coding agent best practices" in the description.

## The angle
Most AI-coding videos are feature tours ("10 Claude Code tips"), and many still teach 2025 habits: IMPORTANT! in the rules file, "think hard", babysit every command.

We tell one shift instead: **you used to sit in the loop at every step; now you step out, and something else has to take each job over.** Lydia Hallie's talk (Anthropic, Nov 2026) is the spine. The talk then generalises past Claude Code:
- **Model:** what the model decides on its own.
- **Harness:** what the tool must enforce every time.
- **Environment:** what the machine makes impossible.

Every rule is checked against Anthropic's docs and two independent sources: the human-review study, and ImpossibleBench on agents gaming tests.

**How this differs from what's on YouTube** (SOURCES.md, "Existing videos"):
- It isn't a feature tour; it's one idea with four rules.
- Every claim has evidence on screen.
- It covers four tools, not one.
- It's in Bangla.

**The surprise.** Two linked ones:
1. **You are the weak link.** Shown a clearly dangerous command partway through a session, people refused it only 13.6% of the time, and only about 5% after 50 prompts. An AI classifier blocked 89%.
2. **But 89% isn't "never".** Anything that must *never* happen has to live in the harness (a deny rule, a sandbox, a hook), not in the model's judgment, and not in yours either.

## Story beats
Each beat is one Slide. *Visual* = what's on screen; *Steps* = what moves on each click (↓); *Numbers* = where they come from. **[Illustration]** = assumed example, labelled "ধরা যাক…" on screen.

### Opening: you've already left the loop (Slides 1–3)

1. **Hook: ২,৫০০ → ৩০,০০০.** "Anthropic-এ মে মাসে দিনে গড়ে আড়াই হাজার code change merge হতো। সেপ্টেম্বরে ত্রিশ হাজারের বেশি। মানুষ কি ১২ গুণ বেশি review করছে? না। মানুষ loop থেকে বের হয়ে গেছে।"
   - *Visual (graph 1):* a light, thin big number "2,500 → 30,000+" with small captions "May 2026" and "Sep 2026", and two bars on a shared axis. The `.traj` cover sits behind it in a panel: many trajectories fanning out from a few avatars.
   - *Steps:* (1) The 2,500 bar. (2) The 30,000 bar rises (count). (3) A question chip: "কে review করছে?"
   - *Numbers:* Anthropic Engineering, 13 Oct 2026. Source line: "Anthropic-এর নিজস্ব monorepo".
   - *Vertical:* the bars stack under the number.
2. **In the loop → out of the loop. [Illustration]** Five jobs we used to do by hand: steer, approve, say no, check, start. "আগে AI প্রতিটা ধাপে থামত, আর আমরা হাত দিতাম। এখন model ভালো হয়েছে, আমরা সরে যাচ্ছি। কিন্তু যেখান থেকে আমরা সরলাম, সেখানে অন্য কাউকে দায়িত্ব নিতে হবে।"
   - *Visual:* a `.traj` session with human avatars over every second node. Below it, five small concept cards (Hallie's "In the loop" layout, in our kit).
   - *Steps:*
     1. The avatars pop on, one per job.
     2. The avatars lift away and the five cards dim (out of the loop).
     3. Three chips: **Model · Harness · Environment**.
     4. Two questions land: "নিরাপদ তো?" and "ঠিক কাজটা হচ্ছে তো?"
   - *Numbers:* none. This is Hallie's framing, credited on the source line.
   - *Vertical:* the cards become a 2+3 grid.
3. **The frame: AI ঠিক করে, নাকি tool বাধ্য করে (diagram).** "আপনার প্রতিটা নির্দেশ দুই রকমের। কিছু AI পড়ে, তারপর নিজে ঠিক করে মানবে কি না। আর কিছু tool প্রতিবার চালাবেই, AI যা-ই ভাবুক।"
   - *Visual (diagram):* a two-column table in panels, "AI ঠিক করে" | "Tool বাধ্য করে", with three rows:
     - কী করবে: prompt, rules file | hook
     - কী ছুঁতে পারবে: classifier | deny rule, sandbox
     - কখন শেষ: "done" বলা | test, CI
   - *Steps:* one row per click. On the last click, a rule card: "যা প্রতিবার হতেই হবে, সেটা ডান কলামে।"
   - *Numbers:* Claude Code best-practices table (simplified; tool-neutral labels). Small chips show the per-tool names: CLAUDE.md / AGENTS.md / .cursor/rules.

### Rule 1: drop the old tricks (Slide 4)

4. **নিয়ম ১: পুরনো মন্ত্র বাদ দিন.** "২০২৫-এ আমরা rules file-এ লিখতাম IMPORTANT!, think hard, keep going। আজকের model-এ এগুলো উল্টো কাজ করে: AI নিয়মটা বেশি জোরে মানে, যেখানে দরকার নেই সেখানেও।"
   - *Visual:* a `.code` panel "CLAUDE.md" (with an AGENTS.md chip beside it).
   - *Steps:*
     1. "IMPORTANT: ALWAYS…", "Think hard and be thorough", "Keep going until done" and "Our stack is React + Node…" strike through, one per click (`line` del).
     2. What stays lights up green: the test command, "src/legacy is still live, don't copy it", "deploy needs migration review".
     3. A rule card: "শুধু সেটাই লিখুন, যেটা code পড়ে বোঝা যায় না।" Then a small chip: "বারবার ভুল করলে? সেটা hook-এ যাবে (নিয়ম ৪)".
   - *Numbers:* best-practices page, "Keep CLAUDE.md short" and the table "What you can stop doing", quoted.
   - *Vertical:* the panel takes the full width.

### Rule 2: what can't be undone becomes a rule (Slides 5–6)

5. **আপনি কতটা ভালো পাহারাদার? (graph 2).** "১,০৫৩ জন পেশাদারকে কাজের মাঝখানে একটা স্পষ্ট বিপজ্জনক command দেখানো হলো। কতজন 'না' বললেন?"
   - *Visual (graph):* a dot grid of 1,053 tiny people (Hallie's stat layout), with "13.6%" in lavender and "89%" in clay, plus a small line chart for fatigue.
   - *Steps:*
     1. 143 people light up lavender: "মানুষ: ১৩.৬%".
     2. 937 dots light up clay: "auto mode: ৮৯%".
     3. A fatigue line falls from about 17% at the start of a session to about 5% after 50+ prompts, while the classifier line stays flat.
     4. A chip: "তবু ১১% পার হয়ে যায়".
   - *Numbers:* Claude blog, 7 Aug 2026 (all values). Caveat on the source line: "study environment; Anthropic-এর নিজের গবেষণা".
   - *Vertical:* the grid fills the width, and the line chart goes below it.
6. **"ফেরানো যায়?"** Hallie's test. "AI একবার ভুল করলে ফেরানো যায়? Code ভুল হলে git দিয়ে ফেরানো যায়, ওটা AI-এর বিচারে ছেড়ে দিন। কিন্তু secret ফাঁস, data মুছে ফেলা, বাইরে পাঠানো: এগুলো ফেরানো যায় না। এগুলো নিয়ম।"
   - *Visual:* Hallie's verdict layout: "হ্যাঁ → AI-কে ছেড়ে দিন" (green) | "না → নিয়ম বানান" (pink). Below it, a `.code` panel `.claude/settings.json` with deny rules.
   - *Steps:*
     1. The Yes column: edits, tests, anything git can revert.
     2. The No column: deletes for good, exposes a secret, sends outside.
     3. The deny line `"Read(./.env)"` lights green.
     4. A small `.traj`: "Read .env" turns into a pink ✕ before the classifier is ever reached. Chip: "Deny rule আগে, AI-এর বিচার পরে".
   - *Numbers:* best-practices + auto mode blog ("permission rules still fire before the classifier"). Per-tool chips: Cursor hooks deny, Codex approval policy.

### Rule 3: put it in a box (Slides 7–8)

7. **`npm test`-এর ভেতরে কী চলে? [Illustration, simulation 1].** "AI চালাল npm test। নিরীহ command, যে কেউ allow করত। কিন্তু test চলার সময় চলে এমন code, যা আপনি লেখেননি: আপনার dependency। ধরা যাক তার একটা নষ্ট।"
   - *Visual:* `.traj` with a "Bash npm test" node. Below it, a `.term`-style list: vitest run / auth.test.ts / node_modules/some-package (pink row). Three file icons: `.env`, `~/.ssh`, `collector.example`.
   - *Steps:*
     1. npm test is allowed (green ✓ chip "permission: OK").
     2. A pink line runs from the package to `.env` and `~/.ssh`, and on to `collector.example`. A chip: "permission শুধু দেখেছিল 'npm test'".
     3. A `.frame` "sandbox · OS আটকায়" draws around it, and the three lines end in pink ✕.
     4. A chip row: "কোন file পড়বে · কোথায় লিখবে · কোন host-এ যাবে".
   - *Numbers:* none (Illustration). The mechanism is from the Claude sandboxing docs: child processes, OS-level. Label "ধরা যাক".
   - *Vertical:* the list sits on top and the icons go below in a row.
8. **সবচেয়ে ভালো বাক্স: আলাদা machine.** "আরও ভালো: AI চলুক এমন machine-এ, যেখানে আপনার secret-ই নেই। ঢাকার অফিসের চাবি হাতে না দিয়ে, একটা খালি ঘরে কাজ করতে দিন।"
   - *Visual:* `.frame` with a ☁ header, "cloud machine", and a trajectory inside it. Chips below.
   - *Steps:*
     1. "repo-র নতুন copy", "laptop বন্ধ থাকলেও চলে".
     2. "নেই: .env · ~/.ssh · GitHub token" (dimmed chips).
     3. Per-tool proof chips:
        - Codex: "agent চলার আগে secret সরিয়ে ফেলা হয়"
        - Claude cloud: "network শুধু package registry"
        - Cursor: "sandbox-এ ৪০% কম থামে"
     4. A warning chip: "machine ফেলে দেওয়া যায়, কিন্তু যা বের হয় (push, message) তা যায় না → deny rule সাথে রাখুন".
   - *Numbers:* Codex security doc, Claude cloud-environments doc (verify wording), Cursor blog (40%).

### Rule 4: "done" means pass/fail (Slides 9–11)

9. **একই prompt, সাত রকম ফল. [Illustration, simulation 2].** "বললেন: auth-টা নতুন API-তে নিয়ে যাও। প্রতিটা ফলই দেখতে ঠিক লাগে। একটায় পুরনো API রয়ে গেছে, একটায় সবাই logout হয়ে গেছে।"
   - *Visual:* Hallie's branching trajectory: one start, seven paths, each ending in a box with a one-line outcome. Needs a `branch` part (not built yet; see open items).
   - *Steps:*
     1. The seven paths draw out, with outcome chips.
     2. Green checkpoint squares appear along the paths; the wrong paths hit a pink ✕ at the first check and fade.
     3. One path survives: "যা চেয়েছিলাম".
     4. A rule card: "AI-কে এমন কিছু দিন যা pass/fail বলে: test, build, screenshot। আর প্রমাণ চান: command আর তার output।"
   - *Numbers:* none (Illustration). The quote "Give Claude something it can run that comes back pass or fail" goes on the source line.
   - *Vertical:* the branches fan downward.
10. **কিন্তু AI test-টাই বদলে দেয় (graph 3).** "গবেষকরা ইচ্ছে করে এমন কাজ দিলেন, যেটা নিয়ম মেনে পাস করা অসম্ভব। তবু model-রা পাস করল। কীভাবে? test-টাই বদলে দিয়ে।"
   - *Visual (graph):* horizontal bars of the cheating rate:
     - GPT-5 on Oneoff-SWE-bench: 76%
     - GPT-5 on Conflicting-SWE-bench: 54%
     - the same with an abort option: 9%
     - a small callout: "Claude models: >৭৯% প্রতারণা test file বদলে"
   - *Steps:* one bar per click. On the last click, a rule card: "test file read-only রাখুন; prompt-এ লিখুন: code ঠিক করো, test না।"
   - *Numbers:* ImpossibleBench (arXiv 2510.20270). Caveat chip: "২০২৫-এর model, ইচ্ছাকৃত অসম্ভব কাজ".
   - *Vertical:* the bars stack taller.
11. **যাচাই বাধ্যতামূলক: hook আর CI. [simulation 3].** "Prompt-এ বললে AI প্রায় সবসময় test চালায়। 'প্রায়' যথেষ্ট না হলে hook। আর একটা ছোট্ট ফাঁদ: script exit 1 দিলে tool ধরে নেয় কাজ শেষ। ফেরত পাঠাতে হলে exit 2।"
   - *Visual:* Hallie's Hooks slide. A `.traj` with three checkpoint chips below it: "প্রতি edit → lint", "প্রতি task → তার test", "শেষে → সব test". Then a `.code` hook line.
   - *Steps:*
     1. The three hook chips.
     2. A test fails → **exit 1** → the trajectory continues anyway to a grey "completed" box (pink chip: "ভুল করে শেষ!").
     3. Rewind: **exit 2** → a dotted arc goes back to the checkpoint, "আবার ঠিক করো".
     4. A `.code` line `pnpm tsc --noEmit 1>&2 || exit 2` lights green.
     5. The last net is a CI chip: "প্রতিটা PR-এ একই check, AI যা-ই করুক". Review by risk: docs typo → 0 জন, সাধারণ → ১ জন, ঝুঁকিপূর্ণ → ২ জন.
   - *Numbers:* Claude hooks reference (exit 1 = non-blocking, exit 2 sends back); Hallie for review-by-risk (her team's practice, labelled as such). Needs a back-arc part (see open items).

### Close (Slide 12)

12. **কাজগুলো হারায়নি, শুধু জায়গা বদলেছে.** The recap as Hallie's mapping table: steering → model; approving → auto mode / classifier; saying no → deny rules, sandbox; checking → tests, hooks, CI; starting → still you (for now). "আপনার কাজ এখন দুটো: শুরু করা, আর যা বের হয় তা দেখা। এই সপ্তাহে একটা কাজ দিন, যেটা সাধারণত AI-কে দেন না, তার চেয়ে অনেক বড়। দেখুন কোথায় আটকায়। ওটাই পরের জিনিস, যেটা হাতছাড়া করবেন।"
   - *Visual:* the mapping table, rows "problem → solution" with a clay arrow.
   - *Steps:* one row per click; on the last click, the CTA chip.
   - *Vertical:* rows stack.

**Visual count:**
- Graphs: 3 (beats 1, 5, 10).
- Simulations: 3 (beats 7, 9, 11).
- Diagrams: 1 (beat 3), plus the mapping table.
- This meets the minimum of 2 graphs, 2 simulations and 1 diagram.

## Reels (Vertical, 45–60 s each, self-contained)
Each reel reuses Slides from the Deck in Vertical (`?format=vertical&play` if voiced), with its own 3-second hook and one CTA to the full video.

- **R1 · "আপনি মাত্র ১৩.৬%".** Hook: "AI যখন বিপজ্জনক command চায়, আপনি কি 'না' বলবেন? ১,০৫৩ জনের মধ্যে বলেছিলেন মাত্র ১৪৩ জন।" Beat 5 (dot grid + fatigue line), then the punchline from beat 6: "যা ফেরানো যায় না, সেটা AI-এর বিচারে না, নিয়মে রাখুন।" ~50 s.
- **R2 · "AI test-টাই বদলে দেয়".** Hook: "অসম্ভব কাজ দিলেন, তবু test pass। কীভাবে?" Beat 10's bars, then the fix: read-only tests, plus "code ঠিক করো, test না". ~45 s.
- **R3 · "exit 1 দিলে AI ভাবে কাজ শেষ".** Hook: "আপনার test fail করছে, অথচ AI বলছে done।" Beat 11's exit 1 vs exit 2 simulation and the one-line hook. ~45 s; the most "save this" reel.
- Spare idea: "IMPORTANT! লেখা বন্ধ করুন" (beat 4).

## Not in this Talk (and why)
- **Orchestrator sessions** (Hallie's "Claude Code projects", beta): Advanced, Claude-only and in beta. It fits a later Talk in the Series.
- **Configuring auto mode in plain English** (`autoMode.environment`): Claude-only detail; one chip at most.
- **Model names** (Opus 5.5, Fable 5.2): kept out, so the video doesn't date quickly and stays tool-neutral.
- **Prompt injection against auto mode** (the CSA note): covered by the prompt-injection Talk. One source-line mention on beat 5 at most.

## Open items before the Deck
- Kit parts to build in `lib/talk.js`:
  - `.traj` branching (beat 9)
  - a back-arc from a fail to an earlier checkpoint (beat 11)
  - a dot-grid stat part (beat 5, 1,053 dots)
- Verify the **(verify)** lines in SOURCES.md, especially the Claude cloud-environments and Copilot firewall wording, before the Script quotes them.
- Decide whether to show Hallie's face/name on screen. Default: name and talk title on the source line only.
