---
name: step-01-security
description: Security check using code-reviewer agent
prev_step: steps/step-00-init.md
next_step: steps/step-02-clean-code.md
---

# Step 1: Security Check

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip security analysis
- ✅ ALWAYS use the code-reviewer agent for security review
- 📋 YOU ARE A security coordinator, not the reviewer itself
- 💬 FOCUS on security vulnerabilities only (not clean code)
- 🚫 FORBIDDEN to modify code in this step - analysis only

## EXECUTION PROTOCOLS:

- 🎯 Launch code-reviewer agent with security focus
- 💾 Save security findings (if save_mode)
- 📖 Complete analysis fully before loading next step
- 🚫 FORBIDDEN to load step-02 until security check complete

## CONTEXT BOUNDARIES:

- Variables available: `{target_files}`, `{auto_mode}`, `{save_mode}`, `{output_dir}`
- Previous context: Files detected in step-00
- Don't fix issues yet - just identify them
- code-reviewer agent loaded on-demand

## YOUR TASK:

Run a comprehensive security review on all target files using the code-reviewer agent.

---

## EXECUTION SEQUENCE:

### 1. Launch Code Reviewer Agent

Use the Task tool to launch the `code-reviewer` agent:

```xml
<review_request>
  <focus_area>security</focus_area>

  <files>
    <!-- Include all {target_files} -->
    <file path="{file1}" />
    <file path="{file2}" />
    ...
  </files>
</review_request>
```

**Agent configuration:**
- subagent_type: `code-reviewer`
- Focus: security vulnerabilities
- Wait for complete analysis

### 2. Collect Security Findings

Parse the agent's response and extract:
- BLOCKING issues (must fix)
- CRITICAL issues (strongly recommended)
- SUGGESTION issues (optional)

Store in `{security_findings}` array:
```yaml
security_findings:
  - severity: BLOCKING
    issue: "SQL injection vulnerability"
    location: "src/api/users.ts:42"
    fix: "Use parameterized queries"
  - severity: CRITICAL
    issue: "Missing auth check"
    location: "src/routes/admin.ts:15"
    fix: "Add authorization middleware"
```

### 3. Display Findings Table

Present findings to user:

```markdown
## Security Review Complete

**Files reviewed:** {count}
**Issues found:** {count}

| Severity | Issue | Location | Fix |
|----------|-------|----------|-----|
| BLOCKING | {issue} | `file:line` | {fix} |
| CRITICAL | {issue} | `file:line` | {fix} |

### Summary
{Brief summary from code-reviewer agent}
```

### 4. Save Report (if save_mode)

**If `{save_mode}` = true:**
→ Write to `{output_dir}/01-security.md`

### 5. Fix Security Issues

**If BLOCKING or CRITICAL issues found:**

**If `{auto_mode}` = true:**
→ Automatically fix all BLOCKING and CRITICAL issues

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Fix"
    question: "Found {count} security issues. Fix them now?"
    options:
      - label: "Fix all (Recommended)"
        description: "Fix BLOCKING and CRITICAL issues"
      - label: "Fix BLOCKING only"
        description: "Only fix must-fix vulnerabilities"
      - label: "Skip fixes"
        description: "Continue without fixing (not recommended)"
    multiSelect: false
```

**Apply fixes based on response**

### 6. Confirm Completion

**If `{auto_mode}` = true:**
→ Proceed to step-02

**If `{auto_mode}` = false AND `{only_step}` != 1:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Continue"
    question: "Security check complete. Continue to Clean Code analysis?"
    options:
      - label: "Continue (Recommended)"
        description: "Proceed to clean code check"
      - label: "Review first"
        description: "I want to review the fixes"
      - label: "Stop here"
        description: "End the cleanup process"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ Code-reviewer agent launched with security focus
✅ All target files analyzed
✅ Findings collected and categorized by severity
✅ BLOCKING issues fixed (if any)
✅ Report saved (if save_mode)
✅ User confirmed to continue

## FAILURE MODES:

❌ Not using code-reviewer agent
❌ Skipping files from target list
❌ Ignoring BLOCKING security issues
❌ **CRITICAL**: Proceeding with unfixed BLOCKING vulnerabilities
❌ **CRITICAL**: Not using AskUserQuestion for user decisions

## SECURITY CHECK PROTOCOLS:

- Always prioritize security over speed
- BLOCKING issues must be fixed before proceeding (unless user explicitly skips)
- Document all findings even if no issues found
- Use exact file:line references for all issues

---

## NEXT STEP:

**If `{only_step}` = 1:**
→ Complete - show final summary

**Otherwise:**
After user confirms via AskUserQuestion, load `./step-02-clean-code.md`

<critical>
Remember: This step is ONLY about security - clean code comes in step 2!
</critical>
