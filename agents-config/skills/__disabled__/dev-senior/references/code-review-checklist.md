# Senior Developer Code Review Checklist

## Quick Pre-Review

Before diving into details, scan for these red flags:

- [ ] New file created - is it necessary?
- [ ] New client/service initialized - does one already exist?
- [ ] Similar logic exists elsewhere - should it be shared?
- [ ] Complex abstraction added - is it needed now?

---

## 1. Duplication Check (CRITICAL)

### Client Duplication
```
Question: Is a new client being created for a service that already has one?
```

**Check for:**
- [ ] Database clients (Prisma, Drizzle, pg, mysql2)
- [ ] Cache clients (Redis, Memcached)
- [ ] API clients (Stripe, Twilio, SendGrid)
- [ ] Auth providers (Auth0, Clerk, Supabase Auth)

**Action:** Search for existing client in `lib/`, `utils/`, `services/`

### Code Duplication
```
Question: Does similar code exist elsewhere in the codebase?
```

**Check for:**
- [ ] Same API call pattern (fetch with headers)
- [ ] Same data transformation logic
- [ ] Same validation rules
- [ ] Same error handling pattern

**Action:** If found 3+ times, extract to shared utility

### Type Duplication
```
Question: Is this type already defined elsewhere?
```

**Check for:**
- [ ] Same interface/type in `types/` directory
- [ ] Same shape defined inline in multiple files
- [ ] Database model types that should be inferred

**Action:** Import from single source, don't redefine

---

## 2. Simplicity Check (CRITICAL)

### Over-Engineering Signs
- [ ] Factory pattern with one implementation
- [ ] Abstract class with one subclass
- [ ] Interface with one implementor
- [ ] Configuration for unchanging values
- [ ] Feature flags for non-existent features

**Questions to Ask:**
1. "Do we need this abstraction today, or might we need it?"
2. "If we 'might' need it, remove it."
3. "Can a junior developer understand this in 5 minutes?"

### Premature Optimization
- [ ] Memoization without measured performance issue
- [ ] Complex caching without proven need
- [ ] Micro-optimizations in non-hot paths

**Rule:** Optimize only what you've measured to be slow.

---

## 3. Architecture Check (HIGH)

### Single Responsibility
- [ ] Does this file do one thing well?
- [ ] Does this function have one job?
- [ ] Is the module cohesive?

**Warning Signs:**
- File > 300 lines
- Function > 50 lines
- More than 5-6 dependencies imported

### Dependency Direction
```
Clean dependency flow:
UI → Business Logic → Data Layer → External Services

Bad: Business Logic → UI (components)
Bad: Data Layer → Business Logic
```

- [ ] Dependencies flow in one direction
- [ ] No circular dependencies
- [ ] External services wrapped in `lib/`

---

## 4. Code Quality Check (MEDIUM)

### Naming
- [ ] Variables describe what they hold
- [ ] Functions describe what they do
- [ ] No abbreviations without context (use `user`, not `u`)

### Error Handling
- [ ] Errors are handled, not swallowed
- [ ] Error messages are useful for debugging
- [ ] User-facing errors are user-friendly

### Edge Cases
- [ ] Null/undefined handled
- [ ] Empty arrays/objects handled
- [ ] Error states handled in UI

---

## 5. Security Check (HIGH)

### Input Validation
- [ ] User input validated before use
- [ ] API inputs validated (zod, yup)
- [ ] File uploads validated

### Data Exposure
- [ ] Sensitive data not logged
- [ ] API responses don't leak internal data
- [ ] Error messages don't expose internals

### Authentication/Authorization
- [ ] Protected routes check auth
- [ ] Authorization verified (not just authentication)
- [ ] Tokens handled securely

---

## 6. Maintainability Check (MEDIUM)

### Testability
- [ ] Code is testable (dependencies injectable)
- [ ] Pure functions preferred where possible
- [ ] Side effects isolated

### Documentation
- [ ] Complex logic has brief explanation (but prefer simple code over comments)
- [ ] Public APIs have clear contracts
- [ ] Non-obvious decisions documented

---

## Review Response Template

When reviewing, use this format:

```markdown
## Summary
[One sentence: approve/request changes/needs discussion]

## Critical Issues
- [Issue that must be fixed before merge]

## Suggestions
- [Improvements that would be nice but not blocking]

## Questions
- [Clarifications needed to complete review]
```

---

## Common Review Comments

### For Duplication
> "I see similar logic in `lib/api.ts`. Can we extend that instead of duplicating here?"

### For Over-Engineering
> "This abstraction has only one implementation. Let's use the concrete class directly and extract an interface when we need a second implementation."

### For Missing Extraction
> "This is the third place I've seen this pattern. Worth extracting to a shared utility in `lib/`."

### For Client Duplication
> "We already have a Redis client in `lib/redis.ts`. Let's import from there to maintain one source of truth."

---

## PR Size Guidelines

| Size | Lines Changed | Review Time | Risk |
|------|---------------|-------------|------|
| Small | 1-100 | 15 min | Low |
| Medium | 100-400 | 30-60 min | Medium |
| Large | 400+ | Split it | High |

**Rule:** If a PR is large, ask if it can be split into smaller, focused PRs.

---

## Mental Model

Before approving, mentally answer:

1. **Would I be confident deploying this to production right now?**
2. **Would a new team member understand this code in 6 months?**
3. **Does this make the codebase better or worse overall?**

If any answer is "no" or "uncertain", request changes.
