---
name: step-04-validate
description: Self-check - run tests, verify AC, audit implementation quality
prev_step: steps/step-03-execute.md
next_step_yes: steps/step-05-review.md
next_step_no: COMPLETE
---

# Step 4: Validate (Self-Check)

**Goal:** Audit completed work against tasks, tests, and acceptance criteria before optional review.

---

<available_state>
From previous steps:

- `{task_description}` - What was implemented
- `{acceptance_criteria}` - Success criteria
- `{auto_mode}` - If true, skip confirmations
- `{auto_review}` - If true, auto-proceed to review without asking
- Implementation plan and execution results
- All completed todos from execution
</available_state>

---

<execution_sequence>

<discover>
**1. Discover Available Commands**

**CRITICAL:** Check `package.json` for exact command names.

```bash
cat package.json | grep -A 20 '"scripts"'
```

Look for:
- `build`, `dev`
- `lint`, `eslint`
- `typecheck`, `type-check`, `tsc`
- `test`, `jest`, `vitest`
- `format`, `prettier`
</discover>

<run_validation>
**2. Run Validation Suite**

Execute checks in order:

**2.1 Typecheck**
```bash
pnpm run typecheck  # or npm run typecheck, or tsc --noEmit
```
**MUST PASS.** Fix any type errors before proceeding.

**2.2 Lint**
```bash
pnpm run lint  # or npm run lint
```
**MUST PASS.** Fix lint errors before proceeding.

**2.3 Tests**
```bash
pnpm run test -- --filter=<affected-area>  # or run specific test file
```
**MUST PASS.** Only run tests related to changes.
</run_validation>

<self_audit>
**3. Self-Audit Checklist**

Verify each item:

**Tasks Complete:**
- [ ] All tasks from plan marked complete
- [ ] No tasks skipped without documented reason
- [ ] Any blocked tasks have clear explanation

**Tests Passing:**
- [ ] All existing tests still pass
- [ ] New tests written for new functionality
- [ ] No test warnings or skipped tests without reason

**Acceptance Criteria Satisfied:**
- [ ] Each AC is demonstrably met
- [ ] Can explain how implementation satisfies AC
- [ ] Edge cases considered

**Patterns Followed:**
- [ ] Code follows existing patterns in codebase
- [ ] Error handling consistent with codebase
- [ ] Naming conventions match existing code
- [ ] No obvious code smells introduced
</self_audit>

<format>
**4. Format Code**

If format/prettier command available:
```bash
pnpm run format  # or npm run format
```
</format>

<final_verify>
**5. Final Verification**

Re-run checks after any fixes:
```bash
pnpm run typecheck && pnpm run lint
```
Both must pass before proceeding.
</final_verify>

<present_results>
**6. Present Validation Results**

```
**Validation Complete**

**Typecheck:** ✓ Passed
**Lint:** ✓ Passed
**Tests:** ✓ 12/12 passing (3 new tests added)
**Format:** ✓ Applied

**Tasks:** 6/6 complete
**Acceptance Criteria:** 3/3 satisfied

**Files Modified:**
- `src/auth/middleware.ts` - Added validateToken
- `src/api/routes.ts` - Integrated validation
- `src/auth/middleware.test.ts` - New tests

**Summary:** All checks passing, ready for review.
```
</present_results>

</execution_sequence>

---

<handling_failures>
**Typecheck Fails:**
1. Read error messages carefully
2. Fix type issues in affected files
3. Re-run typecheck
4. Repeat until passing

**Lint Fails:**
1. Apply auto-fixes if available: `pnpm run lint --fix`
2. Manually fix remaining issues
3. Re-run lint
4. Repeat until passing

**Tests Fail:**
1. Identify failing test
2. Debug - is it code bug or test bug?
3. Fix the root cause
4. Re-run test
5. Repeat until passing

**NEVER** mark validation complete with failing checks.
</handling_failures>

---

<review_decision>
**7. Review Decision**

**If `{auto_review}` = true:**
→ Skip question, auto-proceed to adversarial review immediately.

**If `{auto_review}` = false:**
```
**All validation checks passed!**

Do you want an adversarial code review of the changes?

**[y] Yes** - Deep review for security, logic, and quality issues
**[n] No** - Skip review and finalize

The review will analyze all changes for:
- Security vulnerabilities
- Logic errors
- Code quality issues
- Pattern violations
```
</review_decision>

---

<success_metrics>

- Typecheck passing
- Lint passing
- Tests passing
- All AC satisfied
- Code formatted
- User informed of status
</success_metrics>

<failure_modes>

- Claiming checks pass when they don't
- Not running all validation commands
- Skipping tests for modified code
- Missing AC verification
- Proceeding with failures
</failure_modes>

---

<next_step_directive>
**CRITICAL:** Based on flags or user response:

**If `{auto_review}` = true OR user says YES:**
"**NEXT:** Loading `step-05-review.md`"
Then load `steps/step-05-review.md`.

**If user says NO (skip review):**
Present completion summary:

```
**APEX Workflow Complete**

**Task:** {task_description}
**Files modified:** {list}
**Tests:** All passing

**Next steps:**
- Commit changes
- Run full test suite if desired
- Deploy when ready
```
</next_step_directive>
