---
name: step-01-analyze
description: Analyze the error in depth to understand root cause
prev_step: steps/step-00-init.md
next_step: steps/step-02-find-solutions.md
---

# Step 1: Analyze the Error

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER propose solutions in this step
- ✅ ALWAYS gather complete error context before concluding
- 📋 YOU ARE AN INVESTIGATOR, not a fixer
- 💬 FOCUS on understanding the problem only
- 🚫 FORBIDDEN to make code changes

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis reasoning before conclusions
- 💾 Document all findings in `{error_analysis}`
- 📖 Complete investigation before loading next step
- 🚫 FORBIDDEN to load step-02 until analysis is thorough

## CONTEXT BOUNDARIES:

- Variables from step-00: `{error_context}`, `{auto_mode}`
- Don't assume solutions exist yet
- Focus purely on understanding what's wrong

## YOUR TASK:

Investigate the error thoroughly to understand its root cause, affected files, and scope of impact.

---

## EXECUTION SEQUENCE:

### 1. Gather Error Information

**Read the COMPLETE error message first** - don't skim!
- Parse the exact error message and type
- Identify file paths and line numbers from stack trace
- Note any error codes, exit codes, or status

**If no specific error:**
- Ask user to describe exact symptoms
- Check `git status` and `git log --oneline -10` for recent changes
- Look for obvious issues in mentioned files

### 2. Reproduce the Error (CRITICAL)

<critical>
If you cannot reproduce consistently, you cannot verify a fix. This is non-negotiable.
</critical>

**Attempt reproduction:**
- Run the exact command/action that triggers the error
- Document the minimal steps to reproduce
- Note any conditions (environment, data, timing)

**If cannot reproduce:**
- Escalate instrumentation (add targeted logging)
- Check for Heisenbug indicators (timing-sensitive, race condition)
- Ask user for more context about when it occurs

### 3. Form Hypotheses (Ranked)

**List 3-5 possible causes in order of likelihood:**

```markdown
## Hypotheses (Most → Least Likely)

1. **[Most Likely]** {hypothesis}
   - Evidence: {what supports this}
   - Test: {how to verify/disprove}

2. **[Likely]** {hypothesis}
   - Evidence: {what supports this}
   - Test: {how to verify/disprove}

3. **[Possible]** {hypothesis}
   - Evidence: {what supports this}
   - Test: {how to verify/disprove}
```

**Test hypotheses systematically** - don't jump to the first idea!

### 4. Investigate the Codebase

**Search for relevant code:**
- Use Grep to find related patterns
- Read files mentioned in error COMPLETELY
- Check imports and dependencies
- Look for similar patterns that work elsewhere

**Build context:**
- What function/component is failing?
- What data flows through this code?
- Check git blame: who changed this recently and why?

### 5. Identify Root Cause

**Validate against hypotheses:**
- Which hypothesis is confirmed/rejected by evidence?
- What is the immediate cause vs. deeper underlying issue?
- Are there related problems?

**Document analysis:**
```yaml
error_analysis:
  error_type: "{type of error}"
  error_message: "{exact error message}"
  reproducible: {true | false}
  reproduction_steps: "{minimal steps}"
  hypotheses_tested:
    - hypothesis: "{what you thought}"
      result: "{confirmed | rejected}"
  root_cause: "{what's actually causing this}"
  affected_files:
    - "{file1}"
    - "{file2}"
  scope: "{localized | widespread}"
  complexity: "{simple | moderate | complex}"
  verification_method: "{how to verify the fix}"
```

### 6. Confirm Analysis

**If `{auto_mode}` = true:**
→ Proceed to step-02 automatically

**If `{auto_mode}` = false:**
Present analysis summary, then use AskUserQuestion:
```yaml
questions:
  - header: "Analysis"
    question: "Does this analysis correctly identify the issue?"
    options:
      - label: "Yes, find solutions (Recommended)"
        description: "Analysis is correct, proceed to find fixes"
      - label: "Partially correct"
        description: "Some details are wrong, let me clarify"
      - label: "Not correct"
        description: "This isn't the right issue, re-analyze"
    multiSelect: false
```

**Handle responses:**
- **"Yes, find solutions":** Update state, load step-02
- **"Partially correct":** Get clarification, update analysis, re-confirm
- **"Not correct":** Get more context, re-do analysis

---

## SUCCESS METRICS:

✅ Error reproduced (or documented why it can't be)
✅ 3+ hypotheses formed and tested systematically
✅ Root cause clearly identified with evidence
✅ Affected files documented
✅ Verification method identified for later
✅ `{error_analysis}` state variable populated
✅ User confirmed analysis (if not auto_mode)

## FAILURE MODES:

❌ Jumping to solutions without thorough analysis
❌ Skipping reproduction attempt
❌ Testing only one hypothesis (tunnel vision)
❌ Missing key files or dependencies in investigation
❌ Not confirming analysis with user before proceeding
❌ **CRITICAL**: Making code changes in this step

## ANALYSIS PROTOCOLS:

- Read actual error messages, don't assume
- Check git history for recent changes that might have caused this
- Look at test files to understand expected behavior
- Don't skip investigating even if solution seems obvious

---

## NEXT STEP:

After analysis confirmed, load `./step-02-find-solutions.md`

<critical>
Remember: This step is ONLY about analysis - don't fix or propose solutions yet!
</critical>
