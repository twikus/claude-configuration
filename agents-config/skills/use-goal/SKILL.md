---
name: use-goal
description: Create or draft a Codex or Claude Code /goal with evidence-based completion criteria. Use when the user asks to create, draft, set, start, or refine a Goal for persistent multi-turn work.
disable-model-invocation: true
user-invocable: true
---

Create or draft one persistent Goal only when the user asked for Goal mode. A Goal is bigger than one prompt and smaller than an open-ended project; do not use one for a loose backlog.

Identify the platform, then open the matching reference before drafting or creating:

- Codex → `references/codex-goal.md` for `get_goal` / `create_goal`, CLI `/goal`, and completion rules
- Claude Code → `references/claude-code-goal.md` for manual `/goal`, evaluator behavior, and dispatch limits
- Unknown → return a plain `/goal ...` and say the user must run it in the target agent

If Goal tools exist, use them. If only slash commands exist, return the exact `/goal ...` unless the harness can dispatch it.

Inspect repo docs, scripts, CI, logs, issues, or plans until a verification surface exists. Prefer existing project commands. If none exists, ask one question or make the Goal require creating one. For refactors, deletions, migrations, moves, or "remove all X", open `references/verification-harnesses.md` first and require a measurable harness.

Write a compact contract: outcome, verification surface, constraints, boundaries, iteration policy, blocked stop. Keep it non-empty and at most 4,000 characters; longer instructions go in a file the Goal names.

When tools are available: check status first. Create only if the user asked to create, set, start, or use a Goal and none exists. Set a token budget only when the user gave one. Do not overwrite, clear, pause, or resume an existing Goal unless asked. If the user asked only to draft or refine, return the `/goal ...` text and do not activate it.

Ask only when a missing detail would make the Goal unverifiable or unsafe. Mark complete only after the stated evidence exists. Budget exhaustion is not completion. If status reports go vague, tighten the Goal instead of adding one-off instructions. If blocked, report attempted paths, evidence, blocker, and the input that unlocks progress.
