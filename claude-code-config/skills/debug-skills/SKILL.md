---
name: debug
description: Systematic error debugging with analysis, solution discovery, and verification
argument-hint: "[error description or context] [-a for auto mode]"
---

<objective>
Debug errors systematically through a 5-step workflow: analyze the error, find potential solutions, propose options to the user, implement the fix, and verify it works through multi-layer verification.
</objective>

<methodology>
## Core Principles (Battle-Tested)

1. **Reproduce Before Anything Else** - If you can't reproduce it, you can't verify the fix
2. **Hypothesis-Driven Analysis** - List 3-5 causes ranked by likelihood, test systematically
3. **Multi-Layer Verification** - Tests alone give false confidence (20-40% still fail in production)

## Verification Pyramid

```
        ┌─────────────┐
        │   Manual    │  ← User confirms
        └──────┬──────┘
     ┌─────────┴─────────┐
     │ Runtime Execution │  ← CRITICAL: Real execution
     └─────────┬─────────┘
   ┌───────────┴───────────┐
   │   Automated Checks    │  ← Build, Types, Lint, Tests
   └───────────┬───────────┘
 ┌─────────────┴─────────────┐
 │     Static Analysis       │  ← Syntax, Imports
 └───────────────────────────┘
```

**Key Insight**: Tests passing ≠ fix working. ALWAYS execute the actual code path.
</methodology>

<parameters>
**Flags:**

| Flag | Name | Description |
|------|------|-------------|
| `-a`, `--auto` | Auto mode | Full automatic mode - don't ask the user, use recommended solutions |

**Arguments:**
- Everything after flags = `{error_context}` - Description of the error or context about what's failing
</parameters>

<state_variables>
**Persist throughout all steps:**

| Variable | Type | Description |
|----------|------|-------------|
| `{error_context}` | string | User's description of the error |
| `{auto_mode}` | boolean | Skip confirmations, use recommended options |
| `{error_analysis}` | object | Detailed analysis from step 1 |
| `{solutions}` | list | Potential solutions found in step 2 |
| `{selected_solution}` | object | User's chosen solution from step 3 |
| `{files_modified}` | list | Files changed during the fix |
| `{verification_result}` | object | Results from verification step |
</state_variables>

<entry_point>
Load `steps/step-00-init.md`
</entry_point>

<step_files>
| Step | File | Description |
|------|------|-------------|
| 0 | `step-00-init.md` | Parse flags, setup state |
| 1 | `step-01-analyze.md` | Reproduce error, form hypotheses, identify root cause |
| 2 | `step-02-find-solutions.md` | Research 2-3+ solutions with pros/cons |
| 3 | `step-03-propose.md` | Present solutions for user selection |
| 4 | `step-04-fix.md` | Implement with strategic logging |
| 5 | `step-05-verify.md` | Multi-layer verification (Static → Build → Runtime → User) |
</step_files>
