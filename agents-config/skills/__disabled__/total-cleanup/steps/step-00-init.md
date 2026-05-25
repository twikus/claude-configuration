---
name: step-00-init
description: Initialize total-cleanup workflow - parse flags and detect target files
next_step: steps/step-01-security.md
---

# Step 0: Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip flag parsing
- ✅ ALWAYS detect target files before proceeding
- 📋 Parse ALL flags before any other action
- 💬 FOCUS on initialization only - don't analyze code yet
- 🚫 FORBIDDEN to proceed without proper file detection

## EXECUTION PROTOCOLS:

- 🎯 Parse flags first, then detect files
- 💾 Create output structure if save_mode
- 📖 Initialize state variables for subsequent steps
- 🚫 FORBIDDEN to load step-01 until init complete

## YOUR TASK:

Initialize the workflow by parsing flags and detecting target files for cleanup.

---

## DEFAULTS CONFIGURATION:

```yaml
auto_mode: false     # -a: Skip confirmations
save_mode: false     # -s: Save reports to output folder
only_step: null      # -1/-2/-3: Run only specific step
target_files: []     # Files/folders to analyze
```

---

## INITIALIZATION SEQUENCE:

### 1. Parse Flags and Input

**Step 1: Load defaults from config above**

**Step 2: Parse user input and override defaults:**
```
Enable flags (lowercase):
  -a → {auto_mode} = true
  -s → {save_mode} = true
  -1 → {only_step} = 1 (security only)
  -2 → {only_step} = 2 (clean code only)
  -3 → {only_step} = 3 (simplify only)

Remainder → {target_files} or detect automatically
```

### 2. Detect Target Files

**If target files specified:**
→ Use the provided files/folders

**If no target files specified:**
→ Use `git diff --name-only HEAD~1` to find recently modified files
→ Filter to include only code files (*.ts, *.tsx, *.js, *.jsx, *.py, etc.)

**Store in `{target_files}` array**

### 3. Create Output Structure (if save_mode)

```bash
mkdir -p .claude/output/total-cleanup/{task_id}
```

Create `00-context.md`:
```markdown
# Total Cleanup: {task_id}

**Created:** {timestamp}
**Target:** {target_files}

## Configuration
| Flag | Value |
|------|-------|
| auto_mode | {value} |
| save_mode | {value} |
| only_step | {value} |

## Progress
| Step | Status | Timestamp |
|------|--------|-----------|
| 00-init | ✓ | {timestamp} |
| 01-security | ⏸ Pending | |
| 02-clean-code | ⏸ Pending | |
| 03-simplify | ⏸ Pending | |
```

### 4. Display Summary

Show the user:
```markdown
## Total Cleanup Initialized

**Target files:**
- file1.ts
- file2.tsx
- ...

**Steps to run:**
1. Security Check (code-reviewer agent)
2. Clean Code (/clean-code skill)
3. Code Simplification (code-simplifier agent)

**Mode:** {auto_mode ? "Auto" : "Interactive"}
```

### 5. Confirm Start

**If `{auto_mode}` = true:**
→ Proceed directly to step-01

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Start"
    question: "Ready to begin total cleanup?"
    options:
      - label: "Begin (Recommended)"
        description: "Start with security check"
      - label: "Modify files"
        description: "I want to change the target files"
      - label: "Cancel"
        description: "Don't run cleanup"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ All flags correctly parsed
✅ Target files detected and listed
✅ Output folder created (if save_mode)
✅ State variables set for subsequent steps
✅ User confirmed (or auto_mode)

## FAILURE MODES:

❌ No target files found
❌ Not parsing all flags before proceeding
❌ Missing state variables
❌ Not creating output structure when save_mode

---

## NEXT STEP ROUTING:

**If `{only_step}` = 1:**
→ Load `./step-01-security.md`, then complete (skip steps 2-3)

**If `{only_step}` = 2:**
→ Load `./step-02-clean-code.md` directly

**If `{only_step}` = 3:**
→ Load `./step-03-simplify.md` directly

**Otherwise:**
→ Load `./step-01-security.md`

<critical>
Remember: Init is ONLY about setup - don't analyze code here!
</critical>
