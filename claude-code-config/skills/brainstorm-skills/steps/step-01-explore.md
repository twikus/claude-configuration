---
name: step-01-explore
description: Expansive exploration phase - cast wide net with parallel agents
next_step: steps/step-02-challenge.md
---

# Phase 1: Expansive Exploration

**Role: CURIOUS EXPLORER** - Generate maximum insight breadth without filtering

---

<available_state>
From SKILL.md entry point:

- `{topic}` - The research topic
- `{auto_mode}` - If true, skip confirmations
- `{save_file}` - If true, save session to file
- `{session_path}` - Path to session file (if saving)
</available_state>

---

<mandatory_rules>
## MANDATORY EXECUTION RULES (READ FIRST)

- 🔍 EXPLORE without judgment - quantity over quality in this phase
- 🌐 LAUNCH parallel agents for maximum coverage
- 💡 CAPTURE every interesting thread, even tangential ones
- 🎯 EXPAND scope - what adjacent areas might matter?
- 🚫 FORBIDDEN: Filtering, critiquing, or discarding ideas in this phase
</mandatory_rules>

---

<execution_sequence>

<parse_topic>
**1. Parse and Expand Topic Scope**

Analyze the topic to identify:
- **Core question**: What exactly are we researching?
- **Adjacent areas**: What related topics might inform this?
- **Key terms**: What should we search for?
- **Stakeholders**: Who cares about this topic and why?

**Scope Expansion:**
"For `{topic}`, I'm also considering:
- [Related area 1] - because it might affect...
- [Related area 2] - to understand alternatives...
- [Related area 3] - to see historical context..."
</parse_topic>

<parallel_agents>
**2. Launch Parallel Research Agents**

**CRITICAL: Launch ALL agents in a SINGLE message for parallel execution.**

**Agent 1: Web Search** (`websearch`)
```
Research the current state of: {topic}

Find:
1. Current best practices and popular approaches
2. Recent developments and trends (2024-2025)
3. Key players, thought leaders, and their perspectives
4. Common use cases and applications
5. Any recent controversies or debates

Focus on diverse, authoritative sources.
```

**Agent 2: Documentation Research** (`explore-docs`) - if technical topic
```
Find documentation and technical guidance for: {topic}

Search for:
1. Official documentation from relevant tools/frameworks
2. Best practices guides
3. Code examples and patterns
4. Configuration recommendations
5. Known limitations or gotchas

Focus on practical implementation guidance.
```

**Agent 3: Codebase Exploration** (`explore-codebase`) - if applicable
```
Search the codebase for patterns related to: {topic}

Find:
1. Existing implementations of similar functionality
2. Patterns and conventions already in use
3. Related utilities or helpers
4. Test patterns for similar features
5. Any prior attempts or related code

Return file paths with line numbers.
```
</parallel_agents>

<interactive_check>
**3. Interactive Exploration** (skip if `{auto_mode}`)

If NOT in auto mode, engage the user:

"I've gathered initial findings on **{topic}**. Before I synthesize:

**Quick questions to focus my research:**
- Are there specific aspects that interest you most?
- Any particular angle or use case you're focused on?
- Anything I should definitely NOT overlook?

(Or say 'continue' to proceed with current findings)"

Wait for response if not in auto mode.
</interactive_check>

<synthesize>
**4. Synthesize Broad Findings**

Combine all agent findings into comprehensive overview:

```
## Phase 1 Discoveries: {topic}

**Current Landscape:**
- [Finding 1 with source]
- [Finding 2 with source]
- [Finding 3 with source]

**Key Players & Perspectives:**
- [Player/Expert 1]: [Their view]
- [Player/Expert 2]: [Their view]

**Popular Approaches:**
1. [Approach 1] - used by [who], pros/cons
2. [Approach 2] - used by [who], pros/cons
3. [Approach 3] - used by [who], pros/cons

**Interesting Threads:**
- [Tangential but relevant finding]
- [Unexpected connection]
- [Emerging trend]

**Initial Impressions:**
At first glance, it seems like [initial take]. But this needs to be challenged.

**Questions Raised:**
- [Question that emerged from research]
- [Uncertainty that needs investigation]
```

Store in `{phase_1_discoveries}`
</synthesize>

<save_progress>
**5. Save Progress** (if `{save_file}` is true)

Append to `{session_path}`:
```markdown
# Brainstorm Session: {topic}
**Date:** {current_date}

## Phase 1: Expansive Exploration

[Phase 1 discoveries content]

---
```
</save_progress>

</execution_sequence>

---

<success_metrics>

- Multiple parallel agents launched for breadth
- Scope expanded beyond obvious interpretations
- Diverse sources and perspectives gathered
- Tangential but relevant threads captured
- Initial questions and uncertainties noted
- No premature filtering or conclusions
</success_metrics>

<failure_modes>

- Launching agents sequentially instead of parallel
- Only searching for confirming evidence
- Filtering out "irrelevant" findings too early
- Drawing conclusions before Phase 4
- Missing adjacent areas that could inform the topic
</failure_modes>

---

<next_step_directive>
**CRITICAL:** After presenting Phase 1 discoveries, immediately state:

"**Phase 1 complete.** We've cast a wide net and gathered diverse perspectives.

**NEXT: Phase 2 - Critical Challenge**

Now I become the DEVIL'S ADVOCATE. Every finding above will be questioned, challenged, and stress-tested. What evidence contradicts these findings? What are we missing?

Loading `step-02-challenge.md`..."

Then load and execute `steps/step-02-challenge.md`.
</next_step_directive>
