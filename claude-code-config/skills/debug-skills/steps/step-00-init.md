---
name: step-00-init
description: Initialize debug workflow - parse flags and setup state
next_step: steps/step-01-analyze.md
---

# Step 0: Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER skip flag parsing
- ✅ ALWAYS parse `-a`/`--auto` flag before proceeding
- 📋 Parse ALL input before any other action
- 💬 FOCUS on initialization only - don't start debugging yet
- 🚫 FORBIDDEN to analyze errors in this step

## EXECUTION PROTOCOLS:

- 🎯 Parse flags first, then extract error context
- 💾 Set all state variables before proceeding
- 📖 Initialize state for subsequent steps
- 🚫 FORBIDDEN to load step-01 until init complete

## YOUR TASK:

Initialize the debug workflow by parsing flags and extracting the error context from user input.

---

## DEFAULTS CONFIGURATION:

```yaml
auto_mode: false   # -a/--auto: Skip confirmations, use recommended solutions
```

---

## INITIALIZATION SEQUENCE:

### 1. Parse Flags and Input

**Step 1: Load defaults from config above**

**Step 2: Parse user input and override defaults:**
```
Enable flags (lowercase):
  -a, --auto → {auto_mode} = true

Remainder → {error_context}
```

### 2. Validate Input

**If `{error_context}` is empty:**
→ Set `{error_context}` = "User will provide error details during analysis"

### 3. Set Initial State

```yaml
error_context: "{parsed from input}"
auto_mode: {parsed from flags}
error_analysis: null
solutions: []
selected_solution: null
files_modified: []
verification_result: null
```

### 4. Confirm Start

**If `{auto_mode}` = true:**
→ Proceed directly to step-01

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Start"
    question: "Debug workflow initialized. Ready to analyze the error?"
    options:
      - label: "Begin analysis (Recommended)"
        description: "Start investigating the error"
      - label: "Add more context"
        description: "I want to provide more details first"
    multiSelect: false
```

**Handle responses:**
- **"Begin analysis":** Load step-01
- **"Add more context":** Wait for user input, update `{error_context}`, then proceed

---

## SUCCESS METRICS:

✅ Flags correctly parsed (-a/--auto detected)
✅ Error context extracted or placeholder set
✅ All state variables initialized
✅ User confirmed or auto_mode enabled

## FAILURE MODES:

❌ Proceeding without parsing flags
❌ Starting to analyze the error in this step
❌ Missing state variables for subsequent steps

---

## NEXT STEP:

After initialization, load `./step-01-analyze.md`

<critical>
Remember: Init is ONLY about setup - don't start debugging here!
</critical>
