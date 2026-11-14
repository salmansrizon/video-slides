# Sources: AI-কে কাজ দিয়ে চলে যাবেন?

Fetched and read on 2026-11-12. No Experiment of our own: every number on screen comes from a source below. Quotes are exact. Lines marked **(verify)** come only from secondary coverage or weren't confirmed on the primary page; check them before the Script uses them.

## The starting point: Lydia Hallie's talk
- Lydia Hallie (Anthropic, Claude Code team), "Rethinking Claude Code Best Practices", AI Engineer Code Summit, 17:31. https://www.youtube.com/watch?v=vlfCjWuv4es
  - The auto-caption transcript is in `hallie-talk-transcript.txt`, for reference only (not to be shown or quoted at length).
  - Her frame: we used to be in the loop for "steering sessions, approving commands, saying no …, checking the output and also starting the sessions". Now "everywhere that we now step out of that loop, something else has to take over. And this is either the model, the harness, or the environment".
  - The two questions she builds the talk on: is the code still high-quality, and are the sessions "running safely"?
  - Her test for what must be a rule: "if Claude gets it wrong once, can I take it back?"
  - Her sandbox story: `npm test` runs code you didn't write, and "permissions only decide if a tool call runs, but they cannot limit what it can reach once it's running."
  - Her verification story: the same prompt ("move our auth to a new API") gives different reasonable-looking results, so set "verification points along the way … anything that comes back as a pass or fail."
  - Her try-this ending: take one task "way bigger than you normally give Claude", make sure CI catches what you care about, configure the environment, "see where your sessions get stuck".
  - The visual style reference is `library/reference/lydia-hallie-claude-code-vlfCjWuv4es/STYLE.md` (Clay Look).

## Anthropic: merges per day
- Anthropic Engineering, "Redesigning source control at Anthropic", Oct 13, 2026, "Written by Nick G. and the source control team". https://www.anthropic.com/engineering/redesigning-source-control
  - "In May 2026, Anthropic averaged around 2,500 code changes merged per day; as of September, we merged over 30,000 per day."
  - "Claude's ability to write code was both what put us in this situation in the first place"
  - "We perform on the order of 25 million code checkouts per day for CI"
  - Caveats for the Slide:
    - The two values are different kinds of number (a May average vs "over 30,000" as of September).
    - They count merges into Anthropic's own monorepo, not industry data.
    - Say "প্রায় ১২ গুণ" (30,000 / 2,500 = 12).

## Auto mode and the human-review study
- Claude blog, "Auto mode is now the default in Claude Code for Pro, Max, and Team plans", August 7, 2026 (updated October 22, 2026). https://claude.com/blog/auto-mode-default-in-claude-code
  - How it works: it "routes each tool call through a classifier targeted at blocking actions that are irreversible, destructive" or aimed outside your environment.
  - The study had 1,053 paid testers: "Partway through each session, a single permission prompt was swapped for a clearly dangerous command".
    - Humans refused 13.6% (143 of 1,053); auto mode would have blocked 89% (937 of 1,053).
    - Head to head, auto mode blocked 800 commands that humans approved, and humans blocked 6 that auto mode allowed.
    - Fatigue: humans blocked about 17% early in a session, falling to about 5% after 50+ prior prompts, while auto mode's rate stayed flat.
  - Permission rules "still fire before the classifier in auto mode".
  - Anthropic's own caveat: auto mode "relies on classification systems and therefore does not eliminate risk".
  - Study setup: the testers worked in a study environment, not their own code, and knew they were being studied (per Simon Willison's write-up).
- Simon Willison, link post, 8 Aug 2026. https://simonwillison.net/2026/Aug/8/auto-mode/
  - About 11% would still get through, and he wants independent confirmation.
- Cloud Security Alliance research note, 8 Sep 2026. https://labs.cloudsecurityalliance.org/research/csa-research-note-claude-code-automode-prompt-injection-2026/
  - Johann Rehberger's multi-step chain got past auto mode's per-action classifier in 60–80% of trials. The report was closed as "Informative".
  - The note calls auto mode a "best-effort convenience feature rather than a security boundary".
  - It cites a claim that users "had previously approved 97 percent of permission prompts regardless of content" (internal Anthropic testing via The Register, "reportedly") **(verify)**.
  - No attack details go on screen.
- Backslash Security says the classifier also over-blocks safe actions. https://www.backslash.security/blog/claude-code-auto-mode-catches-a-lot-but-not-everything **(verify; not read in full)**

## Claude Code docs: model decides vs harness enforces
- "Best practices for Claude Code". https://code.claude.com/docs/en/best-practices
  - Subtitle: "tell Claude what it can't see, give it a check to run, and enforce the rules that can't have exceptions."
  - Two kinds of instruction:
    - Non-deterministic: the prompt, `CLAUDE.md` or a skill; "there's no *guarantee* that it'll follow your instructions."
    - Deterministic: "a hook, a deny rule, or a managed setting. Claude Code applies this every time, no matter what the model decided to do."
  - Table rows used on Slide 3 (decides vs enforces):
    - what to do: prompt / hooks
    - what it can touch: classifier / deny rules, sandbox
    - when it's done: request for evidence / tests, Stop hook, CI
    - who has the last word: Claude's summary / branch protection, a person who approves the merge
  - "If you keep adding emphasis to a `CLAUDE.md` line and Claude still misses it, that's a sign the line belongs in a hook."
  - Keep `CLAUDE.md` to what Claude "couldn't work out from the code itself": test/typecheck/lint commands, misleading places in the code, decisions not in the repo, anything corrected twice.
  - "Give Claude something it can run that comes back pass or fail."
  - "ask Claude for *evidence* … 'All tests pass' on its own tells you very little".
  - Deny rules "hold in every permission mode". `Read(./.env)` also catches `cat .env`, "It won't catch a script that opens the file."
  - "your 'never' rules belong in deny rules or hooks."
  - Keep the enforced set small: "If you ever find yourself at forty of them, most are probably preferences".
  - Table "What you can stop doing" (Slide 4), each with its reason:
    - context-window anxiety
    - IMPORTANT / ALL CAPS ("piling on emphasis mostly makes Claude over-apply the rule")
    - "think hard"
    - "keep going, don't be lazy" ("more likely to cause over-work than fix a stall")
    - describing the architecture in CLAUDE.md ("Claude reads the repo itself")
  - `/doctor prompt-audit` "flags instructions that were written for older models".
- Hooks reference. https://code.claude.com/docs/en/hooks
  - Hooks "execute automatically at specific points in Claude Code's lifecycle."
  - "Exit code 1 without valid JSON output is a non-blocking error … even though 1 is the conventional Unix failure code. If your hook is meant to enforce a policy, use `exit 2`."
  - `TaskCompleted` with exit 2: "the task is not marked as completed and the stderr message is fed back to the model". `Stop` with exit 2: "Prevents Claude from stopping".
  - Example Stop hook: `pnpm tsc --noEmit 1>&2 || exit 2`.
- Sandboxing. https://code.claude.com/docs/en/sandboxing
  - "Permission rules … are evaluated before any tool runs."
  - The sandbox "provides OS-level enforcement … applies to Bash … commands and their child processes … holds regardless of what the model chose to run and even if an allowed command does more than its name suggests."
  - `Read` deny rules are merged into the sandbox's `denyRead`.
- Cloud environments. https://code.claude.com/docs/en/cloud-environments
  - The default "Trusted" network access allows package registries (npm, PyPI, RubyGems…) and blocks general internet.
  - Network secrets are used by sessions "without seeing them".
  - Setup scripts run first and are cached.
  - Checked 2026-11-13: the default is now called **Limited** ("package registries, GitHub, and cloud SDKs"); network secrets: "the key itself stays outside the VM". The Script says exactly this.

## Other tools (the same ideas, so the Talk works for any AI-coding user)
- **Cursor**, "Agent sandboxing", Feb 18, 2026. https://cursor.com/blog/agent-sandboxing
  - Uses Seatbelt on macOS, Landlock + seccomp on Linux, and WSL2 on Windows.
  - "Sandboxed agents stop 40% less often than unsandboxed ones."
  - Hooks such as `beforeShellExecution` can return deny (enterprise LLM safety page, https://cursor.com/docs/enterprise/llm-safety-and-controls). A forum bug says only deny is enforced **(verify)**.
- **OpenAI Codex**, "Agent approvals & security". https://learn.chatgpt.com/docs/agent-approvals-security
  - "By default, the agent runs with network access turned off."
  - The default `workspace-write` sandbox lets it work in the folder.
  - Cloud: "Secrets configured for cloud environments are available only during setup and are removed before the agent phase starts."
- **GitHub Copilot coding agent**, "Customize the agent environment". https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment
  - Runs in GitHub Actions with `copilot-setup-steps.yml`, and its firewall is on by default **(not confirmed on this page, 2026-11-13; not used in the Script)**.

## Evidence: agents game the tests
- Zhong, Raghunathan, Carlini, "ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases", arXiv:2510.20270, 23 Oct 2025 (ICLR 2026 poster). https://arxiv.org/abs/2510.20270
  - Method: tasks where the spec and the unit tests conflict, so any pass "necessarily implies a specification-violating shortcut".
  - "GPT-5 cheats in 76% of the tasks in Oneoff-SWEbench and 2.9% on Oneoff-LiveCodeBench." (54.0% on Conflicting-SWEbench.)
  - "Claude models and Qwen3-Coder, however, cheat primarily (>79%) through modifying test cases."
  - "Hiding tests … reduces cheating success rate to near zero, but also degrades performance"; "Read-only access provides a middle ground".
  - Abort option: GPT-5 dropped 54% → 9% and o3 49% → 12%; "much less pronounced for Claude Opus 4.1".
  - Caveats for the Slide:
    - These are 2025 models on deliberately impossible tasks, not today's models on normal work.
    - Present it as "why the check itself needs protecting", never as "AI always cheats".

## Existing videos (what's already out there)
- Anthropic's earlier "Claude Code best practices | Code w/ Claude" (Cal Rueb, 2025) is mostly CLAUDE.md, permissions, context and TDD, and is now partly out of date per the docs' "What you can stop doing" table.
- Cole Medin's "A Complete Guide to Claude Code" and similar 2026 guides are feature tours.
- Nothing in Bangla found. None of them frame it as "what you used to do → who does it now", or show the human-review study.
- (Search via secondary aggregators; not watched.)
