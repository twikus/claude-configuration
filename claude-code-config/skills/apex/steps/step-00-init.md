---
name: step-00-init
description: Initialize APEX workflow - parse flags, detect continuation, setup state
next_step: steps/step-01-analyze.md
---

# Step 0: Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip flag parsing
- 🛑 NEVER proceed without checking for existing workflow
- ✅ ALWAYS parse ALL flags before any other action
- ✅ ALWAYS check for resume before fresh init
- 📋 YOU ARE AN INITIALIZER, not an executor
- 💬 FOCUS on setup only - don't look ahead to implementation
- 🚫 FORBIDDEN to load step-01 until init is complete

## EXECUTION PROTOCOLS:

- 🎯 Parse flags first, then check resume, then setup
- 💾 Create output structure if save_mode enabled
- 📖 Initialize all state variables before proceeding
- 🚫 FORBIDDEN to start analysis until user confirms (unless auto_mode)

## CONTEXT BOUNDARIES:

- This is the FIRST step - no previous context exists
- User input contains flags and task description
- Output folder may or may not exist
- Don't assume anything about the codebase yet

## YOUR TASK:

Initialize the APEX workflow by parsing flags, detecting continuation state, and setting up the execution environment.

---

<defaults>
## Default Configuration

**Edit these values to change default behavior. Flags always override defaults.**

```yaml
# ===========================================
# APEX DEFAULT SETTINGS
# ===========================================

auto_mode: false      # -a: Skip confirmations, use recommended options
examine_mode: false   # -x: Auto-proceed to adversarial review
save_mode: false      # -s: Save outputs to .claude/output/apex/
test_mode: false      # -t: Include test creation and runner steps
economy_mode: false   # -e: No subagents, save tokens (for limited plans)
branch_mode: false    # -b: Verify not on main, create branch if needed
pr_mode: false        # -pr: Create pull request at end (enables -b)
interactive_mode: false # -i: Configure flags interactively

# Presets:
# Budget-friendly:  economy_mode: true
# Full quality:     examine_mode: true, save_mode: true, test_mode: true
# Autonomous:       auto_mode: true, examine_mode: true, save_mode: true, test_mode: true
```

**Flag Reference:**
| Enable | Disable | Description |
|--------|---------|-------------|
| `-a` | `-A` | Auto mode |
| `-x` | `-X` | Examine mode |
| `-s` | `-S` | Save mode |
| `-t` | `-T` | Test mode |
| `-e` | `-E` | Economy mode |
| `-b` | `-B` | Branch mode |
| `-pr` | `-PR` | PR mode (enables -b) |
| `-i` | — | Interactive mode |
| `-r <id>` | — | Resume mode |

</defaults>

---

## EXECUTION SEQUENCE:

### 1. Parse Flags and Input

**Step 1: Load defaults from config above**
```
{auto_mode}    = <default>
{examine_mode} = <default>
{save_mode}    = <default>
{test_mode}    = <default>
{economy_mode} = <default>
{branch_mode}  = <default>
{pr_mode}      = <default>
{interactive_mode} = <default>
```

**Step 2: Parse user input and override defaults:**
```
Enable flags (lowercase - turn ON):
  -a or --auto     → {auto_mode} = true
  -x or --examine  → {examine_mode} = true
  -s or --save     → {save_mode} = true
  -t or --test     → {test_mode} = true
  -e or --economy  → {economy_mode} = true

Disable flags (UPPERCASE - turn OFF):
  -A or --no-auto         → {auto_mode} = false
  -X or --no-examine      → {examine_mode} = false
  -S or --no-save         → {save_mode} = false
  -T or --no-test         → {test_mode} = false
  -E or --no-economy      → {economy_mode} = false
  -B or --no-branch       → {branch_mode} = false
  -PR or --no-pull-request → {pr_mode} = false

Branch/PR flags:
  -b or --branch        → {branch_mode} = true
  -pr or --pull-request → {pr_mode} = true, {branch_mode} = true

Interactive:
  -i or --interactive   → {interactive_mode} = true

Other:
  -r or --resume   → {resume_task} = <next argument>
  Remainder        → {task_description}
```

**Step 3: Generate task_id:**
```
{task_id} = NN-kebab-case-description

Example: "add user authentication" → "01-add-user-authentication"

NN = next available number in .claude/output/apex/
```

### 2. Check Resume Mode

**If `{resume_task}` is set:**

1. **Search for matching task:**
   ```bash
   ls .claude/output/apex/ | grep "^{resume_task}"
   ```

2. **If exact match found:**
   - Read `00-context.md` to restore state variables
   - Scan step files to find last completed step (check for completion marker)
   - Load next incomplete step
   - **STOP** - do not continue with fresh init

3. **If partial match (e.g., `-r 01`):**
   - If single match: use it
   - If multiple matches: list them and ask user to specify

4. **If no match found:**
   - List available tasks
   - Ask user to provide correct ID

**If NOT resuming:** → Continue to step 3

### 3. Run Optional Sub-Steps

**Load sub-steps in order (if flags enabled):**

```
IF {interactive_mode} = true:
  → Load steps/step-00b-interactive.md
  → User configures flags interactively
  → Return here with updated flags

IF {branch_mode} = true:
  → Load steps/step-00b-branch.md
  → Verify/create branch
  → Return here with {branch_name} set

IF {economy_mode} = true:
  → Load steps/step-00b-economy.md
  → Apply economy overrides
```

### 4. Create Output Structure (if save_mode)

**If `{save_mode}` = true:**

```bash
mkdir -p {project_root}/.claude/output/apex/{task_id}
```

**Create `00-context.md`:**
```markdown
# APEX Task: {task_id}

**Created:** {ISO timestamp}
**Task:** {task_description}

---

## Configuration

| Flag | Value |
|------|-------|
| Auto mode (`-a`) | {auto_mode} |
| Examine mode (`-x`) | {examine_mode} |
| Save mode (`-s`) | {save_mode} |
| Test mode (`-t`) | {test_mode} |
| Economy mode (`-e`) | {economy_mode} |
| Branch mode (`-b`) | {branch_mode} |
| PR mode (`-pr`) | {pr_mode} |
| Interactive mode (`-i`) | {interactive_mode} |
| Branch name | {branch_name} |

---

## User Request

```
{original raw input from user}
```

---

## Acceptance Criteria

_To be defined in step-01-analyze.md_

---

## Progress

| Step | Status | Timestamp |
|------|--------|-----------|
| 00-init | ✓ Complete | {timestamp} |
| 01-analyze | ⏸ Pending | |
| 02-plan | ⏸ Pending | |
| 03-execute | ⏸ Pending | |
| 04-validate | ⏸ Pending | |
| 05-examine | {if examine_mode else "⏭ Skip"} | |
| 06-resolve | {if examine_mode else "⏭ Skip"} | |
| 07-tests | {if test_mode else "⏭ Skip"} | |
| 08-run-tests | {if test_mode else "⏭ Skip"} | |
| 09-finish | {if pr_mode else "⏭ Skip"} | |
```

### 5. Confirm Start

**If `{auto_mode}` = true:**
→ Proceed directly to step-01-analyze.md

**If `{auto_mode}` = false:**
Present summary and use AskUserQuestion:

```
**APEX Task Initialized**

**Task:** {task_description}
**ID:** {task_id}

**Flags:**
- Auto: {auto_mode}
- Examine: {examine_mode}
- Save: {save_mode}
- Test: {test_mode}
- Economy: {economy_mode}
- Branch: {branch_mode}
- PR: {pr_mode}
- Interactive: {interactive_mode}

{if branch_mode: "**Branch:** {branch_name}"}
{if save_mode: "**Output:** .claude/output/apex/{task_id}/"}
```

```yaml
questions:
  - header: "Start"
    question: "Ready to begin the APEX workflow?"
    options:
      - label: "Begin analysis (Recommended)"
        description: "Start gathering context for the task"
      - label: "Modify configuration"
        description: "I want to change the flags"
      - label: "Cancel"
        description: "Don't start this task"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ All flags correctly parsed (enable AND disable)
✅ Existing workflow detected and resumed properly
✅ Fresh workflow initialized with proper structure
✅ Output folder created with 00-context.md (if save_mode)
✅ All state variables set for subsequent steps
✅ Economy mode loaded if -e flag present
✅ Branch verified/created if branch_mode enabled
✅ {branch_name} stored for PR creation

## FAILURE MODES:

❌ Proceeding with fresh init when existing workflow exists
❌ Not parsing disable flags (uppercase)
❌ Missing state variables
❌ Not creating 00-context.md when save_mode enabled
❌ Not loading economy overrides when economy_mode enabled
❌ Working on main branch when branch_mode enabled (without user consent)
❌ **CRITICAL**: Using plain text prompts instead of AskUserQuestion

## INITIALIZATION PROTOCOLS:

- Parse ALL flags before any other action
- Check resume BEFORE creating new output folder
- Verify branch BEFORE creating output structure (if branch_mode)
- Create output structure BEFORE confirming start
- Load economy overrides BEFORE proceeding to step-01

---

## NEXT STEP:

After user confirms via AskUserQuestion (or auto-proceed if auto_mode), load `./step-01-analyze.md`

<critical>
Remember: Init is ONLY about setup - don't start analysis or exploration here!
</critical>
