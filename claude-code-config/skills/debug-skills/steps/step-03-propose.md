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

## Available State

From previous steps:

| Variable | Description |
|----------|-------------|
| `{error_context}` | Original error description |
| `{auto_mode}` | Skip confirmations flag |
| `{error_analysis}` | Analysis with root cause |
| `{solutions}` | List of solutions with pros/cons |

---

## EXECUTION SEQUENCE:

### 1. Present Error Summary

**Brief recap:**

> **Error:** {error_type}
> **Root Cause:** {root_cause}
> **Affected Files:** {count} files

### 2. Present Each Solution

**For each solution in `{solutions}`:**

---

### Solution {N}: {name}

**Approach:** {approach}

**Files to modify:**
- {file1}
- {file2}

| Pros | Cons |
|------|------|
| {pro1} | {con1} |
| {pro2} | |

**Effort:** {low|medium|high} · **Risk:** {low|medium|high}

---

### 3. Get User Selection

**If `{auto_mode}` = true:**
→ Select the solution marked as recommended
→ Set `{selected_solution}` = recommended solution
→ Proceed to step-04 automatically

**If `{auto_mode}` = false:**

Use **AskUserQuestion** with:
- **Header:** "Solution"
- **Question:** "Which solution should we implement?"
- **Options:**
  1. "Solution 1: {name} (Recommended)" → {approach} - Effort: {effort}, Risk: {risk}
  2. "Solution 2: {name}" → {approach} - Effort: {effort}, Risk: {risk}
  3. "Solution 3: {name}" → {approach} - Effort: {effort}, Risk: {risk}

### 4. Store Selection and Proceed

**Store selection:**

| Field | Value |
|-------|-------|
| ID | {selected_id} |
| Name | {name} |
| Approach | {approach} |
| Files to modify | {list} |

→ Proceed directly to step-04 (no confirmation needed after selection)

---

## SUCCESS METRICS:

✅ All solutions presented clearly
✅ User selected a solution (or auto-selected recommended)
✅ `{selected_solution}` state variable populated

## FAILURE MODES:

❌ Not presenting all options
❌ Implementing without explicit selection
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
