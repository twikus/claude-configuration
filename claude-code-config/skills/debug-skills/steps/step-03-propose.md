---
name: step-03-propose
description: Present solutions to user for selection
prev_step: steps/step-02-find-solutions.md
next_step: steps/step-04-fix.md
---

# Step 3: Propose Solutions

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER implement before user selects (unless auto_mode)
- ✅ ALWAYS present all solutions clearly before asking
- 📋 YOU ARE A PRESENTER, not a decider
- 💬 FOCUS on helping user choose only
- 🚫 FORBIDDEN to modify files in this step

## EXECUTION PROTOCOLS:

- 🎯 Present each solution with full details before asking
- 💾 Store selected solution in `{selected_solution}`
- 📖 Get clear user confirmation before proceeding
- 🚫 FORBIDDEN to load step-04 until solution selected

## CONTEXT BOUNDARIES:

- Variables from previous steps: `{error_context}`, `{auto_mode}`, `{error_analysis}`, `{solutions}`
- Present solutions objectively
- Let user make the final decision (unless auto_mode)

## YOUR TASK:

Present all identified solutions to the user and let them choose which one to implement.

---

<available_state>
From previous steps:

| Variable | Description |
|----------|-------------|
| `{error_context}` | Original error description |
| `{auto_mode}` | Skip confirmations flag |
| `{error_analysis}` | Analysis with root cause |
| `{solutions}` | List of solutions with pros/cons |
</available_state>

---

## EXECUTION SEQUENCE:

### 1. Present Error Summary

**Brief recap:**
```
Error: {error_type}
Root Cause: {root_cause}
Affected Files: {count} files
```

### 2. Present Each Solution

**For each solution in `{solutions}`:**

```markdown
### Solution {N}: {name}

**Approach:** {approach}

**Files to modify:**
- {file1}
- {file2}

**Pros:**
- {pro1}
- {pro2}

**Cons:**
- {con1}

**Effort:** {low|medium|high} | **Risk:** {low|medium|high}
```

### 3. Get User Selection

**If `{auto_mode}` = true:**
→ Select the solution marked `recommended: true`
→ Set `{selected_solution}` = recommended solution
→ Proceed to step-04 automatically

**If `{auto_mode}` = false:**
Use AskUserQuestion with solutions as options:
```yaml
questions:
  - header: "Solution"
    question: "Which solution should we implement?"
    options:
      - label: "Solution 1: {name} (Recommended)"
        description: "{approach} - Effort: {effort}, Risk: {risk}"
      - label: "Solution 2: {name}"
        description: "{approach} - Effort: {effort}, Risk: {risk}"
      - label: "Solution 3: {name}"
        description: "{approach} - Effort: {effort}, Risk: {risk}"
    multiSelect: false
```

### 4. Confirm Selection

**Store selection:**
```yaml
selected_solution:
  id: {selected_id}
  name: "{name}"
  approach: "{approach}"
  files_to_modify: [...]
```

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Confirm"
    question: "Ready to implement {selected_solution.name}?"
    options:
      - label: "Yes, implement it (Recommended)"
        description: "Proceed with the fix"
      - label: "Show implementation plan first"
        description: "I want to see exactly what will change"
      - label: "Choose different solution"
        description: "Go back and pick another option"
    multiSelect: false
```

**Handle responses:**
- **"Yes, implement":** Load step-04
- **"Show plan":** Detail the changes, then re-confirm
- **"Choose different":** Return to solution selection

---

## SUCCESS METRICS:

✅ All solutions presented clearly
✅ User selected a solution (or auto-selected recommended)
✅ Selection confirmed before proceeding
✅ `{selected_solution}` state variable populated

## FAILURE MODES:

❌ Not presenting all options
❌ Implementing without explicit selection
❌ Missing confirmation step
❌ **CRITICAL**: Making code changes in this step

## PROPOSAL PROTOCOLS:

- Present solutions objectively without excessive bias
- Explain why one is recommended
- Be honest about trade-offs
- Let user have final say

---

## NEXT STEP:

After solution selected and confirmed, load `./step-04-fix.md`

<critical>
Remember: This step is ONLY about choosing - don't implement yet!
</critical>
