# Clean Code Principles

Based on Robert Martin's Clean Code and industry research.

## SOLID Principles

| Principle | Rule | Violation Sign |
|-----------|------|----------------|
| **S**ingle Responsibility | One reason to change | Class/function does multiple things |
| **O**pen/Closed | Open for extension, closed for modification | Adding features requires changing existing code |
| **L**iskov Substitution | Subtypes must be substitutable | Subclass breaks when used as parent |
| **I**nterface Segregation | No forced dependencies | Implementing unused interface methods |
| **D**ependency Inversion | Depend on abstractions | Direct instantiation of dependencies |

## Function Guidelines

**Size and Scope:**
- Maximum 50 lines (ideally <20)
- Do ONE thing well
- Single level of abstraction
- Fit on one screen without scrolling

**Parameters:**
- Maximum 3 parameters
- Avoid flag arguments (split into separate methods)
- Use objects for related parameters

**Naming:**
- Verbs for functions: `getUserById()`, `calculateTotal()`
- Reveals intent without reading body
- No abbreviations: `getTransaction()` not `getTx()`

## Naming Conventions

```
✓ Descriptive, unambiguous names
✓ Pronounceable and searchable
✓ Class names: nouns (User, PaymentProcessor)
✓ Method names: verbs (validate, calculate, fetch)
✗ Single letter variables (except loop counters)
✗ Hungarian notation (strName, intCount)
✗ Abbreviations (usr, txn, cfg)
```

## Code Smells to Detect

### Critical Smells (Flag in Review)

| Smell | Detection | Fix |
|-------|-----------|-----|
| **Duplicated Code** | Same logic in 2+ places | Extract to shared function |
| **Large Class/Method** | >50 lines, multiple responsibilities | Split by responsibility |
| **Long Parameter List** | >3 parameters | Use parameter object |
| **Feature Envy** | Method uses another class's data more | Move method to that class |
| **God Object** | One class controls everything | Split into focused classes |

### Medium Smells (Suggest Fix)

| Smell | Detection | Fix |
|-------|-----------|-----|
| **Deep Nesting** | >3 levels of indentation | Guard clauses, early returns |
| **Magic Numbers** | Unexplained literals | Named constants |
| **Dead Code** | Commented-out or unreachable code | Delete it |
| **Shotgun Surgery** | Small change touches many files | Consolidate related code |

## Complexity Reduction Patterns

**Before (Complex):**
```javascript
function process(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // actual logic here
      }
    }
  }
}
```

**After (Guard Clauses):**
```javascript
function process(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;

  // actual logic here
}
```

## Comments Best Practices

**Good Comments:**
- Explain WHY (intent), not WHAT (code does that)
- Warn of consequences
- TODO with ticket number

**Bad Comments:**
- Redundant (restates the code)
- Commented-out code (delete it)
- Closing brace comments (`} // end if`)
- Journal comments (use git history)

## Boy Scout Rule

> Leave code cleaner than you found it.

But in PRs: Only clean code you're already changing. Don't expand scope.

## Sources
- Clean Code by Robert C. Martin
- [Google Engineering Practices](https://google.github.io/eng-practices/)
- [Microsoft Code Review Guide](https://microsoft.github.io/code-with-engineering-playbook/)
