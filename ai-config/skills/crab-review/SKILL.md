---
name: crab-review
description: "Consensus-based code review using the Crab Method. Asks what to review (clean-code, security, logic, performance, accessibility, or all), then launches 3 parallel Sonnet agents per area with different analytical lenses. Only fixes issues where 2+ agents agree. Use when reviewing code, auditing quality, or wanting high-confidence fixes."
argument-hint: "[review-type] [PR number, file paths, or empty]"
allowed-tools:
  - Agent
  - AskUserQuestion
  - Read
  - Edit
  - Glob
  - Grep
  - Bash
---

# Crab Review - Consensus Code Review

3 agents per area. Different lenses. Only fix what 2+ agree on.

## Review Types

| # | Type | Lenses | Agents |
|---|------|--------|--------|
| 1 | clean-code | Reader, Architect, Maintainer | 3 |
| 2 | security | Attacker, Auditor, Data Flow | 3 |
| 3 | logic | Edge Cases, Correctness, Resilience | 3 |
| 4 | performance | Profiler, Query Analyzer, Memory Inspector | 3 |
| 5 | accessibility | Screen Reader, Keyboard Nav, Mobile User | 3 |
| A | all | All 5 types | 15 |

## Phase 0: PARSE ARGUMENTS

Parse `$ARGUMENTS` to extract review type and target.

**Review type keywords**: `clean-code`, `clean`, `security`, `sec`, `logic`, `performance`, `perf`, `accessibility`, `a11y`, `all`, `full`

**Target**: PR number (digits), file paths, or empty.

Examples:
- `/crab-review security 42` - security review on PR #42
- `/crab-review clean-code` - clean code review, will ask what code
- `/crab-review 42` - PR #42, will ask what type
- `/crab-review` - will ask both

## Phase 1: ASK REVIEW TYPE

Skip if type was provided in arguments.

Use AskUserQuestion:

```
What should I review?

1. Clean Code - readability, SOLID, maintainability
2. Security - vulnerabilities, OWASP, data flow
3. Logic - edge cases, correctness, resilience
4. Performance - speed, N+1 queries, memory leaks
5. Accessibility - a11y, UX, responsive design
A. All of the above (15 agents)

Pick one or more (e.g. "1,2" or "A"):
```

Parse response: "1" = clean-code, "1,3" = clean-code + logic, "A" = all 5 types.

## Phase 2: SCOPE

Determine what code to review.

**If PR number provided** (`$ARGUMENTS` contains a number):
```bash
gh pr diff {number}
gh pr view {number} --json title,body
```

**If file paths provided** (`$ARGUMENTS` contains paths):
```bash
git diff -- {paths}
```

**If no target provided** - detect git state and ask user:

1. Run:
```bash
git branch --show-current
git diff --stat
git diff --cached --stat
```

2. Build options:

| Condition | Options |
|-----------|---------|
| Feature branch + pending changes | 1) Pending changes only, 2) `{branch}` vs `main`, 3) vs custom base |
| Feature branch + no pending changes | 1) `{branch}` vs `main`, 2) vs custom base |
| `main` + pending changes | 1) Pending changes only, 2) Last commit |
| `main` + no pending changes | 1) Last commit, 2) Last N commits |

3. Use AskUserQuestion to present options and wait for choice.

4. Collect diff based on choice.

Collect: full diff, list of changed files, PR title/description if available.

If no changes found, inform user and stop.

## Phase 3: DISPATCH

Launch all agents in a SINGLE message. All run in parallel.

### Agent Configuration

For each agent:
- `subagent_type: "code-reviewer"`
- `model: "sonnet"`
- `run_in_background: true`

### Lens Registry

**clean-code:**

| Lens | Focus |
|------|-------|
| Reader | First-time readability and cognitive load |
| Architect | SOLID principles, structure, coupling |
| Maintainer | Complexity, duplication, testability |

**security:**

| Lens | Focus |
|------|-------|
| Attacker | Think like a threat actor exploiting this code |
| Auditor | Systematic OWASP control verification |
| Data Flow | Trace sensitive data through every stage |

**logic:**

| Lens | Focus |
|------|-------|
| Edge Cases | Null, boundaries, overflow, concurrency |
| Correctness | Does code do what it claims? |
| Resilience | Error handling, failure modes, recovery |

**performance:**

| Lens | Focus |
|------|-------|
| Profiler | CPU-heavy ops, unnecessary computation, re-renders |
| Query Analyzer | N+1 queries, over-fetching, missing indexes |
| Memory Inspector | Leaks, unbounded caches, closure references |

**accessibility:**

| Lens | Focus |
|------|-------|
| Screen Reader | Semantic HTML, ARIA, alt text, heading hierarchy |
| Keyboard Navigator | Focus management, tab order, keyboard shortcuts |
| Mobile User | Touch targets, responsive layout, loading states |

### Agent Prompt Template

Use this exact structure for each agent. Replace `{AREA}`, `{LENS}`, `{LENS_FOCUS}`, `{AREA_ID}`.

```xml
<review_request>
  <focus_area>{AREA} - {LENS}</focus_area>
  <reference_files>
    <file>{SKILL_PATH}/references/{AREA_ID}-checklist.md</file>
  </reference_files>
  <changed_files>
    <file path="{each changed file}" />
  </changed_files>
  <diff_context>
{paste the diff}
  </diff_context>
  <pr_context>
    <title>{PR title if available}</title>
    <description>{PR description if available}</description>
  </pr_context>
</review_request>

INSTRUCTIONS:
1. Read the reference file listed in <reference_files>
   Focus on the "{LENS} Lens" section specifically.
2. Read EACH file listed in <changed_files> completely
3. Analyze through your specific lens ONLY: {LENS_FOCUS}
4. For EACH issue found, return a structured entry with:
   - Severity: BLOCKING | CRITICAL | SUGGESTION
   - Title: short descriptive title
   - Location: file:line
   - Code: short snippet
   - Problem: 1-2 sentences
   - Impact: why this matters
   - Fix: concrete fix (actual code)
5. Only report issues with confidence >= 80%. No nitpicks, no style comments.
6. Maximum 10 issues - prioritize the most impactful
7. If no issues found, say "No issues found from {LENS} perspective."
```

### AREA_ID mapping

| Type | AREA_ID |
|------|---------|
| clean-code | clean-code |
| security | security |
| logic | logic |
| performance | performance |
| accessibility | accessibility |

## Phase 4: CONSENSUS

After all agents return, analyze their combined findings.

### Consensus Algorithm

For each issue across the agent results:

1. **Identify the concept**: Group by `file:line_range` + `issue_type`. Two issues are "the same" if they point to the same code location AND describe the same fundamental problem (even if worded differently).

2. **Count agreements within the area** (3 agents per area):
   - 3/3 agents flagged it = **CONFIRMED**
   - 2/3 agents flagged it = **LIKELY**
   - 1/3 agents flagged it = **NOISE** (dismiss)

3. **Cross-area boost**: If the same issue appears in 2+ different areas, promote it one level regardless of per-area count.

### Build the Consensus Report

```
# Crab Review Report

**Scope**: {X files} | **Types**: {selected types} | **Agents**: {N}

## CONFIRMED (3/3 agree - will fix)

| # | Area | Issue | Location | Severity | Agents |
|---|------|-------|----------|----------|--------|

## LIKELY (2/3 agree - will fix)

| # | Area | Issue | Location | Severity | Agents |
|---|------|-------|----------|----------|--------|

## DISMISSED (1/3 only - noise filtered)

{count} issues dismissed as noise.

## Verdict
- CONFIRMED: {N} | LIKELY: {N} | Noise: {N}
- Signal-to-noise ratio: {confirmed+likely}/{total} ({percentage}%)
```

## Phase 5: FIX

Apply fixes for all CONFIRMED and LIKELY issues.

1. For each consensus issue, use the best fix suggestion from the agent that provided the most detailed/concrete fix
2. Apply fixes using the Edit tool
3. After all fixes applied, show a summary of changes made

**Do NOT fix NOISE (1/3) issues.**

If there are no CONFIRMED or LIKELY issues, congratulate the user on clean code.

## Execution Rules

- Launch exactly 3 agents per selected review type - no shortcuts
- ALWAYS use `subagent_type: "code-reviewer"` and `model: "sonnet"`
- The main orchestrator reads agent results directly - no intermediate files
- NEVER fix an issue that only 1 agent flagged
- NEVER skip the consensus phase
