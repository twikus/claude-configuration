---
name: apex-skills
description: Systematic implementation using APEX methodology (Analyze-Plan-Execute-eXamine) with parallel agents, self-validation, and optional adversarial review. Use when implementing features, fixing bugs, or making code changes that benefit from structured workflow.
argument-hint: [--auto] [--review] task TEST
---

<objective>
Execute systematic implementation workflows using the APEX methodology. This skill uses progressive step loading to minimize context usage.
</objective>

<parameters>
**Optional flags:**

- `--auto` - Autonomous mode: skip all confirmations, auto-approve plans, answer questions with recommended option
- `--review` - Auto-review mode: automatically proceed to adversarial review without asking

**Examples:**

```
/apex-skills add auth middleware
/apex-skills --auto add auth middleware
/apex-skills --review add auth middleware
/apex-skills --auto --review add auth middleware
```

**Parse at start:**

1. Check if `--auto` is present → set `{auto_mode}` = true
2. Check if `--review` is present → set `{auto_review}` = true
3. Remove flags from input → store as `{task_description}`
   </parameters>

<quick_start>
<workflow>

1. Parse flags and task description
2. Load step-01-analyze.md → gather context
3. Load step-02-plan.md → create strategy
4. Load step-03-execute.md → implement
5. Load step-04-validate.md → verify
6. (Optional) Load step-05-review.md → adversarial review
7. (Optional) Load step-06-resolve.md → fix findings
   </workflow>
   </quick_start>

<state_variables>
Capture at start and persist throughout all steps:

- `{task_description}` - What to implement (with flags removed)
- `{acceptance_criteria}` - Success criteria (inferred or explicit)
- `{auto_mode}` - true if `--auto` flag was passed
- `{auto_review}` - true if `--review` flag was passed
  </state_variables>

<entry_point>
<step_0 name="Initialize">

**FIRST ACTION - Parse flags:**

1. Check for `--auto` in input → set `{auto_mode}` = true
2. Check for `--review` in input → set `{auto_review}` = true
3. Remove flags from input → store as `{task_description}`

**THEN:** Load `steps/step-01-analyze.md` to begin analysis.
</step_0>
</entry_point>

<step_files>
Each step is a separate file for progressive context loading:

- `steps/step-01-analyze.md` - Context gathering with parallel agents
- `steps/step-02-plan.md` - File-by-file implementation strategy
- `steps/step-03-execute.md` - Todo-driven implementation
- `steps/step-04-validate.md` - Self-check and validation
- `steps/step-05-review.md` - Adversarial code review (optional)
- `steps/step-06-resolve.md` - Finding resolution (optional)
  </step_files>

<execution_rules>

- **Load one step at a time** - Only load the current step file
- **ULTRA THINK** before major decisions
- **Persist state variables** across all steps
- **Follow next_step directive** at end of each step
  </execution_rules>

<success_criteria>

- Each step loaded progressively
- All validation checks passing
- Clear completion summary provided
  </success_criteria>
