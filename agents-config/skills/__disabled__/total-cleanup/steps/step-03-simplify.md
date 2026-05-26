---
name: step-03-simplify
description: Code simplification using code-simplifier agent
prev_step: steps/step-02-clean-code.md
next_step: null
---

# Step 3: Code Simplification

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER change code functionality
- ✅ ALWAYS use the code-simplifier agent
- 📋 YOU ARE A simplification coordinator, not the simplifier itself
- 💬 FOCUS on clarity and maintainability only
- 🚫 FORBIDDEN to introduce new features or behavior changes

## EXECUTION PROTOCOLS:

- 🎯 Launch code-simplifier agent for each target file
- 💾 Save simplification report (if save_mode)
- 📖 Verify functionality preserved after changes
- 🚫 FORBIDDEN to proceed if behavior changes detected

## CONTEXT BOUNDARIES:

- Variables available: `{target_files}`, `{auto_mode}`, `{save_mode}`, `{output_dir}`, `{security_findings}`, `{clean_code_issues}`
- Previous context: Security fixed (step-01), clean code applied (step-02)
- Focus on: reducing complexity, improving naming, consolidating logic
- code-simplifier agent loaded on-demand

## YOUR TASK:

Simplify all target files using the code-simplifier agent to enhance clarity and maintainability without changing functionality.

---

## EXECUTION SEQUENCE:

### 1. Launch Code Simplifier Agent

Use the Task tool to launch the `code-simplifier` agent for each file:

**Agent configuration:**
```yaml
subagent_type: code-simplifier
prompt: |
  Simplify the following files while preserving exact functionality:

  Files to simplify:
  - {file1}
  - {file2}
  ...

  Focus on:
  1. Reducing unnecessary complexity and nesting
  2. Eliminating redundant code
  3. Improving variable and function names
  4. Consolidating related logic
  5. Removing unnecessary comments
  6. Avoiding nested ternary operators
  7. Choosing clarity over brevity

  IMPORTANT: Do NOT change what the code does - only how it does it.
```

### 2. Monitor Simplification

The code-simplifier agent will:
- Read each file
- Identify simplification opportunities
- Apply changes that preserve functionality
- Focus on recently modified code

**Wait for completion before proceeding.**

### 3. Collect Simplification Changes

Document what was simplified:
```yaml
simplifications:
  - file: "src/api/users.ts"
    changes:
      - "Extracted complex condition to named variable"
      - "Replaced nested ternary with switch statement"
      - "Consolidated duplicate validation logic"
  - file: "src/features/auth.tsx"
    changes:
      - "Simplified useEffect dependencies"
      - "Renamed ambiguous variable 'x' to 'userCount'"
```

### 4. Display Summary

Present summary to user:

```markdown
## Code Simplification Complete

**Files simplified:** {count}
**Changes applied:** {count}

### Simplifications by File

#### {file1}
- {change1}
- {change2}

#### {file2}
- {change1}
- {change2}

### Verification
✓ All tests pass
✓ Build successful
✓ Functionality preserved
```

### 5. Save Report (if save_mode)

**If `{save_mode}` = true:**
→ Write to `{output_dir}/03-simplify.md`

### 6. Final Summary

Display complete workflow summary:

```markdown
## Total Cleanup Complete ✓

### Summary by Step

| Step | Issues Found | Fixed |
|------|--------------|-------|
| 1. Security | {security_count} | ✓ |
| 2. Clean Code | {clean_code_count} | ✓ |
| 3. Simplification | {simplify_count} | ✓ |

### Files Processed
{target_files list}

### Reports Saved (if save_mode)
- `{output_dir}/01-security.md`
- `{output_dir}/02-clean-code.md`
- `{output_dir}/03-simplify.md`
```

### 7. Confirm Completion

**If `{auto_mode}` = false:**
Use AskUserQuestion:
```yaml
questions:
  - header: "Done"
    question: "Total cleanup complete. What would you like to do?"
    options:
      - label: "Finish"
        description: "Complete the cleanup process"
      - label: "Review all changes"
        description: "Show me a diff of all changes"
      - label: "Run again"
        description: "Re-run cleanup on the same files"
    multiSelect: false
```

---

## SUCCESS METRICS:

✅ Code-simplifier agent launched for all files
✅ Simplifications applied without changing functionality
✅ Code is more readable and maintainable
✅ All tests still pass
✅ Build still passes
✅ Report saved (if save_mode)
✅ Final summary displayed

## FAILURE MODES:

❌ Not using code-simplifier agent
❌ Changing code behavior during simplification
❌ Over-simplifying (making code less readable)
❌ **CRITICAL**: Breaking tests or build
❌ **CRITICAL**: Not preserving exact functionality

## SIMPLIFICATION PROTOCOLS:

- Clarity over brevity - explicit code is better than clever code
- No nested ternaries - use switch or if/else
- Preserve all functionality - test before and after
- Don't remove helpful abstractions
- Don't combine unrelated logic

---

## COMPLETION:

This is the final step. After completion:
1. Display the final summary
2. Save all reports (if save_mode)
3. Offer to show diff or re-run

<critical>
Remember: Simplification must NEVER change functionality - only improve readability!
</critical>
