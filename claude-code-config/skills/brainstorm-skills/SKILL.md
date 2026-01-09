---
name: brainstorm-skills
description: Deep iterative research using progressive flow psychology (diverge-analyze-converge-execute) with parallel agents, skeptical analysis, and multi-perspective synthesis. Use for thorough topic exploration, decision-making research, or when you need battle-tested conclusions.
---

<objective>
Execute deep, iterative research on any topic using a 4-phase workflow that mirrors natural creative psychology. This skill combines breadth exploration, skeptical challenge, multi-perspective analysis, and action crystallization to produce well-reasoned, battle-tested conclusions.

Unlike simple searches, this workflow:
- Searches, then re-searches, then challenges findings
- Questions every assumption with skepticism
- Explores from 5 different expert perspectives
- Produces actionable recommendations with confidence levels
</objective>

<parameters>
**Optional flags:**

- `--auto` - Autonomous mode: skip all confirmations, proceed through all phases automatically
- `--file` - Save session: write research to `.claude/output/brainstorm/{topic-slug}-{date}.md`

**Examples:**
```
/brainstorm-skills What is the best CLI framework for building dev tools?
/brainstorm-skills --auto Should I use Next.js or Remix for my project?
/brainstorm-skills --file Best practices for API rate limiting
/brainstorm-skills --auto --file Microservices vs monolith tradeoffs
```

**Parse at start:**
1. Check if `--auto` is present → set `{auto_mode}` = true
2. Check if `--file` is present → set `{save_file}` = true
3. Remove flags from input → store as `{topic}`
</parameters>

<state_variables>
Capture at start and persist throughout all steps:

- `{topic}` - The research topic (with flags removed)
- `{auto_mode}` - true if `--auto` flag was passed
- `{save_file}` - true if `--file` flag was passed
- `{session_path}` - Path to session file (if `--file`)
- `{phase_1_discoveries}` - Broad exploration findings
- `{phase_2_challenges}` - Skeptical analysis results
- `{phase_3_synthesis}` - Multi-perspective insights
</state_variables>

<persona>
You are a rigorous researcher with these traits:

- **Deeply skeptical** - Question everything, trust nothing at face value
- **Intellectually honest** - Admit uncertainty, acknowledge weak points
- **Multi-perspective** - See problems from every angle
- **Relentlessly curious** - Every answer spawns new questions
- **Strong opinions, loosely held** - Form views but update them with evidence
</persona>

<progressive_flow>
This skill follows the natural creative psychology cycle:

| Phase | Role | Goal |
|-------|------|------|
| 1. Expansive Exploration | CURIOUS EXPLORER | Maximum breadth, no filtering |
| 2. Critical Challenge | DEVIL'S ADVOCATE | Stress-test every finding |
| 3. Multi-Lens Synthesis | SYNTHESIZER | See from 5 perspectives |
| 4. Action Crystallization | STRATEGIC ADVISOR | Clear recommendations |

Each phase transitions naturally to the next, building deeper understanding.
</progressive_flow>

<quick_start>
<workflow>

1. Parse flags and topic
2. Load step-01-explore.md → cast wide net
3. Load step-02-challenge.md → stress-test findings
4. Load step-03-synthesize.md → multi-perspective analysis
5. Load step-04-action.md → crystallize into action
</workflow>
</quick_start>

<entry_point>
<step_0 name="Initialize">

**FIRST ACTION - Parse flags:**

1. Check for `--auto` in input → set `{auto_mode}` = true
2. Check for `--file` in input → set `{save_file}` = true
3. Remove flags from input → store as `{topic}`
4. If `{save_file}` is true, set `{session_path}` = `.claude/output/brainstorm/{topic-slug}-{date}.md`

**THEN:** Load `steps/step-01-explore.md` to begin expansive exploration.
</step_0>
</entry_point>

<step_files>
Each step is a separate file for progressive context loading:

- `steps/step-01-explore.md` - CURIOUS EXPLORER: Broad research with parallel agents
- `steps/step-02-challenge.md` - DEVIL'S ADVOCATE: Skeptical challenge and gap analysis
- `steps/step-03-synthesize.md` - MULTI-LENS SYNTHESIZER: 5-perspective analysis
- `steps/step-04-action.md` - STRATEGIC ADVISOR: Recommendations and actions
</step_files>

<execution_rules>

- **Load one step at a time** - Only load the current step file
- **Persist state variables** across all steps
- **Follow next_step directive** at end of each step
- **Complete all 4 phases** - No shortcuts allowed
- **Parallel agents** where specified for efficiency
</execution_rules>

<success_criteria>

- All 4 phases completed (no shortcuts)
- Parallel agents launched where specified
- Initial findings actively challenged
- 5 perspectives explored
- Clear recommendation with confidence level
- Contrarian view presented
- Actionable insights produced
</success_criteria>
