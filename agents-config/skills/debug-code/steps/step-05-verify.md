---
name: step-05-verify
description: Multi-layer verification to prove the fix works
prev_step: steps/step-04-fix.md
next_step: null
---

# Step 5: Verify the Fix (Multi-Layer)

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER declare success without RUNTIME verification
- ✅ ALWAYS run multiple verification layers, not just tests
- 📋 YOU ARE A SKEPTIC - assume the fix is broken until proven otherwise
- 💬 FOCUS on PROVING the fix works, not hoping it works
- 🚫 FORBIDDEN to trust green tests alone (20-40% still fail in production)

## EXECUTION PROTOCOLS:

- 🎯 Execute ALL verification layers in order
- 💾 Document results from EACH layer in `{verification_result}`
- 📖 If ANY layer fails, stop and address before continuing
- 🚫 FORBIDDEN to skip runtime verification (Layer 3)

## CONTEXT BOUNDARIES:

- Variables from previous steps: all accumulated state
- Use `{error_analysis.verification_method}` from step 1
- Focus on the ORIGINAL error, not new features

## YOUR TASK:

Prove the fix works through multi-layer verification: static checks → automated tests → runtime execution → user confirmation.

---

## Available State

From previous steps:

| Variable | Description |
|----------|-------------|
| `{error_context}` | Original error description |
| `{auto_mode}` | Skip confirmations flag |
| `{error_analysis}` | Analysis with root cause and verification method |
| `{selected_solution}` | Solution that was implemented |
| `{files_modified}` | Files that were changed |

---

## VERIFICATION PYRAMID

```
┌─────────────────────────────────────────────────────────────┐
│                    VERIFICATION PYRAMID                     │
│                                                             │
│                    ┌───────────┐                            │
│     Layer 4:       │  Manual   │  ← User confirms behavior  │
│                    │  Review   │     (if not auto_mode)     │
│                    └─────┬─────┘                            │
│               ┌──────────┴──────────┐                       │
│     Layer 3:  │   Runtime Execution  │ ← CRITICAL: Real     │
│               │   (Actual behavior)  │   execution, not     │
│               └──────────┬──────────┘   just tests          │
│          ┌───────────────┴───────────────┐                  │
│  Layer 2:│      Automated Checks          │ ← Tests, Lint   │
│          │  (Build, Types, Lint, Tests)   │                 │
│          └───────────────┬───────────────┘                  │
│     ┌────────────────────┴────────────────────┐             │
│  L1:│           Static Analysis               │ ← Immediate │
│     │  (Syntax, Imports, Basic validation)    │   feedback  │
│     └─────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

<critical>
Tests pass but real execution fails ~20-40% of the time. NEVER skip Layer 3 (Runtime).
</critical>

---

## EXECUTION SEQUENCE:

### Layer 1: Static Analysis (Immediate Feedback)

**Run these checks first:**

```bash
# Check for syntax errors (immediate)
node --check {file}           # Node.js
python -m py_compile {file}   # Python
```

**Verify:**
- [ ] No syntax errors in modified files
- [ ] Imports resolve correctly
- [ ] No obvious typos in changed code

**If Layer 1 fails:** Fix immediately before proceeding.

---

### Layer 2: Automated Checks (Build/Types/Lint/Tests)

**Run in order of speed (fast → slow):**

| Check | Command | What It Catches | Reliability |
|-------|---------|-----------------|-------------|
| **Build** | `npm run build` | Compilation, bundling | 95% |
| **Types** | `tsc --noEmit` / `npx tsc` | Type errors, null safety | 90% |
| **Lint** | `npm run lint` | Code patterns, potential bugs | 80% |
| **Tests** | `npm test -- --testPathPattern={pattern}` | Regression in tested paths | 70%* |

*Tests only catch what they test for - same blind spots apply

**Execute:**
```bash
npm run build
npm run typecheck  # or: npx tsc --noEmit
npm run lint
npm test -- --testPathPattern="{related-test-file}"
```

**Document Layer 2 results:**

| Check | Result |
|-------|--------|
| Build | ✅ Passed / ❌ Failed |
| Types | ✅ Passed / ❌ Failed / ⏭️ Skipped |
| Lint | ✅ Passed / ❌ Failed / ⏭️ Skipped |
| Tests | ✅ Passed / ❌ Failed / ⏭️ Skipped |

*If failed, include relevant output*

**If Layer 2 fails:** Fix the issue, return to Layer 1.

---

### Layer 3: Runtime Execution (CRITICAL - DO NOT SKIP)

<critical>
This is the most important layer. Tests can pass while real execution fails.
</critical>

**Based on error type, execute the ACTUAL code:**

| Error Type | Runtime Verification | Tool/Method |
|------------|---------------------|-------------|
| **Frontend UI** | Open in browser, interact | Chrome DevTools Console |
| **API endpoint** | Call the endpoint | `curl`, Postman, or browser |
| **CLI command** | Run the command | Terminal |
| **Build error** | Run full build, check output | Terminal |
| **Server error** | Start server, trigger the path | Browser/curl |
| **Test failure** | Run the SPECIFIC test | Test runner |

**Frontend Verification:**
```bash
npm run dev
# Open in Chrome, check DevTools Console for:
# - No new errors
# - Network requests succeed
# - UI behaves correctly
```

**Backend/API Verification:**
```bash
curl -X GET http://localhost:3000/api/{endpoint}
# Or for POST:
curl -X POST http://localhost:3000/api/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

**CLI Verification:**
```bash
{the-original-failing-command}
# Verify output matches expected behavior
```

**Document Layer 3 results:**

| Field | Value |
|-------|-------|
| Method | *What was executed* |
| Original error still occurs? | No (should be fixed!) |
| New errors? | None / *list if any* |
| Actual behavior | *What happened* |
| Expected behavior | *What should happen* |
| **Passed?** | ✅ Yes / ❌ No |

**If Layer 3 fails:** The fix doesn't work. Return to step-03 or step-04.

---

### Layer 4: Regression & User Confirmation

**Check for regressions:**
```bash
npm test
# Or run full CI check
npm run ci  # if available
```

**Document:**

| Field | Value |
|-------|-------|
| Regression check | *What was run* |
| Regressions found? | Yes / No |
| Details | *If any* |

**If all layers passed:**
→ Report success, workflow complete

**If any layer fails:**
→ Report failure with details
→ Automatically attempt to fix the issue and re-verify
→ If unable to fix, present the failure clearly and end workflow

---

## SUCCESS METRICS:

✅ Layer 1 (Static): No syntax errors
✅ Layer 2 (Automated): Build + Types + Lint pass
✅ Layer 3 (Runtime): ACTUAL execution works - error no longer occurs
✅ Layer 4 (Regression): No new issues introduced
✅ All results documented in `{verification_result}`

## FAILURE MODES:

❌ Skipping Layer 3 (Runtime) - "tests pass" is not enough
❌ Declaring success after only Layer 2
❌ Not testing the ORIGINAL error scenario
❌ Ignoring new errors introduced by the fix
❌ **CRITICAL**: Trusting green tests without runtime verification

## VERIFICATION PROTOCOLS:

- Run ALL layers, not just the convenient ones
- Layer 3 (Runtime) is MANDATORY - never skip
- Document failures clearly for debugging
- Be honest about partial fixes
- Tests passing ≠ fix working (20-40% false confidence rate)

---

## WORKFLOW COMPLETE:

**If ALL layers passed:**

## ✅ Fix Verified Successfully

| Field | Value |
|-------|-------|
| **Error** | {original error} |
| **Solution** | {selected_solution.name} |
| **Files Modified** | {count} |

**Verification Results:**

| Layer | Check | Result |
|-------|-------|--------|
| 1 | Static Analysis | ✅ Passed |
| 2 | Build | ✅ Passed |
| 2 | Types | ✅ Passed |
| 2 | Lint | ✅ Passed |
| 2 | Tests | ✅ Passed |
| 3 | Runtime Execution | ✅ Passed |
| 4 | Regression Check | ✅ No regressions |

The fix has been verified across all layers.

**If FAILED:** Offer paths forward (retry, revert, accept partial)

<critical>
Remember: Green tests mean nothing without runtime verification.
NEVER claim success without executing the actual code path that was failing.
</critical>
