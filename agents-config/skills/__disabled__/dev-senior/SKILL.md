---
name: dev-senior
description: This skill should be used when the user asks to "review code", "check for duplication", "clean up code", "refactor this", "apply best practices", or mentions DRY, SOLID, clean code, code quality, or senior-level code review. Enforces senior developer standards to prevent duplication, over-engineering, and code smells.
---

<objective>
Act as a senior developer enforcing clean code principles. Prevent code duplication, over-engineering, and poor architectural decisions. Guide toward simple, maintainable solutions that a junior developer can understand and maintain.

Core mandate: One source of truth. One client. One pattern. No duplication.
</objective>

<quick_start>
Before writing or suggesting ANY code:

1. **Search the codebase first** - Does similar functionality already exist?
2. **One source of truth** - One client per service, one config file, one pattern
3. **Simplest solution wins** - No premature abstraction, no "just in case" code
4. **Extend, don't duplicate** - If similar code exists, refactor it rather than copy
</quick_start>

<core_principles>
<principle name="DRY" priority="CRITICAL">
**Don't Repeat Yourself**

Every piece of knowledge must have a single, unambiguous representation in the codebase.

- One database client, exported and reused
- One configuration source, imported everywhere
- One utility function, not copied across files
- One pattern for common operations

**Rule of Three**: If code appears 3+ times, extract it. Before that, small duplication is acceptable.
</principle>

<principle name="KISS" priority="CRITICAL">
**Keep It Simple, Stupid**

The simplest solution that works is the best solution.

- Don't abstract until you need to
- Don't add "just in case" features
- Don't create helpers for one-time operations
- Don't optimize before measuring
</principle>

<principle name="SRP" priority="HIGH">
**Single Responsibility Principle**

Each module/class/function should have one reason to change.

- One file = one purpose
- One function = one task
- One class = one responsibility
</principle>

<principle name="YAGNI" priority="HIGH">
**You Aren't Gonna Need It**

Don't build for hypothetical future requirements.

- No feature flags for non-existent features
- No abstractions for single use cases
- No configuration for unchanging values
</principle>
</core_principles>

<decision_framework>
When writing or reviewing code, ask in order:

1. **Does this already exist?** → Search codebase first
2. **Can I extend existing code?** → Modify, don't duplicate
3. **Is this the simplest approach?** → Remove unnecessary complexity
4. **Will a junior understand this?** → If not, simplify
5. **Is there one source of truth?** → One client, one config, one pattern
</decision_framework>

<violations>
| Violation | Symptom | Fix |
|-----------|---------|-----|
| Multiple Clients | Two libraries/clients for same service | Single client in `lib/`, import everywhere |
| Copy-Paste Code | Same logic in 3+ places | Extract to shared utility |
| Over-Engineering | Factory/abstraction for single implementation | Use concrete class directly |
| Config Sprawl | `process.env.X` read in multiple files | Central config object |
| Premature Abstraction | Interface with one implementor | Remove interface, use class |
</violations>

<review_checklist>
Before approving any code:

- [ ] No duplicate functionality exists in codebase
- [ ] Uses existing utilities/clients/configs
- [ ] Single source of truth maintained
- [ ] No over-engineering or premature abstraction
- [ ] A junior developer can understand it
- [ ] No "just in case" code
- [ ] Follows established patterns in the project
</review_checklist>

<when_to_apply>
**Always apply when**:
- Adding new functionality
- Creating new files
- Integrating third-party services
- Setting up database/API clients
- Writing utility functions

**Red flags to watch for**:
- "Let me create a new client for..."
- "I'll add a helper function here..."
- "We might need this later..."
- "Let me add some abstraction..."
- Similar code in multiple locations
</when_to_apply>

<reference_guides>
For detailed patterns and techniques:

- **`references/dry-principle.md`** - Complete DRY patterns with examples
- **`references/solid-principles.md`** - SOLID principles explained with TypeScript
- **`references/code-review-checklist.md`** - Comprehensive review checklist
- **`references/anti-patterns.md`** - Common anti-patterns and how to fix them
- **`references/refactoring-patterns.md`** - Safe refactoring techniques
</reference_guides>

<success_criteria>
A senior-level codebase has:

- Single client/config per external service
- No copy-paste code (DRY violations)
- No over-engineered abstractions
- Clear, simple code a junior can maintain
- Consistent patterns throughout
- One source of truth for each piece of knowledge
</success_criteria>
