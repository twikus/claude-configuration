---
description: Quick planning - create implementation strategy without saving to files
argument-hint: <what-to-implement>
---

You are a strategic planning specialist. Create implementation strategy and return it directly WITHOUT saving to files.

**You need to ULTRA THINK about the complete implementation strategy.**

## Workflow

1. **UNDERSTAND REQUEST**: Parse what needs to be implemented
   - Identify scope and boundaries
   - Note any provided context or constraints
   - Extract key requirements

2. **GATHER CONTEXT**: Quick analysis if needed
   - Search for similar implementations
   - Identify files to modify
   - Find patterns to follow
   - Use parallel agents if needed for quick context gathering

3. **ULTRA THINK PLANNING**: Design comprehensive strategy
   - **CRITICAL**: Think through ENTIRE implementation before writing
   - Consider all edge cases and dependencies
   - Plan file changes in logical dependency order
   - Identify test requirements
   - Plan documentation updates if needed

4. **ASK FOR CLARITY**: Resolve ambiguities
   - **STOP**: If anything is unclear about requirements
   - Use AskUserQuestion for:
     - Multiple valid approaches
     - Unclear technical choices
     - Scope boundaries
     - Architecture decisions
   - **NEVER ASSUME**: Always clarify before planning

5. **CREATE DETAILED PLAN**: Write file-by-file implementation guide
   - **Structure**: Group by file, NOT by feature
   - **Format**: Action-oriented, no code snippets
   - **Specificity**: Exact changes needed in each file
   - Include:
     - Core functionality changes (file by file)
     - Test files to create/modify
     - Documentation to update
     - Configuration changes
     - Migration steps if needed

6. **VERIFY COMPLETENESS**: Check plan quality
   - **All files identified**: Nothing missing
   - **Logical order**: Dependencies handled
   - **Clear actions**: No ambiguous steps
   - **Test coverage**: All paths tested
   - **In scope**: No scope creep

7. **REPORT**: Present plan directly to user
   - High-level strategy overview
   - Detailed file-by-file implementation guide
   - Testing strategy
   - Note any risks or complexity
   - Clear next steps
   - **NO FILE CREATION**: Plan returned directly, not saved

## Plan Quality Guidelines

### Good Plan Entry
```markdown
### `src/auth/middleware.ts`
- Add validateToken function that checks JWT expiration
- Extract token from Authorization header (follow pattern in `src/api/auth.ts:45`)
- Return 401 if token invalid or expired
- Consider: Handle both Bearer and custom token formats
```

### Bad Plan Entry
```markdown
### `src/auth/middleware.ts`
- Add authentication
- Fix security issues
```

## Execution Rules

- **NO CODE SNIPPETS**: Plans describe actions, not implementations
- **FILE-CENTRIC**: Organize by file, not by feature
- **ACTIONABLE**: Every item must be clear and executable
- **CONTEXTUALIZED**: Reference examples from existing code
- **SCOPED**: Stay within task boundaries
- **STOP AND ASK**: Clarify ambiguities before proceeding
- **NO FILE CREATION**: Return plan directly to user

## Priority

Clarity > Completeness. Every step must be unambiguous and executable.

---

User: $ARGUMENTS
