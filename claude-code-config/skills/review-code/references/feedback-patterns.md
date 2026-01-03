# Code Review Feedback Patterns

Based on research from Google, Microsoft, and academic studies.

## The What + Why + How Pattern

Every valuable comment includes:

1. **What**: The specific issue
2. **Why**: Why it matters
3. **How**: Concrete fix or direction

### Examples

**Good:**
```
[BLOCKING] SQL injection vulnerability at line 34.
The query uses string concatenation with user input, allowing attackers to modify the query.
Fix: Use parameterized query: db.query('SELECT * FROM users WHERE id = ?', [userId])
```

**Bad:**
```
This query looks unsafe.
```

## Feedback Priority Labels

Use consistent labels so authors know severity:

| Label | Meaning | Merge? |
|-------|---------|--------|
| `[BLOCKING]` | Must fix - security, bugs, missing requirements | No |
| `[CRITICAL]` | Strongly recommended - architecture, major issues | Discuss |
| `[SUGGESTION]` | Would improve code - not required | Yes |
| `[NIT]` | Minor preference - skip if busy | Yes |
| `[QUESTION]` | Need clarification - not blocking | Yes |

## High-Value vs Wasteful Feedback

### High-Value (36-43% implementation rate)
- Security vulnerabilities with exploit scenario
- Logic errors with failing test case
- Missing error handling with consequences
- Performance issues with measurements

### Wasteful (damages team dynamics)
- Style preferences covered by linters
- Renaming suggestions without clear benefit
- "I would do it differently" without why
- Comments on code outside the diff

## Communication Patterns

### Collaborative Framing
```
✓ "Have you considered using a Map here for O(1) lookup?"
✓ "This could throw if user is null - should we add a check?"
✓ "I'm not sure I understand this logic - could you explain?"

✗ "You need to fix this."
✗ "This is wrong."
✗ "Obviously this should be..."
```

### Avoid Belittling Words
Remove: "just", "simply", "obviously", "easy", "only"

```
✗ "Just add a null check"
✗ "This is obviously wrong"
✓ "Add a null check for user.profile"
```

## When to Block vs Approve

### Block Merge
- Security vulnerabilities (any severity)
- Logic bugs that affect functionality
- Missing required tests
- Breaking API changes without migration

### Approve with Comments
- Suggestions for future improvement
- Minor refactoring opportunities
- Documentation improvements
- Style preferences (should be in linter)

### Approve Clean
- Code meets requirements
- Tests pass
- No security issues
- Follows project conventions

## Avoiding Nitpick Culture

**Research finding**: Nitpicking damages team relationships more than it improves code quality. Developers become defensive and less receptive to legitimate feedback.

**Solution:**
1. Automate style enforcement (linters, formatters)
2. Block CI on lint failures, not PR comments
3. Reserve human review for logic and design
4. Mark true nitpicks with `[NIT]` prefix
5. Limit to 3-5 critical items per review

## Review Efficiency

**Google's data:**
- 90% of reviews: <10 files changed
- Average turnaround: 4 hours
- 75% need only one reviewer

**Best practices:**
- Small PRs get better feedback
- Review within 4 hours if possible
- Focus on changed code only
- One pass, thorough, then done

## Sources
- [Google Code Review Guide](https://google.github.io/eng-practices/review/)
- [Microsoft Reviewer Guidance](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/)
- [Conventional Comments](https://conventionalcomments.org/)
