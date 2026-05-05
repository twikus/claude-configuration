---
name: review-code
description: This skill should be used when the user asks to "review code", "review this PR", "code review", "audit this code", or mentions reviewing pull requests, security checks, or code quality. Multi-agent deep review - dynamically scopes code, launches parallel specialized Opus agents (security, clean-code, UX/UI, backend), each loading domain-specific references. Focuses on high-impact issues, not nitpicks.
model: opus
argument-hint: "[PR number or file paths]"
---

<objective>
Multi-agent code review orchestrator. Analyze the scope of changes, determine which review domains apply, then launch parallel specialized sub-agents (each on Opus) that load the right references for deep, domain-specific analysis.
</objective>

<workflow>
## Phase 1: SCOPE - Analyze changes and determine review domains

1. **Get the diff.** Determine what to review:
   - If user provided a PR number: `gh pr diff {number}`
   - If user provided file paths: `git diff` on those files
   - If nothing specified: `git diff` (unstaged) + `git diff --cached` (staged)
   - If no local changes: ask user what to review

2. **Categorize changed files** into domains by scanning extensions and paths:

| Domain | Signals |
|--------|---------|
| **frontend** | `.tsx`, `.jsx`, `.css`, `.scss`, `components/`, `pages/`, `app/`, `ui/` |
| **backend** | `.ts`/`.js` in `api/`, `server/`, `routes/`, `middleware/`, `lib/`, `services/`, `prisma/`, `drizzle/` |
| **security-sensitive** | Auth files, middleware, API routes, env handling, crypto, payments |
| **database** | Migration files, schema files, ORM models, raw SQL |
| **tests** | `.test.`, `.spec.`, `__tests__/`, `vitest`, `jest` |
| **config** | `.config.`, `package.json`, `tsconfig`, CI/CD files |

3. **Determine review agents to launch** based on domains detected:

| Condition | Agent | Focus | Reference to load |
|-----------|-------|-------|-------------------|
| Always (if >0 non-test files) | **Clean Code** | SOLID, complexity, code smells | `references/clean-code-principles.md` + `references/code-quality-metrics.md` |
| Backend or security-sensitive files | **Security** | OWASP, auth, injection, secrets | `references/security-checklist.md` |
| Frontend files (.tsx/.jsx/.css) | **UX/UI** | Accessibility, responsive, UX patterns | `references/ux-ui-checklist.md` |
| Backend files (API, DB, services) | **Backend** | API design, DB patterns, error handling | `references/backend-patterns.md` |
| Test files changed | **Tests** | Coverage gaps, test quality | (inline guidance) |

4. **Determine review scale:**
   - Small (1-5 files): 1-2 agents
   - Medium (6-15 files): 2-3 agents
   - Large (16+ files): 3-5 agents (full coverage)

## Phase 2: DISPATCH - Launch parallel specialized review agents

Launch all determined agents **in parallel** using the Task tool with `subagent_type: "code-reviewer"` and `model: "opus"`.

Each agent gets a structured prompt following this template:

```xml
<review_request>
  <focus_area>{domain}</focus_area>
  <reference_files>
    <file>{SKILL_PATH}/references/{reference-file}.md</file>
  </reference_files>
  <changed_files>
    <file path="src/example.ts" />
  </changed_files>
  <diff_context>
{paste relevant portions of the diff for this domain's files}
  </diff_context>
  <pr_context>
    <title>{PR title if available}</title>
    <description>{PR description if available}</description>
  </pr_context>
</review_request>

INSTRUCTIONS:
1. Read EACH reference file listed in <reference_files> - these contain your domain-specific checklists
2. Read EACH file listed in <changed_files> completely
3. Apply the checklist from the reference against the actual code
4. For EACH issue found, provide: Severity | Issue | Location (file:line) | Why It Matters | Concrete Fix
5. Only report issues with confidence >= 80. No nitpicks, no style comments.
6. Use severity labels: BLOCKING (must fix) | CRITICAL (strongly recommended) | SUGGESTION (optional improvement)
```

**Agent naming convention:** `review-{domain}` (e.g., `review-security`, `review-ux-ui`, `review-clean-code`, `review-backend`)

**If a best-practice skill exists** for the detected tech stack (e.g., `vercel-react-best-practices` for Next.js/React), include it in the prompt: tell the agent to also load that skill via the Skill tool for additional framework-specific checks.

## Phase 3: CONSOLIDATE - Merge and present findings

After all agents complete:

1. **Collect all findings** from each agent
2. **Deduplicate**: If multiple agents flagged the same issue, keep the most detailed one
3. **Sort by severity**: BLOCKING first, then CRITICAL, then SUGGESTION
4. **Present the unified report:**

```markdown
# Code Review Report

**Scope**: {X files across Y domains}
**Agents dispatched**: {list of agents launched}

## BLOCKING Issues (must fix before merge)
{consolidated blocking issues table}

## CRITICAL Issues (strongly recommended)
{consolidated critical issues table}

## SUGGESTIONS (optional improvements)
{consolidated suggestions table}

## Summary
{2-3 sentence overview of code health}
{Verdict: APPROVE / APPROVE WITH COMMENTS / REQUEST CHANGES}
```

5. **Verdict logic:**
   - Any BLOCKING issue → REQUEST CHANGES
   - Only CRITICAL + SUGGESTION → APPROVE WITH COMMENTS
   - No issues or only minor SUGGESTIONS → APPROVE
</workflow>

<execution_rules>
- ALWAYS launch at minimum 1 agent, maximum 5
- ALWAYS use `model: "opus"` for sub-agents
- ALWAYS pass the relevant reference file paths so agents can Read them
- ALWAYS include the actual diff context in the agent prompt (not just file paths)
- NEVER skip the scoping phase - it determines which agents are needed
- If the change is tiny (1-2 files, <50 lines), you MAY do a single-agent review with general focus instead of multi-agent
- Each agent should complete independently - they don't need to communicate with each other
</execution_rules>

<reference_files>
Domain-specific checklists loaded by sub-agents:

| Reference | Domain | Content |
|-----------|--------|---------|
| `references/security-checklist.md` | Security | OWASP Top 10, auth, injection, input validation, secrets |
| `references/clean-code-principles.md` | Clean Code | SOLID, code smells, function design, naming |
| `references/code-quality-metrics.md` | Clean Code | Complexity metrics, maintainability index, thresholds |
| `references/ux-ui-checklist.md` | UX/UI | Accessibility (WCAG), responsive design, UX patterns, loading states |
| `references/backend-patterns.md` | Backend | API design, database, error handling, concurrency, observability |
| `references/feedback-patterns.md` | All | How to structure feedback (What + Why + Fix), priority labels |
</reference_files>
