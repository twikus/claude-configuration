---
name: step-03-execute
description: Implementation - execute plan step by step with continuous validation
prev_step: steps/step-02-plan.md
next_step: steps/step-04-validate.md
---

# Step 3: Execute (Implementation)

**Goal:** Implement plan precisely while maintaining code quality. Continue through ALL tasks without stopping for milestones.

---

<available_state>
From previous steps:

- `{task_description}` - What to implement
- `{acceptance_criteria}` - Success criteria
- `{auto_mode}` - If true, skip confirmations
- `{auto_review}` - If true, auto-proceed to review after validation
- Implementation plan with file-by-file changes
- Patterns and examples to follow
</available_state>

---

<execution_sequence>

<create_todos>
**1. Create Todo List**

**CRITICAL:** Use TodoWrite to track every change from the plan.

```
1. ⏸ Update `src/path/file1.ts` - Add validateToken function
2. ⏸ Update `src/path/file2.ts` - Call validateToken in flow
3. ⏸ Create `src/path/file1.test.ts` - Add test coverage
4. ⏸ Run typecheck and fix errors
5. ⏸ Run lint and fix warnings
6. ⏸ Run tests for affected modules
```
</create_todos>

<execution_cycle>
**2. Execute Each Task**

For EACH todo, follow this cycle:

**2.1 Mark In Progress**
- Only ONE todo in_progress at a time

**2.2 ULTRA THINK Before Change**
- Think through exact changes needed
- Review pattern from analysis (e.g., `example.ts:45`)
- Consider impact on other files
- Identify potential edge cases

**2.3 Read Before Edit**
- **ALWAYS** use Read tool before Edit/Write
- Understand current file state
- Find exact location for changes
- Verify pattern assumptions

**2.4 Implement**
- Follow existing patterns exactly
- Match codebase style and conventions
- Use clear variable/method names
- Add NO comments unless truly necessary

**2.5 Validate**
- Check code compiles/parses (syntax check)
- Verify logic matches plan
- Ensure pattern consistency

**2.6 Mark Complete**
- **IMMEDIATELY** mark todo complete when done
</execution_cycle>

<quality_rules>
**3. Quality Rules**

**Code Style:**
- **NO COMMENTS**: Use clear names instead (unless truly necessary)
- **MATCH PATTERNS**: Follow existing codebase conventions exactly
- **CLEAR NAMES**: Variables and functions self-document
- **MINIMAL CHANGES**: Only touch what's needed for this task

**Scope Management:**
- **STRICTLY IN SCOPE**: Implement only what's in the plan
- **NO REFACTORING**: Don't improve unrelated code
- **NO EXTRAS**: Don't add unrequested features
- **ASK FIRST**: If scope seems wrong, clarify with user
</quality_rules>

<halt_conditions>
**4. Halt Conditions**

**HALT and request guidance if:**
- 3 consecutive failures on same task
- Tests fail and fix is not obvious
- Blocking dependency discovered
- Ambiguity that requires user decision

**Do NOT halt for:**
- Minor issues that can be noted and continued
- Warnings that don't block functionality
- Style preferences (follow existing patterns)
</halt_conditions>

<continuous>
**5. Continuous Execution**

**CRITICAL:** Do not stop between tasks for approval.

- Execute all tasks in sequence
- Only halt for blocking issues
- Tests failing = fix before continuing
- Track all completed work for validation
</continuous>

</execution_sequence>

---

<todo_management>
**Todo Progress Example:**
```
1. ✓ Update `src/auth/middleware.ts` - Add validateToken
2. ⏳ Update `src/api/routes.ts` - Call validateToken (IN PROGRESS)
3. ⏸ Create `src/auth/middleware.test.ts` - Tests
4. ⏸ Run typecheck
5. ⏸ Run lint
6. ⏸ Run tests
```

**Rules:**
- Mark complete **IMMEDIATELY** when done
- Only **ONE** in_progress at a time
- Don't batch completions
- Update todos if plan changes
</todo_management>

---

<error_handling>
**If Change Fails:**
1. **STOP** - Don't proceed
2. **UNDERSTAND** - Debug the issue
3. **FIX** - Apply correction
4. **VERIFY** - Confirm fix works
5. **CONTINUE** - Move to next task

**If Pattern Unclear:**
1. Read more of the example file
2. Look for similar patterns elsewhere
3. Ask user if still unclear

**If Scope Question:**
1. Refer back to plan
2. If not in plan, don't do it
3. Ask user if seems necessary
</error_handling>

---

<success_metrics>

- All todos from plan completed
- Each change followed existing patterns
- Code compiles without errors
- No unnecessary halts
- Ready for validation
</success_metrics>

<failure_modes>

- Stopping for approval between tasks
- Ignoring existing patterns
- Making changes without reading first
- Giving up after first failure
- Adding things not in plan
- Multiple todos in_progress simultaneously
</failure_modes>

---

<next_step_directive>
**CRITICAL:** When ALL todos complete, explicitly state:

"**NEXT:** Loading `step-04-validate.md`"

Then load and execute `steps/step-04-validate.md`.
</next_step_directive>
