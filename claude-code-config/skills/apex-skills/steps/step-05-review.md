---
name: step-05-review
description: Adversarial code review with parallel agents - security, logic, clean-code analysis
prev_step: steps/step-04-validate.md
next_step: steps/step-06-resolve.md
---

# Step 5: Adversarial Review

**Goal:** Critical review using parallel specialized agents. Find issues before they reach production.

**Priority:** Security > Correctness > Maintainability > Performance

---

<available_state>
From previous steps:

- `{task_description}` - What was implemented
- `{auto_mode}` - If true, use recommended options
- All files modified during implementation
- Validation results (all passing)
</available_state>

---

<execution_sequence>

<phase_1_gather_changes>
**1. Gather All Changes**

Get list of modified files:

```bash
git diff --name-only HEAD~1
git status --porcelain
```

Group files by type:
- Source files (`.ts`, `.tsx`, `.js`, etc.)
- Test files (`*.test.ts`, `*.spec.ts`)
- Config files
- Other

Count total files to determine review strategy.
</phase_1_gather_changes>

<phase_2_determine_strategy>
**2. Determine Review Strategy**

| Change Size | Files | Strategy |
|-------------|-------|----------|
| Small | 1-5 files | 2 parallel agents (security + clean-code) |
| Medium | 6-15 files | 3 parallel agents (security + logic + clean-code) |
| Large | 16+ files | 4+ parallel agents (split by area + focus) |
</phase_2_determine_strategy>

<phase_3_launch_agents>
**3. Launch Parallel Review Agents**

**CRITICAL: Launch ALL agents in a SINGLE message for parallel execution.**

**Always run these agents in parallel:**

**Agent 1: Security Review** (`code-reviewer`)
```xml
<review_request>
  <focus_area>security</focus_area>
  <files>
    <file path="path/to/file1.ts" />
    <file path="path/to/file2.ts" />
  </files>
  <context>{task_description}</context>
</review_request>

Review for OWASP Top 10:
- Injection flaws (SQL, XSS, command)
- Authentication/authorization issues
- Sensitive data exposure
- Security misconfiguration
- CSRF vulnerabilities

Return findings as: Severity | Issue | Location | Impact | Fix
```

**Agent 2: Logic & Correctness** (`code-reviewer`)
```xml
<review_request>
  <focus_area>feature-logic</focus_area>
  <files>
    <file path="path/to/file1.ts" />
    <file path="path/to/file2.ts" />
  </files>
  <context>{task_description}</context>
</review_request>

Review for:
- Edge cases not handled
- Race conditions
- Off-by-one errors
- Null/undefined handling
- Incorrect boolean logic
- Missing error handling

Return findings as: Severity | Issue | Location | Impact | Fix
```

**Agent 3: Clean Code** (`code-reviewer`)
```xml
<review_request>
  <focus_area>clean-code</focus_area>
  <files>
    <file path="path/to/file1.ts" />
    <file path="path/to/file2.ts" />
  </files>
  <context>{task_description}</context>
</review_request>

Review for:
- SOLID principle violations
- Code smells (long methods, god classes)
- Complexity issues (cyclomatic complexity)
- Poor naming
- Code duplication >20 lines
- Functions >50 lines

Return findings as: Severity | Issue | Location | Impact | Fix
```

**For Medium/Large changes, also run:**

**Agent 4: Test Coverage** (`code-reviewer`)
```xml
<review_request>
  <focus_area>tests</focus_area>
  <files>
    <file path="path/to/file1.test.ts" />
  </files>
  <context>{task_description}</context>
</review_request>

Review for:
- Missing test cases for critical paths
- Edge cases not tested
- Assertions that don't verify behavior
- Test isolation issues

Return findings as: Severity | Issue | Location | Impact | Fix
```
</phase_3_launch_agents>

<phase_4_collect_results>
**4. Collect Agent Results**

Wait for all agents to complete:
```
TaskOutput(task_id=agent-security, block=true)
TaskOutput(task_id=agent-logic, block=true)
TaskOutput(task_id=agent-cleancode, block=true)
TaskOutput(task_id=agent-tests, block=true)  # if launched
```

Collect all findings into one list.
</phase_4_collect_results>

<phase_5_merge_and_dedupe>
**5. Merge and Deduplicate**

1. Combine results from all agents
2. Remove duplicate issues (same file:line)
3. Prioritize: Security > Logic > Clean Code > Tests
4. Assign IDs: F1, F2, F3...
5. Classify validity: Real, Noise, Uncertain
</phase_5_merge_and_dedupe>

<phase_6_present_findings>
**6. Present Findings Report**

```markdown
## Adversarial Review Complete

**Files reviewed**: {count}
**Agents used**: Security, Logic, Clean-Code{, Tests}
**Findings**: {total} ({blocking} blocking, {critical} critical, {suggestions} suggestions)

---

### Blocking Issues (Must Fix)

| ID | Issue | Location | Impact | Fix |
|----|-------|----------|--------|-----|
| F1 | SQL injection | `auth.ts:42` | Data breach risk | Use parameterized query |

---

### Critical Issues (Strongly Recommended)

| ID | Issue | Location | Impact | Fix |
|----|-------|----------|--------|-----|
| F2 | Missing null check | `handler.ts:67` | Runtime crash | Add null guard |

---

### Suggestions (Optional)

| ID | Suggestion | Location | Benefit |
|----|------------|----------|---------|
| F3 | Extract method | `utils.ts:89` | Readability |

---

### Summary by Category

| Category | Findings |
|----------|----------|
| Security | {count} |
| Logic | {count} |
| Clean Code | {count} |
| Tests | {count} |

---

### Verdict

**{🚫 BLOCKED | 🔧 NEEDS FIXES | ✅ APPROVED}**

{Brief explanation}
```
</phase_6_present_findings>

<phase_7_create_todos>
**7. Create Finding Todos**

Use TodoWrite to track findings:
```
1. ⏸ F1 [BLOCKING/Security] Fix SQL injection in auth.ts:42
2. ⏸ F2 [CRITICAL/Logic] Add null check in handler.ts:67
3. ⏸ F3 [SUGGESTION/Clean] Extract method in utils.ts:89
```
</phase_7_create_todos>

</execution_sequence>

---

<filtering_rules>
**INCLUDE (high-impact only):**
- Security vulnerabilities (any severity)
- Logic bugs or incorrect behavior
- Missing error handling for likely cases
- Significant code duplication (>20 lines)
- Functions >50 lines with multiple responsibilities
- Missing tests for critical paths

**EXCLUDE (nitpicks):**
- Formatting/whitespace (use linter)
- Naming unless misleading
- "Could be cleaner" without specific issue
- Minor optimizations
- Subjective preferences
</filtering_rules>

---

<success_metrics>

- All parallel agents completed
- Findings deduplicated and prioritized
- Clear severity classification (BLOCKING/CRITICAL/SUGGESTION)
- Actionable feedback (What + Why + Fix)
- No nitpicks included
- Todos created for tracking
</success_metrics>

<failure_modes>

- Launching agents sequentially instead of parallel
- Including nitpicks and style preferences
- Missing security review
- Vague findings without actionable fixes
- Not waiting for all agents to complete
</failure_modes>

---

<next_step_directive>
**CRITICAL:** When findings presented, explicitly state:

"**NEXT:** Loading `step-06-resolve.md`"

Then load and execute `steps/step-06-resolve.md`.
</next_step_directive>
