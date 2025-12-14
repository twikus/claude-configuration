---
description: Deep error analysis and systematic bug resolution with comprehensive reasoning
argument-hint: <error-message-or-description>
---

<objective>
Perform deep analysis of the error "#$ARGUMENTS" to identify root cause, evaluate multiple solutions, implement the most effective fix, and verify the resolution.

This systematic debugging approach ensures errors are resolved comprehensively with maximum reasoning effort and minimal risk of introducing regressions.
</objective>

<context>
Current project state: !`git status`
Recent changes: !`git log --oneline -5`
Package info: @package.json
Error context: #$ARGUMENTS
</context>

<process>
**Phase 1: Deep Error Analysis (Reasoning-Heavy)**
1. Parse and categorize the error (syntax, runtime, type, logic, dependency, etc.)
2. Extract key information: error type, stack trace, affected files, line numbers
3. Identify the immediate failure point vs root cause
4. Search codebase for related code patterns that might contribute
5. Check recent changes that could have introduced the issue

**Phase 2: Root Cause Investigation**

1. Trace execution flow backwards from error point
2. Examine all files mentioned in stack trace or error message
3. Search for similar patterns across codebase
4. Check dependencies, configurations, and environment factors
5. Identify ALL potential causes (not just the first one found)

**Phase 3: Solution Evaluation (Multiple Options)**

1. Generate 3-5 potential solutions with different approaches
2. For each solution, evaluate:
   - Pros: What it fixes, how thoroughly
   - Cons: Risks, complexity, side effects
   - Effort: Implementation difficulty
   - Impact: Scope of changes required
3. Rank solutions by effectiveness, safety, and maintainability
4. Select the optimal solution with clear reasoning

**Phase 4: Implementation**

1. Implement the selected solution carefully
2. Follow existing code patterns and conventions
3. Add defensive checks if needed to prevent recurrence
4. Ensure changes are minimal and focused
5. Document any non-obvious fixes with brief comments

**Phase 5: Verification & Validation (MANDATORY)**

1. Check if original error is resolved
2. **CRITICAL**: Run `pnpm ts` - TypeScript MUST pass with 0 errors
3. **CRITICAL**: Run `pnpm lint` - Linting MUST pass with 0 errors
4. Fix any TypeScript/lint errors introduced by the fix
5. Run relevant test suites if available
6. Test related functionality to catch regressions
7. Re-run validation commands until all pass
8. Provide testing instructions to user if manual verification needed

**⚠️ THE FIX IS INCOMPLETE UNTIL `pnpm ts` AND `pnpm lint` BOTH PASS ⚠️**
</process>

<reasoning_guidelines>

- Use SequentialThinking for complex error analysis
- Consider edge cases and hidden dependencies
- Question assumptions about what "should" work
- Look beyond the immediate error to systemic issues
- Think about why the error wasn't caught earlier
- Consider how to prevent similar errors in future
  </reasoning_guidelines>

<success_criteria>

- Root cause clearly identified and explained
- Multiple solution approaches evaluated
- Optimal solution implemented with reasoning provided
- **MANDATORY**: `pnpm ts` passes with 0 TypeScript errors
- **MANDATORY**: `pnpm lint` passes with 0 linting errors
- All validation commands executed and passing
- Fix verified through testing or clear test instructions given
- No regressions introduced
- User understands what was fixed and why

**❌ The debugging session FAILS if TypeScript or linting validation fails ❌**
</success_criteria>

<validation>
**CRITICAL: The fix is NOT complete until ALL validation passes.**

After implementing ANY fix, ALWAYS run in this order:

1. **TypeScript validation**: `pnpm ts` - Must pass with 0 errors
2. **Linting validation**: `pnpm lint` - Must pass with 0 errors
3. **Tests**: `pnpm test` or relevant test command if available

If TypeScript or lint errors appear:

- These are NOT optional - they MUST be fixedtlets && pnpm lint both pass.\*\*
  </validation>

<verification>
After implementing the fix:
1. Verify the specific error no longer occurs
2. **MANDATORY**: Run `pnpm ts` - fix all TypeScript errors
3. **MANDATORY**: Run `pnpm lint` - fix all linting errors
4. Run existing tests if available
5. Check for new errors introduced by the fix
6. Confirm related functionality still works
7. If manual testing required, provide step-by-step instructions
</verification>

<output>
For each debugging session, provide:
1. **Error Analysis**: What the error means and immediate cause
2. **Root Cause**: Underlying issue that led to the error
3. **Solutions Considered**: Brief summary of 3-5 approaches evaluated
4. **Selected Solution**: Which approach chosen and why
5. **Implementation**: Files modified with brief explanation
6. **TypeScript Validation**: Result of `pnpm ts` (MUST be ✅ passing)
7. **Linting Validation**: Result of `pnpm lint` (MUST be ✅ passing)
8. **Testing**: Results or instructions for verification
</output>
