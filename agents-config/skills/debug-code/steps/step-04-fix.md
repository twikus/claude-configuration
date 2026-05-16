---
name: step-04-fix
description: Implement the chosen solution
prev_step: steps/step-03-propose.md
next_step: steps/step-05-verify.md
---

# Step 4: Fix the Problem

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER deviate from selected solution without asking
- ✅ ALWAYS implement exactly what was agreed
- 📋 YOU ARE AN IMPLEMENTER, following the plan
- 💬 FOCUS on precise implementation only
- 🚫 FORBIDDEN to add unrequested improvements

## EXECUTION PROTOCOLS:

- 🎯 Read each file before modifying it
- 💾 Track all changes in `{files_modified}`
- 📖 Complete all changes before verifying
- 🚫 FORBIDDEN to load step-05 until implementation complete

## CONTEXT BOUNDARIES:

- Variables from previous steps: `{error_context}`, `{auto_mode}`, `{error_analysis}`, `{debug_logs}`, `{solutions}`, `{selected_solution}`
- Only modify files listed in `{selected_solution.files_to_modify}`
- Don't add features or refactors not in the plan
- If `{debug_logs}` exists, those logs MUST be removed in this step

## YOUR TASK:

Implement the selected solution precisely as planned, modifying only the necessary files.

---

## Available State

From previous steps:

| Variable | Description |
|----------|-------------|
| `{error_context}` | Original error description |
| `{auto_mode}` | Skip confirmations flag |
| `{error_analysis}` | Analysis with root cause |
| `{selected_solution}` | Chosen solution with approach and files |

---

## EXECUTION SEQUENCE:

### 1. Review Implementation Plan

**From `{selected_solution}`:**
- **Solution:** {name}
- **Approach:** {approach}
- **Files to modify:** {files_to_modify}

### 2. Add Strategic Debug Logging (If Needed)

<critical>
Only add logging if the fix involves complex logic or you need to verify intermediate values.
Remove debug logs before finalizing!
</critical>

**When to add temporary logs:**
- Complex conditional logic
- Data transformation steps
- Async operations (to verify execution order)
- Loops with potential edge cases

**Strategic logging pattern:**
```javascript
console.log('[DEBUG] functionName:', { input, state, output });
console.log('[DEBUG] processData: start', { data });
// ... logic
console.log('[DEBUG] processData: end', { result });
```

**Track debug logs added:**

| File | Line | Purpose |
|------|------|---------|
| {path} | {number} | *What you're checking* |

### 3. Implement Changes

**For each file in `{selected_solution.files_to_modify}`:**

1. **Read the file first** (mandatory)
2. **Identify exact changes needed**
3. **Apply changes using Edit tool**
4. **Track modification:**

| File | Changes Made |
|------|--------------|
| {path} | *What was changed* |

### 4. Handle Unexpected Issues

**If implementation reveals additional required changes:**
→ Make minimal additional changes needed
→ Document in `{files_modified}`

### 5. Remove Debug Logs

<critical>
Remove ALL debug logs - both from this step AND from step-01b (Log Technique)!
</critical>

**Before finalizing, remove any temporary debug logs:**

**A. Remove logs from `{debug_logs}` (if Log Technique was used):**

| File | Line | Prefix |
|------|------|--------|
| *From {debug_logs} state variable* | | |

**B. Remove logs added during implementation:**
- Check tracked debug logs for logs to remove
- Search for `[DEBUG` markers in modified files
- Verify no console.log/print statements remain (unless intentional)

**Verification command:**
```bash
grep -r "\[DEBUG" src/
```

### 6. Complete Implementation

**Update files_modified state:**

| File | Changes |
|------|---------|
| {path1} | {description} |
| {path2} | {description} |

→ Proceed directly to step-05 (no confirmation needed)

---

## SUCCESS METRICS:

✅ All planned files modified
✅ Changes align with selected solution
✅ No unrequested modifications added
✅ `{files_modified}` accurately tracks all changes
✅ ALL debug logs removed (including from Log Technique)
✅ Ready for verification

## FAILURE MODES:

❌ Modifying files not in the plan without asking
❌ Adding "improvements" beyond the fix
❌ Not reading files before editing
❌ Leaving debug logs in the codebase
❌ **CRITICAL**: Proceeding without complete implementation

## IMPLEMENTATION PROTOCOLS:

- Read before writing - always
- Make minimal, precise changes
- Follow existing code patterns
- Don't change formatting or style unless necessary
- Keep the fix focused

---

## NEXT STEP:

After implementation confirmed, load `./step-05-verify.md`

<critical>
Remember: Implement ONLY what was agreed - no scope creep!
</critical>
