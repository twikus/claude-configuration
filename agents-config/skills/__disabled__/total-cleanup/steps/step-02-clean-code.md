---
name: step-02-clean-code
description: Clean code analysis using clean-code-runner agent (Opus)
prev_step: steps/step-01-security.md
next_step: steps/step-03-simplify.md
---

# Step 2: Clean Code Check

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip clean code analysis
- ✅ ALWAYS use the Task tool with `clean-code-runner` agent
- 📋 YOU ARE A workflow coordinator, not the analyzer itself
- 💬 FOCUS on clean code principles only (security was step 1)
- 🚫 FORBIDDEN to proceed without running the agent

## EXECUTION PROTOCOLS:

- 🎯 Use Task tool with `clean-code-runner` agent (runs on Opus)
- 💾 Save clean code findings (if save_mode)
- 📖 Complete clean code check fully before loading next step
- 🚫 FORBIDDEN to load step-03 until clean code complete

## CONTEXT BOUNDARIES:

- Variables available: `{target_files}`, `{auto_mode}`, `{save_mode}`, `{output_dir}`, `{security_findings}`
- Previous context: Security issues (if any) from step-01
- Focus on React, Next.js, Zustand, TanStack Query patterns
- Agent handles technology detection and skill invocation

## YOUR TASK:

Launch the clean-code-runner agent (Opus) to apply best practices and clean code principles to all target files.

---

## EXECUTION SEQUENCE:

### 1. Launch Clean Code Runner Agent

Use the **Task tool** to launch the `clean-code-runner` agent:

```yaml
Task tool:
  subagent_type: clean-code-runner
  description: "Run clean-code on target files"
  prompt: |
    Run the /clean-code skill with auto mode on these files:

    Target files:
    - {file1}
    - {file2}
    ...

    Execute: /clean-code -a {target_files joined by space}

    Return a structured summary of what was analyzed and fixed.
```

**Example:**
```yaml
Task tool:
  subagent_type: clean-code-runner
  description: "Clean code analysis"
  prompt: |
    Run the /clean-code skill with auto mode on these files:

    Target files:
    - src/features/auth
    - src/api/users.ts

    Execute: /clean-code -a src/features/auth src/api/users.ts
```

**The agent will:**
1. Invoke /clean-code -a automatically
2. Follow the skill's workflow (scan → apply → verify)
3. Return structured results

### 2. Wait for Agent Completion

The clean-code-runner agent runs on **Opus model** and will:
- Detect technologies (React, Next.js, Zustand, TanStack Query)
- Load relevant best practices docs
- Apply clean code improvements
- Verify with build
- Return structured summary

**Wait for full completion before proceeding.**

### 3. Collect Clean Code Findings

Parse the agent's response and extract:
- Issues identified and fixed
- Technologies detected
- Build status

Store in `{clean_code_issues}` array:
```yaml
clean_code_issues:
  - type: "function-too-long"
    location: "src/api/users.ts:50"
    action: "Split into smaller functions"
    status: "fixed"
  - type: "missing-error-handling"
    location: "src/features/auth.tsx:120"
    action: "Added try-catch"
    status: "fixed"
```

### 4. Display Summary

Present summary to user:

```markdown
## Clean Code Analysis Complete

**Files analyzed:** {count}
**Issues fixed:** {count}
**Model used:** Opus

### Technologies Detected
- React: ✓
- Next.js: ✓
- Zustand: ✓
- TanStack Query: ✓

### Changes Applied
| Type | Location | Action |
|------|----------|--------|
| {type} | `file:line` | {action} |

### Build Status
✓ Build passed
```

### 5. Save Report (if save_mode)

**If `{save_mode}` = true:**
→ Write to `{output_dir}/02-clean-code.md`

### 6. Confirm Completion

**If `{auto_mode}` = true:**
→ Proceed to step-03

**If `{auto_mode}` = false AND `{only_step}` != 2:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Continue"
    question: "Clean code analysis complete. Continue to code simplification?"
    options:
      - label: "Continue (Recommended)"
        description: "Proceed to simplification"
      - label: "Review changes"
        description: "I want to review the clean code changes"
      - label: "Stop here"
        description: "End the cleanup process"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ clean-code-runner agent launched via Task tool
✅ All target files analyzed
✅ Issues identified and fixed
✅ Build passes after changes
✅ Report saved (if save_mode)
✅ User confirmed to continue

## FAILURE MODES:

❌ Not using Task tool with clean-code-runner agent
❌ Agent fails to invoke /clean-code skill
❌ Skipping build verification
❌ **CRITICAL**: Proceeding with build failures
❌ **CRITICAL**: Not using AskUserQuestion for user decisions

## CLEAN CODE PROTOCOLS:

- Always use clean-code-runner agent (Opus model)
- Agent handles skill invocation with -a flag
- Trust agent's technology detection
- Build must pass before proceeding

---

## NEXT STEP:

**If `{only_step}` = 2:**
→ Complete - show final summary

**Otherwise:**
After user confirms via AskUserQuestion, load `./step-03-simplify.md`

<critical>
Remember: This step uses clean-code-runner agent (Opus) - don't run skill directly!
</critical>
