# Step Template

Use this template as the base for any workflow step. Based on BMAD micro-file architecture.

---

## Complete Step Template

```markdown
---
name: step-NN-{name}
description: {What this step does}
prev_step: steps/step-{NN-1}-{prev-name}.md
next_step: steps/step-{NN+1}-{next-name}.md
---

# Step {N}: {Title}

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER {critical forbidden action}
- ✅ ALWAYS {critical required action}
- 📋 YOU ARE A {role}, not a {anti-role}
- 💬 FOCUS on {this step's scope} only
- 🚫 FORBIDDEN to {boundary violation}

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 💾 Update document/frontmatter after each phase
- 📖 Complete this step fully before loading next
- 🚫 FORBIDDEN to load next step until {completion criteria}

## CONTEXT BOUNDARIES:

- Variables from previous steps are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from future steps
- {Resource} loaded on-demand when needed

## YOUR TASK:

{One clear sentence describing what this step accomplishes}

---

## EXECUTION SEQUENCE:

### 1. {First Phase Name}

{Instructions for first phase}

**If `{save_mode}` = true:** Append to `{output_dir}/NN-{step-name}.md`

### 2. {Second Phase Name}

{Instructions for second phase}

### 3. {Third Phase Name}

**If `{auto_mode}` = true:**
→ Use recommended option, proceed automatically

**If `{auto_mode}` = false:**
→ Use AskUserQuestion:

```yaml
questions:
  - header: "Confirm"
    question: "Phase 3 complete. Ready to proceed?"
    options:
      - label: "Continue (Recommended)"
        description: "Proceed to next phase"
      - label: "Review first"
        description: "I want to review before continuing"
      - label: "Go back"
        description: "Return to previous step"
    multiSelect: false
```

### 4. Update State

**Update frontmatter:**
```yaml
---
stepsCompleted: [1, 2, ..., N]
{new_variable}: '{value}'
---
```

**Append to document:**
```markdown
## {Section Title}

{Content based on this step's work}
```

---

## SUCCESS METRICS:

✅ {Success criterion 1}
✅ {Success criterion 2}
✅ {Success criterion 3}
✅ Frontmatter properly updated with step state
✅ Output saved (if save_mode)

## FAILURE MODES:

❌ {Failure mode 1}
❌ {Failure mode 2}
❌ {Failure mode 3}
❌ **CRITICAL**: Proceeding without completing this step fully
❌ **CRITICAL**: Not using AskUserQuestion for user input

## {STEP NAME} PROTOCOLS:

- {Protocol 1 specific to this step}
- {Protocol 2 specific to this step}
- {Protocol 3 specific to this step}

---

## NEXT STEP:

After user confirms via AskUserQuestion, load `./step-{NN+1}-{next-name}.md`

<critical>
Remember: {Important reminder about this step's boundaries}
</critical>
```

---

## Init Step Template (step-00-init.md)

```markdown
---
name: step-00-init
description: Initialize workflow - parse flags, detect continuation, setup state
next_step: steps/step-01-{first-step}.md
---

# Step 0: Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip flag parsing
- ✅ ALWAYS check for existing workflow before creating new
- 📋 Parse ALL flags before any other action
- 💬 FOCUS on initialization only - don't look ahead
- 🚫 FORBIDDEN to proceed without proper state setup

## EXECUTION PROTOCOLS:

- 🎯 Parse flags first, then check resume, then setup
- 💾 Create output structure if save_mode
- 📖 Initialize frontmatter with all state variables
- 🚫 FORBIDDEN to load step-01 until init complete

## YOUR TASK:

Initialize the workflow by parsing flags, detecting continuation state, and setting up the execution environment.

---

## DEFAULTS CONFIGURATION:

```yaml
# Edit these to change default behavior
flag_a: false      # -a: Description
flag_b: false      # -b: Description
save_mode: false   # -s: Save outputs
auto_mode: false   # -a: Skip confirmations
```

---

## INITIALIZATION SEQUENCE:

### 1. Parse Flags and Input

**Step 1: Load defaults from config above**

**Step 2: Parse user input and override defaults:**
```
Enable flags (lowercase):
  -a → {flag_a} = true
  -b → {flag_b} = true

Disable flags (UPPERCASE):
  -A → {flag_a} = false
  -B → {flag_b} = false

Remainder → {task_description}
```

### 2. Check for Existing Workflow

**If output document exists with `stepsCompleted` in frontmatter:**
- Read frontmatter to restore state
- Find last completed step
- Load next incomplete step
- **STOP** - do not continue with fresh init

**If no existing workflow:**
→ Continue to step 3

### 3. Create Output Structure (if save_mode)

```bash
mkdir -p {output_dir}
```

Create `00-context.md`:
```markdown
# Task: {task_id}

**Created:** {timestamp}
**Task:** {task_description}

## Configuration
| Flag | Value |
|------|-------|
| flag_a | {value} |
| flag_b | {value} |

## Progress
| Step | Status | Timestamp |
|------|--------|-----------|
| 00-init | ✓ | {timestamp} |
| 01-{name} | ⏸ Pending | |
```

### 4. Confirm Start

**If `{auto_mode}` = true:**
→ Proceed directly to step-01

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Start"
    question: "Workflow initialized. Ready to begin?"
    options:
      - label: "Begin (Recommended)"
        description: "Start the workflow"
      - label: "Modify settings"
        description: "I want to change the configuration"
      - label: "Cancel"
        description: "Don't start this workflow"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ All flags correctly parsed
✅ Existing workflow detected and resumed properly
✅ Fresh workflow initialized with proper structure
✅ Output folder created (if save_mode)
✅ State variables set for subsequent steps

## FAILURE MODES:

❌ Proceeding with fresh init when existing workflow exists
❌ Not parsing all flags before proceeding
❌ Missing state variables in frontmatter
❌ Not creating output structure when save_mode

---

## NEXT STEP:

After initialization, load `./step-01-{first-step}.md`

<critical>
Remember: Init is ONLY about setup - don't start actual work here!
</critical>
```

---

## Conditional Branching Template

```markdown
## NEXT STEP DECISION:

**If `{auto_mode}` = true:**
→ Use first/recommended option automatically

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Path"
    question: "Which path would you like to take?"
    options:
      - label: "Option A (Recommended)"
        description: "Description of path A"
      - label: "Option B"
        description: "Description of path B"
      - label: "Option C"
        description: "Description of path C"
    multiSelect: false
```

**Route based on response:**
- **Option A:** Load `./step-03a-option.md`
- **Option B:** Load `./step-03b-option.md`
- **Option C:** Load `./step-03c-option.md`
```

---

## Key Elements Checklist

Every step file MUST have:

- [ ] Frontmatter with name, description, prev/next step
- [ ] **MANDATORY EXECUTION RULES** section with emojis
- [ ] **EXECUTION PROTOCOLS** section
- [ ] **CONTEXT BOUNDARIES** section
- [ ] **YOUR TASK** - single clear sentence
- [ ] Numbered **EXECUTION SEQUENCE**
- [ ] Auto mode handling (skip AskUserQuestion if auto)
- [ ] Save mode handling (append to output if save)
- [ ] **SUCCESS METRICS** with ✅ checkmarks
- [ ] **FAILURE MODES** with ❌ marks
- [ ] **PROTOCOLS** section specific to step
- [ ] **NEXT STEP** section with clear routing
- [ ] `<critical>` reminder at the end
