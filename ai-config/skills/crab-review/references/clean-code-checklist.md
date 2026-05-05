# Clean Code Review Checklist

## Reader Lens

Review as a developer seeing this code for the first time.

**Naming:**
- Functions use verbs: `getUser`, `validateInput`, `calculateTotal`
- Variables reveal intent: `remainingAttempts` not `ra`
- Booleans read as questions: `isActive`, `hasPermission`, `canEdit`
- No abbreviations, acronyms, or single letters (except `i` in short loops)
- Consistent naming across the codebase

**Clarity:**
- Can you understand what each function does without reading its body?
- Are there magic numbers/strings? Should they be named constants?
- Is control flow readable? (guard clauses > deep nesting)
- Are ternaries simple enough to read at a glance? (if not, use if/else)
- Are comments explaining WHY (good) or WHAT (redundant)?

**Cognitive load:**
- Can you hold the function logic in your head at once?
- Are there too many things to track (variables, branches, state)?
- Does the code read top-to-bottom without jumping around?
- Are abstractions named at a consistent level? (don't mix high-level and low-level)

## Architect Lens

Evaluate structural quality and design principles.

**Single Responsibility:**
- Does each function do ONE thing?
- Does each file/module have ONE reason to change?
- Are unrelated concerns mixed together?

**Open/Closed:**
- Can behavior be extended without modifying existing code?
- Are there switch/if chains that grow with each new feature?

**Dependency management:**
- Are dependencies injected or hardcoded?
- Is there tight coupling between modules that should be independent?
- Are circular dependencies present?

**Abstraction quality:**
- Is there premature abstraction (DRY applied too aggressively)?
- Is there missing abstraction (copy-paste patterns)?
- Do abstractions leak implementation details?
- Are interfaces/types appropriately sized? (not god objects)

**Component design:**
- Props/parameters: are there too many? (>4 is a smell)
- Is state managed at the right level?
- Are side effects isolated and explicit?
- Is there a clear data flow?

## Maintainer Lens

Evaluate how easy this code is to change, test, and debug.

**Complexity:**
- Functions under 30 lines? (ideally under 20)
- Nesting depth <= 2? (3+ needs refactoring)
- Cyclomatic complexity reasonable? (count branches)
- Are there deeply chained method calls?

**Duplication:**
- Any copy-pasted blocks > 5 lines?
- Similar patterns that could share logic?
- Repeated error handling that could be centralized?

**Testability:**
- Can each function be tested in isolation?
- Are external dependencies mockable?
- Are there hidden dependencies (global state, singletons)?
- Are pure functions preferred where possible?

**Change impact:**
- If you change this code, how many other files break?
- Are there implicit contracts that aren't enforced by types?
- Is the blast radius of a bug contained?

**Dead code:**
- Unused imports, variables, functions?
- Commented-out code blocks?
- Feature flags that are always on/off?
- Unreachable code paths?
