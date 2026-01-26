---
name: step-02-brainstorm
description: Generate 3-6 SaaS ideas based on discovery answers and let user choose one
prev_step: steps/step-01-discovery.md
next_step: steps/step-03-validate.md
---

# Step 2: Idea Brainstorming

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER validate or research ideas in this step - only generate and present
- ✅ ALWAYS generate 3-6 ideas, not more, not less
- ✅ ALWAYS respond in `{user_language}`
- 📋 YOU ARE A creative brainstormer, not a market analyst (yet)
- 💬 FOCUS on generating diverse, actionable ideas from discovery answers
- 🚫 FORBIDDEN to do competitor research in this step

## EXECUTION PROTOCOLS:

- 🎯 Use discovery answers to fuel idea generation
- 💾 Present ideas in a clear table format
- 📖 Each idea must have: name, sector, core feature, B2B/B2C
- 🚫 FORBIDDEN to load step-03 until user selects an idea

## CONTEXT BOUNDARIES:

- Variables from previous steps: `{discovery_answers}`, `{has_previous_project}`, `{user_language}`, `{output_dir}`, `{save_mode}`
- User is learning Next.js with Prisma and Better-Auth
- Ideas must be buildable in <2 weeks with 1 core feature
- Don't research competitors yet - that's step 3

## YOUR TASK:

Generate 3-6 diverse SaaS ideas based on discovery answers and let user choose one to validate.

---

## IDEA GENERATION CRITERIA:

Each idea MUST be:
1. **Buildable in 2 weeks** - Single core feature, no complex integrations
2. **Solving a REAL problem** - From discovery answers, not hypothetical
3. **Monetizable** - Clear path to revenue (subscription/one-time/usage)
4. **Feasible for solo dev** - No need for team, heavy marketing, or funding

---

## EXECUTION SEQUENCE:

### 1. Analyze Discovery Answers

**Review all categories:**
- `{discovery_answers.manual_tasks}` → Automation opportunities
- `{discovery_answers.work_pain_points}` → B2B opportunities
- `{discovery_answers.paid_tools}` → Simplification opportunities
- `{discovery_answers.community_problems}` → Niche community tools
- `{discovery_answers.spreadsheet_tools}` → App conversion opportunities
- `{discovery_answers.previous_project_insights}` → Technical gap opportunities

**Look for patterns:**
- Problems mentioned multiple times
- Pain points with existing paid solutions
- Niche markets with underserved needs

### 2. Generate 3-6 Ideas

**For each idea, define:**

| Field | Description |
|-------|-------------|
| **Name** | Catchy, memorable name suggestion |
| **Sector** | Industry/domain (e.g., Productivity, Content, Community, Finance) |
| **Core Feature** | THE ONE thing it does (MVP focus) |
| **Target** | B2B / B2C / Both |
| **Business Model** | Subscription / One-time / Usage-based |
| **Source** | Which discovery answer inspired this |
| **Difficulty** | 🟢 Easy / 🟡 Medium / 🔴 Hard (with Claude Code) |

### 3. Present Ideas Table

**Display in `{user_language}`:**
```
💡 Based on what you told me, here are 3-6 SaaS ideas:

| # | Name | Sector | Core Feature | B2B/B2C | Business Model | Difficulty |
|---|------|--------|--------------|---------|----------------|------------|
| 1 | {name} | {sector} | {feature} | {target} | {model} | 🟢 |
| 2 | {name} | {sector} | {feature} | {target} | {model} | 🟡 |
| ... | ... | ... | ... | ... | ... | ... |

**Quick descriptions:**

**1. {Name}** - {2-3 sentence description of what it does and why it solves your problem}

**2. {Name}** - {2-3 sentence description}

...
```

### 4. Add Context for Each Idea

**For each idea, briefly explain:**
- Why this came from their answers
- Why it's buildable in 2 weeks
- Who would pay for it

### 5. Let User Choose

Use AskUserQuestion:
```yaml
questions:
  - header: "Choose"
    question: "Which idea interests you the most?"
    options:
      - label: "Idea 1: {name}"
        description: "{one-line summary}"
      - label: "Idea 2: {name}"
        description: "{one-line summary}"
      - label: "Idea 3: {name}"
        description: "{one-line summary}"
      # Add more if generated
      - label: "None - I have my own"
        description: "I want to propose a different idea"
    multiSelect: false
```

### 6. Handle User Response

**If user selects an idea:**
- Store in `{selected_idea}`
- Proceed to validation

**If user selects "None - I have my own":**
- Ask: "Tell me about your idea. What problem does it solve and for whom?"
- Store their description in `{selected_idea}`
- Proceed to validation

**If user wants to go back:**
- Return to step-01-discovery.md
- Ask for more context

### 7. Save to idea.md (if save_mode)

**Append to `{output_dir}/idea.md`:**
```markdown
## Brainstormed Ideas

| # | Name | Sector | Core Feature | B2B/B2C | Business Model |
|---|------|--------|--------------|---------|----------------|
{table rows}

### Selected Idea: {selected_idea.name}

**Why this one:**
{user's choice or their own idea description}

---
*Brainstorm completed: {timestamp}*
```

### 8. Transition Message

**Display in `{user_language}`:**
```
Great choice! Now let's validate "{selected_idea.name}" by:
- Researching competitors
- Challenging the idea honestly
- Defining the details

This is the most important step - we'll make sure this idea is worth building.
```

---

## IDEA DIVERSITY GUIDELINES:

**Ensure variety across:**
- Sectors (don't generate 4 productivity tools)
- Business models (mix subscription, one-time, usage)
- Difficulty levels (include at least 1 easy option)
- Target markets (mix B2B and B2C)

**Prioritize ideas that:**
- Come directly from user's pain points
- Have obvious monetization paths
- Don't require complex integrations
- User would actually use themselves

---

## SUCCESS METRICS:

✅ 3-6 ideas generated (not more, not less)
✅ Each idea has all required fields filled
✅ Ideas are diverse in sector and business model
✅ Ideas directly relate to discovery answers
✅ User successfully selected or proposed an idea
✅ Selection saved to idea.md (if save_mode)

## FAILURE MODES:

❌ Generating generic ideas not tied to discovery
❌ Generating too many or too few ideas
❌ Doing competitor research in this step
❌ Not providing enough context for each idea
❌ **CRITICAL**: Not using AskUserQuestion for selection
❌ **CRITICAL**: Not responding in user's detected language

## BRAINSTORM PROTOCOLS:

- Be creative but realistic
- Tie every idea to something user mentioned
- Don't oversell - be honest about difficulty
- Include at least one "simple but useful" option
- Make names catchy and memorable

---

## NEXT STEP:

After user selects an idea via AskUserQuestion, load `./step-03-validate.md`

**If user wants different ideas:**
- Generate 3-6 NEW ideas with different approaches
- Or return to step-01-discovery.md for more context

<critical>
Remember: This step is ONLY about generating and selecting ideas - don't validate or research yet!
</critical>
