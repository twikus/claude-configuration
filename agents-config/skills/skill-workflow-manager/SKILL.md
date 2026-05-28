---
name: skill-workflow-manager
description: Create multi-step workflow skills with progressive step loading, state management, and interactive decisions. Use when building complex skills like APEX that need structured phases.
argument-hint: <workflow name> [description]
---

<objective>
Guide the creation of professional multi-step workflow skills. These skills use progressive step loading to minimize context, maintain state across steps, and provide interactive decision points.
</objective>

<when_to_use>
**Use this skill when building:**

- Multi-phase workflows (3+ distinct steps)
- Skills that need state persistence across steps
- Interactive workflows with user decision points
- Skills with optional/conditional steps
- Workflows that save outputs for review

**Don't use for:**

- Simple single-action skills
- Skills that complete in one step
- Pure research/exploration skills
  </when_to_use>

<workflow_creation_process>

## Phase 1: Design the Workflow

<step_1_define_structure>
**1.1 Identify Workflow Steps**

Ask yourself:

- What are the distinct phases of this workflow?
- What must complete before the next step can start?
- Which steps are optional or conditional?
- Where do users need to make decisions?

**1.2 Map Dependencies**

```
Step 1 ──► Step 2 ──► Step 3 ──┬──► Step 4a (if condition)
                               └──► Step 4b (else)
```

**1.3 Define State Variables**

What data needs to persist across steps?

```yaml
state_variables:
  - task_description: string # What to do
  - task_id: string # Unique identifier
  - auto_mode: boolean # Skip confirmations
  - results: object # Accumulated results
```

</step_1_define_structure>

<step_2_create_structure>
**2.1 Create Folder Structure**

```
skills/{skill-name}/
├── SKILL.md                    # Main entry point
├── steps/
│   ├── step-00-init.md         # Initialization (parse flags, setup)
│   ├── step-01-{name}.md       # First step
│   ├── step-02-{name}.md       # Second step
│   └── ...
└── references/                 # Optional: templates, patterns
    └── ...
```

**2.2 Naming Conventions**

- Steps: `step-NN-{descriptive-name}.md`
- NN = two-digit number (00, 01, 02...)
- Use kebab-case for names
- Keep names short but descriptive
  </step_2_create_structure>

</workflow_creation_process>

<templates>
**Load templates from references:**

- [Step Template](references/step-template.md) - Base structure for any step
- [Ask Patterns](references/ask-patterns.md) - AskUserQuestion patterns
- [State Management](references/state-management.md) - Persisting data across steps
- [Workflow Patterns](references/workflow-patterns.md) - Common workflow designs
- [Prompt Engineering](references/prompt-engineering.md) - Best practices for prompts
  </templates>

<execution_flow>

## Phase 2: Build the Skill

**Step 1: Create SKILL.md**

Use this structure:

```markdown
---
name: { skill-name }
description: { what it does }
argument-hint: { flags and args }
---

<objective>
{Clear goal statement}
</objective>

<parameters>
{Flags and arguments}
</parameters>

<state_variables>
{Data that persists across steps}
</state_variables>

<entry_point>
Load `steps/step-00-init.md`
</entry_point>

<step_files>
{Table of all steps}
</step_files>
```

**Step 2: Create step-00-init.md**

Always start with an init step that:

- Parses flags and arguments
- Sets up state variables
- Creates output folders (if needed)
- Loads the first "real" step

**Step 3: Create Each Step File**

Use the step template from [references/step-template.md](references/step-template.md)

**Step 4: Test the Workflow**

Run through the workflow to ensure:

- State persists correctly
- Transitions work
- Conditional steps trigger properly
- Error handling works

</execution_flow>

<critical_patterns>

## Critical Patterns to Follow (BMAD-Inspired)

### 1. Micro-File Architecture

```
ALWAYS: Each step is a self-contained file with embedded rules
ALWAYS: Load one step at a time (progressive loading)
NEVER: Load all steps upfront
NEVER: Assume knowledge from future steps

Why: Saves context, disciplined execution, clear boundaries
```

### 2. Mandatory Execution Rules Section

Every step MUST start with this:

```markdown
## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER {critical forbidden action}
- ✅ ALWAYS {critical required action}
- 📋 YOU ARE A {role}, not a {anti-role}
- 💬 FOCUS on {this step's scope} only
- 🚫 FORBIDDEN to {boundary violation}
```

### 3. Execution Protocols Section

```markdown
## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 💾 Update document/frontmatter after each phase
- 📖 Complete this step fully before loading next
- 🚫 FORBIDDEN to load next step until {criteria}
```

### 4. Context Boundaries Section

```markdown
## CONTEXT BOUNDARIES:

- Variables from previous steps are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from future steps
- {Resource} loaded on-demand when needed
```

### 5. Your Task Statement

One clear sentence describing the step's purpose:

```markdown
## YOUR TASK:

Initialize the workflow by parsing flags and setting up state.
```

### 6. User Decisions with AskUserQuestion

**CRITICAL: NEVER use plain text "[C] Continue" prompts. ALWAYS use AskUserQuestion.**

````markdown
**If `{auto_mode}` = true:**
→ Use recommended option automatically

**If `{auto_mode}` = false:**
Use AskUserQuestion:

```yaml
questions:
  - header: "Continue"
    question: "Ready to proceed to the next step?"
    options:
      - label: "Continue (Recommended)"
        description: "Proceed to next phase"
      - label: "Review first"
        description: "I want to review before continuing"
      - label: "Go back"
        description: "Return to previous step"
    multiSelect: false
```
````

````

### 7. Success Metrics & Failure Modes
```markdown
## SUCCESS METRICS:

✅ {Criterion 1}
✅ {Criterion 2}
✅ Frontmatter properly updated

## FAILURE MODES:

❌ {Failure 1}
❌ {Failure 2}
❌ **CRITICAL**: Not using AskUserQuestion for user input
````

### 8. Frontmatter State Tracking

Track progress in document frontmatter:

```yaml
---
stepsCompleted: [1, 2, 3]
task_description: "Add auth middleware"
selected_approach: "jwt"
---
```

### 9. Critical Tags

Use `<critical>` tags for essential reminders:

```markdown
<critical>
Remember: This step is ONLY about analysis - don't plan or implement!
</critical>
```

### 10. Next Step Routing

```markdown
## NEXT STEP:

After user confirms via AskUserQuestion, load `./step-02-plan.md`

<critical>
Remember: {Important boundary reminder}
</critical>
```

</critical_patterns>

<common_mistakes>

## Common Mistakes to Avoid

❌ **Loading all steps at once**
→ Use micro-file architecture, one step at a time

❌ **Plain text prompts like "[C] Continue"**
→ ALWAYS use AskUserQuestion tool for ANY user input

❌ **Missing MANDATORY EXECUTION RULES section**
→ Every step MUST start with rules using 🛑✅📋💬🚫 emojis

❌ **No CONTEXT BOUNDARIES section**
→ Always define what's in scope and what's not

❌ **Vague YOUR TASK statement**
→ Must be ONE clear sentence describing step's purpose

❌ **Forgetting state handoff**
→ Each step must document available variables from previous steps

❌ **Missing SUCCESS METRICS / FAILURE MODES**
→ Every step needs ✅ success criteria and ❌ failure modes

❌ **Not handling auto_mode**
→ Check auto_mode before ANY AskUserQuestion call

❌ **No frontmatter state tracking**
→ Track `stepsCompleted` array in document frontmatter

❌ **Missing `<critical>` reminders**
→ End each step with critical boundary reminder

❌ **Hardcoding paths**
→ Use relative paths and state variables

</common_mistakes>

<success_criteria>
**A well-designed workflow skill (BMAD-style):**

**Structure:**

- [ ] Micro-file architecture - each step self-contained
- [ ] Clear step progression with dependencies
- [ ] State variables documented and persisted in frontmatter

**Each Step Has:**

- [ ] MANDATORY EXECUTION RULES section with emojis
- [ ] EXECUTION PROTOCOLS section
- [ ] CONTEXT BOUNDARIES section
- [ ] YOUR TASK - one clear sentence
- [ ] Numbered EXECUTION SEQUENCE
- [ ] SUCCESS METRICS with ✅ checkmarks
- [ ] FAILURE MODES with ❌ marks
- [ ] NEXT STEP routing section
- [ ] `<critical>` reminder at the end

**User Interaction:**

- [ ] ALL user decisions use AskUserQuestion (never plain text)
- [ ] Auto mode skips AskUserQuestion calls
- [ ] Save mode outputs to files with frontmatter

**State Management:**

- [ ] `stepsCompleted` array tracked in frontmatter
- [ ] Resume detection checks existing documents
- [ ] State variables passed between steps
      </success_criteria>

<quick_start>

## Quick Start

**To create a new workflow skill:**

1. Define your steps and their dependencies
2. Create the folder structure
3. Copy and customize SKILL.md template
4. Create step-00-init.md for initialization
5. Create each step using the step template
6. Test the workflow end-to-end

**Reference files to consult:**

- `references/step-template.md` - Step file structure
- `references/ask-patterns.md` - User interaction patterns
- `references/state-management.md` - State persistence
- `references/workflow-patterns.md` - Common workflows
- `references/prompt-engineering.md` - Prompt best practices
  </quick_start>
