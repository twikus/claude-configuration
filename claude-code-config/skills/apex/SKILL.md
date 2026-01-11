---
name: apex
description: Systematic implementation using APEX methodology (Analyze-Plan-Execute-eXamine) with parallel agents, self-validation, and optional adversarial review. Use when implementing features, fixing bugs, or making code changes that benefit from structured workflow.
argument-hint: [-a] [-x] [-s] [-t] [-b] [-pr] [-i] [-r <task-id>] <task description>
---

<objective>
Execute systematic implementation workflows using the APEX methodology. This skill uses progressive step loading to minimize context usage and supports saving outputs for review and resumption.
</objective>

<parameters>

<flags>
**Enable flags (turn ON):**
| Short | Long | Description |
|-------|------|-------------|
| `-a` | `--auto` | Autonomous mode: skip confirmations, auto-approve plans |
| `-x` | `--examine` | Auto-examine mode: proceed to adversarial review |
| `-s` | `--save` | Save mode: output each step to `.claude/output/apex/` |
| `-t` | `--test` | Test mode: include test creation and runner steps |
| `-e` | `--economy` | Economy mode: no subagents, save tokens (for limited plans) |
| `-r` | `--resume` | Resume mode: continue from a previous task |
| `-b` | `--branch` | Branch mode: verify not on main, create branch if needed |
| `-pr` | `--pull-request` | PR mode: create pull request at end (enables -b) |
| `-i` | `--interactive` | Interactive mode: configure flags via AskUserQuestion |

**Disable flags (turn OFF):**
| Short | Long | Description |
|-------|------|-------------|
| `-A` | `--no-auto` | Disable auto mode |
| `-X` | `--no-examine` | Disable examine mode |
| `-S` | `--no-save` | Disable save mode |
| `-T` | `--no-test` | Disable test mode |
| `-E` | `--no-economy` | Disable economy mode |
| `-B` | `--no-branch` | Disable branch mode |
| `-PR` | `--no-pull-request` | Disable PR mode |
</flags>

<examples>
```bash
# Basic usage
/apex add auth middleware

# Autonomous mode (no confirmations)

/apex -a add auth middleware

# Save outputs for review

/apex -s add auth middleware

# With adversarial review

/apex -x add auth middleware

# Full autonomous with examine and save

/apex -a -x -s add auth middleware

# Include test creation and runner

/apex -t add auth middleware

# Resume a previous task

/apex -r 01-auth-middleware
/apex -r 01 # Partial match supported

# Combined flags

/apex -a -x -s -t add auth middleware

# Branch mode (ensure not on main, create branch if needed)

/apex -b add auth middleware

# Create PR at end (automatically enables -b)

/apex -pr add auth middleware
/apex -a -pr add auth middleware # Auto + PR mode

# Interactive mode (configure flags via menu)

/apex -i add auth middleware

# Economy mode (save tokens, no subagents)

/apex -e add auth middleware
/apex -a -e add auth middleware # Auto + economy

# Disable flags (override defaults)

/apex -A add auth middleware # Disable auto (if default is true)
/apex -S -T add auth middleware # Disable save and test
/apex --no-auto add auth middleware

```
</examples>

<parsing_rules>
**Parse flags in order:**

1. Load defaults from `step-00-init.md` `<defaults>` section
2. Parse flags (enable OR disable):
   - `-a` or `--auto` → `{auto_mode}` = true
   - `-A` or `--no-auto` → `{auto_mode}` = false
   - `-x` or `--examine` → `{examine_mode}` = true
   - `-X` or `--no-examine` → `{examine_mode}` = false
   - `-s` or `--save` → `{save_mode}` = true
   - `-S` or `--no-save` → `{save_mode}` = false
   - `-t` or `--test` → `{test_mode}` = true
   - `-T` or `--no-test` → `{test_mode}` = false
   - `-e` or `--economy` → `{economy_mode}` = true
   - `-E` or `--no-economy` → `{economy_mode}` = false
   - `-b` or `--branch` → `{branch_mode}` = true
   - `-B` or `--no-branch` → `{branch_mode}` = false
   - `-pr` or `--pull-request` → `{pr_mode}` = true, `{branch_mode}` = true
   - `-PR` or `--no-pull-request` → `{pr_mode}` = false
   - `-i` or `--interactive` → `{interactive_mode}` = true
   - `-r` or `--resume` + task-id → `{resume_task}` = task-id
3. Remove all flags from input → store remainder as `{task_description}`
4. **If `{pr_mode}` = true:** Automatically enable `{branch_mode}` = true
5. Generate `{task_id}` from task description (e.g., "add auth middleware" → "01-add-auth-middleware")
6. **If `{economy_mode}` = true:** Load `steps/step-00b-economy.md` for override rules
</parsing_rules>

</parameters>

<output_structure>
**When `{save_mode}` = true:**

All outputs saved to PROJECT directory (where Claude Code is running):
```

.claude/output/apex/{task-id}/
├── 00-context.md # Params, user request, timestamp
├── 01-analyze.md # Analysis findings
├── 02-plan.md # Implementation plan
├── 03-execute.md # Execution log
├── 04-validate.md # Validation results
├── 05-examine.md # Review findings (if -x)
├── 06-resolve.md # Resolution log (if -x)
├── 07-tests.md # Test analysis and creation (if --test)
├── 08-run-tests.md # Test runner log (if --test)
└── 09-finish.md # Workflow finish and PR creation (if --pull-request)

````

**00-context.md structure:**
```markdown
# APEX Task: {task_id}

**Created:** {timestamp}
**Task:** {task_description}

## Flags
- Auto mode: {auto_mode}
- Examine mode: {examine_mode}
- Save mode: {save_mode}
- Test mode: {test_mode}

## User Request
{original user input}

## Acceptance Criteria
- [ ] AC1: {inferred criterion}
- [ ] AC2: {inferred criterion}
````

</output_structure>

<resume_workflow>
**When `-r {task-id}` is provided:**

1. **Locate task folder:**

   ```
   .claude/output/apex/{task-id}/
   ```

   - Support partial match: `-r 01` finds `01-add-auth-middleware`
   - If multiple matches, list them and ask user to specify

2. **Read 00-context.md** to restore:
   - Original task description
   - Flags (auto_mode, examine_mode, test_mode)
   - Acceptance criteria

3. **Scan existing step files** to determine progress:
   - Find highest numbered step file
   - Check if it's complete (has completion marker)
   - Resume from next step or current incomplete step

4. **Continue workflow** from detected position
   </resume_workflow>

<workflow>
**Standard flow:**
1. Parse flags and task description
2. If `-r`: Execute resume workflow
3. If `-s`: Create output folder and 00-context.md
4. Load step-01-analyze.md → gather context
5. Load step-02-plan.md → create strategy
6. Load step-03-execute.md → implement
7. Load step-04-validate.md → verify
8. If `--test`: Load step-07-tests.md → analyze and create tests
9. If `--test`: Load step-08-run-tests.md → run until green
10. If `-x` or user requests: Load step-05-examine.md → adversarial review
11. If findings: Load step-06-resolve.md → fix findings
12. If `-pr`: Load step-09-finish.md → create pull request
</workflow>

<state_variables>
**Persist throughout all steps:**

| Variable                | Type    | Description                                            |
| ----------------------- | ------- | ------------------------------------------------------ |
| `{task_description}`    | string  | What to implement (flags removed)                      |
| `{task_id}`             | string  | Kebab-case identifier (e.g., `01-add-auth-middleware`) |
| `{acceptance_criteria}` | list    | Success criteria (inferred or explicit)                |
| `{auto_mode}`           | boolean | Skip confirmations, use recommended options            |
| `{examine_mode}`        | boolean | Auto-proceed to adversarial review                     |
| `{save_mode}`           | boolean | Save outputs to .claude/output/apex/                   |
| `{test_mode}`           | boolean | Include test steps (07-08)                             |
| `{economy_mode}`        | boolean | No subagents, direct tool usage only                   |
| `{branch_mode}`         | boolean | Verify not on main, create branch if needed            |
| `{pr_mode}`             | boolean | Create pull request at end                             |
| `{interactive_mode}`    | boolean | Configure flags interactively                          |
| `{resume_task}`         | string  | Task ID to resume (if -r provided)                     |
| `{output_dir}`          | string  | Full path to output directory                          |
| `{branch_name}`         | string  | Created branch name (if branch_mode)                   |

</state_variables>

<entry_point>

**FIRST ACTION:** Load `steps/step-00-init.md`

Step 00 handles:

- Flag parsing (-a, -x, -s, -r, --test)
- Resume mode detection and task lookup
- Output folder creation (if save_mode)
- 00-context.md creation (if save_mode)
- State variable initialization

After initialization, step-00 loads step-01-analyze.md.

</entry_point>

<step_files>
**Progressive loading - only load current step:**

| Step | File                         | Purpose                                              |
| ---- | ---------------------------- | ---------------------------------------------------- |
| 00   | `steps/step-00-init.md`      | Parse flags, create output folder, initialize state  |
| 01   | `steps/step-01-analyze.md`   | Pure context gathering (what exists, not what to do) |
| 02   | `steps/step-02-plan.md`      | File-by-file implementation strategy                 |
| 03   | `steps/step-03-execute.md`   | Todo-driven implementation                           |
| 04   | `steps/step-04-validate.md`  | Self-check and validation                            |
| 05   | `steps/step-05-examine.md`   | Adversarial code review (optional)                   |
| 06   | `steps/step-06-resolve.md`   | Finding resolution (optional)                        |
| 07   | `steps/step-07-tests.md`     | Test analysis and creation (if --test)               |
| 08   | `steps/step-08-run-tests.md` | Test runner loop until green (if --test)             |
| 09   | `steps/step-09-finish.md`    | Create pull request (if --pull-request)              |

</step_files>

<execution_rules>

- **Load one step at a time** - Only load the current step file
- **ULTRA THINK** before major decisions
- **Persist state variables** across all steps
- **Follow next_step directive** at end of each step
- **Save outputs** if `{save_mode}` = true (append to step file)
- **Use parallel agents** for independent exploration tasks
  </execution_rules>

<save_output_pattern>
**When `{save_mode}` = true, each step must:**

1. At step start: Create/open `{output_dir}/NN-stepname.md`
2. Write step header with timestamp
3. Append findings/outputs as work progresses
4. At step end: Write completion marker

**Completion marker format:**

```markdown
---

## Step Complete

**Status:** ✓ Complete
**Next:** step-NN-name.md
**Timestamp:** {ISO timestamp}
```

</save_output_pattern>

<success_criteria>

- Each step loaded progressively
- All validation checks passing
- Outputs saved if `{save_mode}` enabled
- Tests passing if `{test_mode}` enabled
- Clear completion summary provided
  </success_criteria>
