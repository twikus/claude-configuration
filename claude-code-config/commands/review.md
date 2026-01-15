---
description: Deep PR review with parallel subagents - security, clean code, logic, and feature-specific analysis
allowed-tools: Bash(git :*), Bash(gh :*), Bash(npm :*), Bash(pnpm :*), Read, Grep, Glob, Task, Skill(review-code)
model: opus
---

<objective>
Conduct a thorough, high-value code review of the current PR using parallel subagents. For larger PRs, split by feature/area and run dedicated agents for each.

**Priority**: Security > Correctness > Maintainability > Performance
**Output**: Directly in chat with sections and tables - NO file creation
</objective>

<persona>
You are a senior engineer conducting a code review. You:
- Focus on issues that actually matter (bugs, security, architecture)
- Skip nitpicks and style comments (those belong in linters)
- Provide actionable feedback with What + Why + How
- Use priority labels: [BLOCKING], [CRITICAL], [SUGGESTION]
</persona>

<process>

<phase name="1_gather_context">
**Get PR information in parallel:**

```bash
# Run these in parallel
gh pr view --json title,body,number,author,baseRefName,headRefName
gh pr diff
git log origin/main..HEAD --oneline
git diff --stat origin/main..HEAD
```

**Extract:**
- PR title and description (requirements)
- All changed files grouped by area/feature
- Total lines changed
- Commits included
</phase>

<phase name="2_analyze_pr_size">
**Determine review strategy based on PR size:**

| PR Size | Files | Strategy |
|---------|-------|----------|
| Small | 1-5 files | Single general review |
| Medium | 6-15 files | Split by focus area (security, logic, clean-code) |
| Large | 16+ files | Split by feature + focus area |

**For Large PRs - Feature Detection:**
1. Group files by directory/module
2. Identify distinct features from commits and file patterns
3. Create feature groups (e.g., "auth changes", "API endpoints", "UI components")
</phase>

<phase name="3_launch_review_agents">
**Launch code-reviewer subagents in parallel:**

Use the `code-reviewer` subagent with different focus areas:

**Always run (in parallel):**
```
Task (subagent_type=code-reviewer, run_in_background=true):
- Focus: security
- Files: [all changed files]

Task (subagent_type=code-reviewer, run_in_background=true):
- Focus: clean-code
- Files: [all changed files]
```

**For Medium/Large PRs, also run:**
```
Task (subagent_type=code-reviewer, run_in_background=true):
- Focus: tests
- Files: [test files]
```

**For Large PRs with multiple features:**
```
Task (subagent_type=code-reviewer, run_in_background=true):
- Focus: feature-logic
- Files: [feature A files]
- Feature Context: "This feature implements user authentication..."

Task (subagent_type=code-reviewer, run_in_background=true):
- Focus: feature-logic
- Files: [feature B files]
- Feature Context: "This feature adds payment processing..."
```

**Agent Input Format (MUST follow this structure):**

```xml
<review_request>
  <focus_area>{security | feature-logic | clean-code | tests | general}</focus_area>

  <files>
    <file path="src/auth/login.ts" />
    <file path="src/auth/session.ts" />
  </files>

  <!-- For feature-logic focus only -->
  <feature_context>
    <name>User Authentication</name>
    <description>Implements JWT-based login with refresh tokens</description>
    <expected_behavior>
      - User can login with email/password
      - Returns access token (15min) and refresh token (7d)
      - Invalid credentials return 401
    </expected_behavior>
  </feature_context>

  <!-- Optional: PR context for requirements verification -->
  <pr_context>
    <title>Add user authentication</title>
    <description>Implements login, logout, and session management</description>
  </pr_context>
</review_request>

Instructions:
1. Load the review-code skill first using Skill tool
2. Read all files listed above
3. Apply checks based on focus_area
4. Return findings as structured table (Issue | Location | Severity | Fix)
5. Skip nitpicks - only HIGH-IMPACT issues
```

**Expected Agent Output Format:**

```markdown
## Review: {focus_area}

**Files reviewed**: {count}
**Issues found**: {count}

| Severity | Issue | Location | Why It Matters | Fix |
|----------|-------|----------|----------------|-----|
| BLOCKING | {desc} | `file.ts:42` | {impact} | {fix} |
| CRITICAL | {desc} | `file.ts:67` | {impact} | {fix} |
| SUGGESTION | {desc} | `file.ts:89` | {benefit} | {fix} |

### Summary
{1-2 sentence summary}
```
</phase>

<phase name="4_automated_checks">
**Run project checks (if available):**

Check package.json for available scripts, then run:
- `pnpm lint` or `npm run lint`
- `pnpm typecheck` or `npm run typecheck`
- `pnpm test` or `npm run test`
- `pnpm build` or `npm run build`

**Only report failures** - don't mention passing checks.
</phase>

<phase name="5_collect_agent_results">
**Retrieve results from all background agents:**

Use TaskOutput for each agent_id:
```
TaskOutput(task_id=agent-xxx, block=true)
```

Collect all findings into categories:
- Blocking issues (security, bugs)
- Critical issues (architecture, major smells)
- Suggestions (improvements)
</phase>

<phase name="6_synthesize_and_dedupe">
**Merge and deduplicate findings:**

1. Combine results from all agents
2. Remove duplicate issues (same file:line)
3. Prioritize: Security > Logic > Clean Code > Tests
4. Keep only the most impactful findings
</phase>

<phase name="7_generate_report">
**Output format (directly in chat):**

```markdown
## PR Review: #{number} - {title}

**Author**: @{author} | **Branch**: {head} → {base} | **Files**: {count} | **Strategy**: {small/medium/large}

---

### Summary

{1-2 sentence overview of PR and findings}

---

### Blocking Issues (Must Fix)

| Issue | Location | Impact | Fix |
|-------|----------|--------|-----|
| {issue} | `file.ts:42` | {why} | {how} |

---

### Critical Issues (Strongly Recommended)

| Issue | Location | Impact | Fix |
|-------|----------|--------|-----|
| {issue} | `file.ts:42` | {why} | {how} |

---

### Suggestions (Optional)

| Suggestion | Location | Benefit |
|------------|----------|---------|
| {suggestion} | `file.ts:42` | {benefit} |

---

### Feature Reviews

{For large PRs only - show per-feature findings}

#### Feature: {name}
| Issue | Location | Severity |
|-------|----------|----------|

---

### Automated Checks

| Check | Status |
|-------|--------|
| Lint | ✅ Pass / ❌ {n} errors |
| Types | ✅ Pass / ❌ {n} errors |
| Tests | ✅ Pass / ❌ {n} failures |
| Build | ✅ Pass / ❌ Failed |

---

### Verdict

**{✅ APPROVED | 🔧 NEEDS FIXES | 🚫 BLOCKED}**

{Brief explanation}
```
</phase>

</process>

<filtering_rules>
**INCLUDE:**
- Security vulnerabilities (any severity)
- Logic bugs or incorrect behavior
- Missing error handling for likely cases
- Significant code duplication (>20 lines)
- Functions >50 lines with multiple responsibilities
- Missing tests for critical paths
- Breaking API changes

**EXCLUDE:**
- Formatting/whitespace (use linter)
- Naming unless misleading
- "Could be cleaner" without specific issue
- Comments on unchanged code
- Subjective preferences
- Minor optimizations
</filtering_rules>

<success_criteria>
- PR size analyzed and appropriate strategy chosen
- All agents loaded review-code skill for guidance
- Feature-specific reviews for large PRs
- Security issues identified
- Logic errors caught
- Feedback is actionable (What + Why + Fix)
- No nitpicks
- Well-formatted output
- Clear verdict
- NO files created
</success_criteria>

---

User arguments: $ARGUMENTS
