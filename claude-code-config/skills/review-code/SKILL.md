---
name: review-code
description: Expert code review guidance covering security (OWASP), clean code (SOLID, naming), code smells, complexity metrics, and high-value feedback patterns. Use when reviewing PRs, conducting code audits, or providing code feedback. Focuses on impactful issues, not nitpicks.
---

<objective>
Provide expert-level code review guidance that focuses on high-impact issues: security vulnerabilities, logic errors, maintainability problems, and architectural concerns. Skip nitpicks and style issues that should be automated.

Based on research from Google, Microsoft, OWASP, and academic studies on code review effectiveness.
</objective>

<quick_start>
<review_priority>
**Priority order**: Security > Correctness > Maintainability > Performance

**High-value feedback** (36-43% implementation rate):
- Bug fixes and logic errors
- Security vulnerabilities
- Readability/maintainability issues
- Missing error handling

**Skip these** (automate instead):
- Formatting/whitespace
- Simple naming conventions
- Linting violations
</review_priority>

<essential_checks>
1. **Security**: Input validation, auth checks, secrets exposure
2. **Logic**: Edge cases, error handling, null checks
3. **Architecture**: Single responsibility, proper abstractions
4. **Tests**: Coverage for new functionality
</essential_checks>
</quick_start>

<review_categories>
<category name="security" priority="critical">
**Must check in every review:**
- No hardcoded credentials (search: `password.*=.*['"]`, `api[_-]?key.*=`)
- Input validation on all user data
- Parameterized queries (no string concatenation for SQL)
- Authorization checks on every endpoint
- No `eval()`, `exec()`, dangerous functions

See: [references/security-checklist.md](references/security-checklist.md)
</category>

<category name="logic" priority="critical">
**Verify correctness:**
- Business logic matches requirements
- Edge cases handled (null, empty, boundary values)
- Error handling present and appropriate
- Race conditions in async code
- Resource cleanup (connections, file handles)
</category>

<category name="clean_code" priority="high">
**Check for code smells:**
- Large functions (>50 lines) - violate Single Responsibility
- Deep nesting (>3 levels) - extract to functions
- Long parameter lists (>3 params) - use objects
- Duplicated code - extract to shared functions
- Magic numbers/strings - use named constants

See: [references/clean-code-principles.md](references/clean-code-principles.md)
</category>

<category name="maintainability" priority="medium">
**Assess long-term health:**
- Cognitive complexity <15 per function
- Clear naming that reveals intent
- Appropriate abstractions (not over-engineered)
- Test coverage for critical paths
</category>
</review_categories>

<feedback_guidelines>
<valuable_feedback>
**Structure**: What + Why + How

✓ "This function is 80 lines with 5 responsibilities. Consider extracting the validation logic (lines 20-45) into `validateUserInput()` for testability."

✓ "SQL query uses string concatenation (line 34). Use parameterized queries to prevent injection: `db.query('SELECT * FROM users WHERE id = ?', [userId])`"

✓ "Missing null check on `user.profile` (line 52). This will throw if user hasn't completed onboarding. Add: `if (!user.profile) return defaultProfile;`"
</valuable_feedback>

<wasteful_feedback>
✗ "This could be cleaner" (vague)
✗ "Rename this variable" (nitpick - use linter)
✗ "Add a comment here" (if code is clear, no comment needed)
✗ "I would do this differently" (subjective without reason)
</wasteful_feedback>

<priority_labels>
Use clear labels to distinguish severity:
- **[BLOCKING]**: Must fix before merge (security, bugs)
- **[SUGGESTION]**: Would improve code but not required
- **[NIT]**: Minor preference (mark clearly or skip entirely)
</priority_labels>

See: [references/feedback-patterns.md](references/feedback-patterns.md)
</feedback_guidelines>

<code_quality_metrics>
<metric name="cognitive_complexity">
- Target: <15 per function, <50 per module
- Each nesting level adds complexity
- Prefer early returns over deep nesting
</metric>

<metric name="function_size">
- Target: <50 lines, ideally <20
- Should fit on one screen
- One function = one responsibility
</metric>

<metric name="cyclomatic_complexity">
- Target: <10 per function
- Count: 1 + (if + while + for + case + catch + && + ||)
- High complexity = hard to test
</metric>

See: [references/code-quality-metrics.md](references/code-quality-metrics.md)
</code_quality_metrics>

<anti_patterns>
<pattern name="nitpicking">
**Problem**: Excessive minor comments bury critical issues
**Impact**: Developers become defensive, stop reading feedback
**Solution**: Automate style with linters; focus humans on logic/security
</pattern>

<pattern name="vague_criticism">
**Problem**: "This is wrong" without explanation
**Impact**: Developer doesn't know how to fix; creates friction
**Solution**: Always include What + Why + How
</pattern>

<pattern name="blocking_on_preferences">
**Problem**: Blocking merge for subjective style preferences
**Impact**: Delays delivery; damages team trust
**Solution**: Reserve blocking for security/correctness only
</pattern>

<pattern name="reviewing_unchanged_code">
**Problem**: Commenting on code outside the PR diff
**Impact**: Scope creep; unfair to author
**Solution**: Focus only on changed lines; file separate issues for existing problems
</pattern>
</anti_patterns>

<success_criteria>
A good code review:
- Identifies security vulnerabilities (if any)
- Catches logic errors and edge cases
- Flags maintainability issues with specific fixes
- Uses priority labels ([BLOCKING] vs [SUGGESTION])
- Provides actionable feedback (What + Why + How)
- Avoids nitpicks on style/formatting
- Completes in reasonable time (<4 hours for small PRs)
</success_criteria>

<reference_guides>
**Security**: [references/security-checklist.md](references/security-checklist.md) - OWASP Top 10, auth, input validation
**Clean Code**: [references/clean-code-principles.md](references/clean-code-principles.md) - SOLID, naming, functions, smells
**Feedback**: [references/feedback-patterns.md](references/feedback-patterns.md) - Valuable vs wasteful patterns
**Metrics**: [references/code-quality-metrics.md](references/code-quality-metrics.md) - Complexity, maintainability index
</reference_guides>
