---
name: step-02-plan
description: Strategic planning - create detailed file-by-file implementation strategy
prev_step: steps/step-01-analyze.md
next_step: steps/step-03-execute.md
---

# Step 2: Plan (Strategic Design)

**Goal:** Transform analysis findings into a comprehensive, executable implementation plan.

---

<available_state>
From previous steps:

- `{task_description}` - What to implement
- `{acceptance_criteria}` - Success criteria
- `{auto_mode}` - If true, skip confirmations and use recommended options
- `{auto_review}` - If true, auto-proceed to review after validation
- Context from codebase exploration
- Patterns and examples identified
</available_state>

---

<execution_sequence>

<review_context>
**1. Review Analysis Findings**

Load and internalize all context gathered:
- Files to modify and their purposes
- Patterns to follow with specific examples
- Dependencies and prerequisites
- Acceptance criteria to satisfy
</review_context>

<ultra_think>
**2. ULTRA THINK: Design Complete Strategy**

**CRITICAL: Think through ENTIRE implementation before writing any plan.**

Mental simulation:
- Walk through the implementation step by step
- Identify all files that need changes
- Determine logical order (dependencies first)
- Consider edge cases and error handling
- Plan test coverage
</ultra_think>

<clarify>
**3. Clarify Ambiguities**

**If `{auto_mode}` = true:**
→ Use recommended option (first option) for any ambiguity. Do not ask questions.

**If `{auto_mode}` = false:**
**STOP** if anything is unclear about:
- Multiple valid approaches
- Unclear technical choices
- Scope boundaries
- Architecture decisions

Use AskUserQuestion:
```
Which approach should we use for X?

**[1] Option A (Recommended)** - Description and tradeoffs
**[2] Option B** - Description and tradeoffs
```
</clarify>

<create_plan>
**4. Create Detailed Plan**

**Structure by FILE, not by feature:**

```markdown
## Implementation Plan: {task_description}

### Overview
[1-2 sentences: High-level strategy and approach]

### Prerequisites
- [ ] Prerequisite 1 (if any)
- [ ] Prerequisite 2 (if any)

---

### File Changes

#### `src/path/file1.ts`
- Add `functionName` that handles X
- Extract logic from Y (follow pattern in `example.ts:45`)
- Handle error case: [specific scenario]
- Consider: [edge case or important context]

#### `src/path/file2.ts`
- Update imports to include new module
- Call `functionName` in existing flow at line ~42
- Update types: Add `NewType` interface

#### `src/path/file3.ts` (NEW FILE)
- Create utility for Z
- Export: `utilityFunction`, `HelperType`
- Pattern: Follow `similar-util.ts` structure

---

### Testing Strategy

**New tests:**
- `src/path/file1.test.ts` - Test functionName with:
  - Happy path
  - Error case
  - Edge case

**Update existing:**
- `src/path/existing.test.ts` - Add test for new flow

---

### Acceptance Criteria Mapping
- [ ] AC1: Satisfied by changes in `file1.ts`
- [ ] AC2: Satisfied by changes in `file2.ts`

---

### Risks & Considerations
- Risk 1: [potential issue and mitigation]
```
</create_plan>

<verify>
**5. Verify Plan Completeness**

Checklist:
- [ ] **All files identified**: Nothing missing from implementation
- [ ] **Logical order**: Dependencies handled before dependents
- [ ] **Clear actions**: Every step is specific and actionable
- [ ] **Test coverage**: All paths have test strategy
- [ ] **In scope**: No scope creep or extras
- [ ] **AC mapped**: Every acceptance criterion has implementation
</verify>

<present>
**6. Present Plan for Approval**

```
**Implementation Plan Ready**

**Overview:** [1 sentence summary]

**Files to modify:** {count} files
**New files:** {count} files
**Tests:** {count} test files

**Estimated changes:**
- `file1.ts` - Major changes (add function, handle errors)
- `file2.ts` - Minor changes (imports, single call)
- `file1.test.ts` - New test file
```

**If `{auto_mode}` = true:**
→ Skip confirmation, auto-proceed to execution immediately.

**If `{auto_mode}` = false:**
```
Ready to proceed to execution? (y/n/adjust)
```
- **y:** Proceed to step-03-execute.md
- **n:** Revise plan
- **adjust:** Modify specific parts
</present>

</execution_sequence>

---

<plan_quality>
**Good Plan Entry:**
```markdown
#### `src/auth/middleware.ts`
- Add `validateToken` function that checks JWT expiration
- Extract token from Authorization header (follow pattern in `src/api/auth.ts:45`)
- Return 401 if token invalid or expired
- Consider: Handle both Bearer and custom token formats
```

**Bad Plan Entry:**
```markdown
#### `src/auth/middleware.ts`
- Add authentication
- Fix security issues
```
</plan_quality>

---

<success_metrics>

- Complete file-by-file plan created
- Logical dependency order established
- All acceptance criteria mapped to changes
- Test strategy defined
- User approved plan (or auto-approved if `{auto_mode}`)
</success_metrics>

<failure_modes>

- Vague actions like "add feature" or "fix issue"
- Organizing by feature instead of file
- Missing test strategy
- Not mapping to acceptance criteria
</failure_modes>

---

<next_step_directive>
**CRITICAL:** When plan approved (or auto-approved), explicitly state:

"**NEXT:** Loading `step-03-execute.md`"

Then load and execute `steps/step-03-execute.md`.
</next_step_directive>
