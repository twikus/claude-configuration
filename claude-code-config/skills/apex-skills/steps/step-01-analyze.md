---
name: step-01-analyze
description: Deep context gathering - explore codebase, docs, and web for comprehensive understanding
next_step: steps/step-02-plan.md
---

# Step 1: Analyze (Context Gathering)

**Goal:** Gather ALL relevant context before implementation. Missing context causes failed implementations.

---

<available_state>
From SKILL.md entry point:

- `{task_description}` - What to implement
- `{auto_mode}` - If true, skip confirmations and use recommended options
- `{auto_review}` - If true, auto-proceed to review after validation
</available_state>

---

<execution_sequence>

<parse_request>
**1. Parse User Request**

Extract from user input:
- **Scope**: What exactly needs to be built
- **Boundaries**: What is NOT in scope
- **Constraints**: Technical or business requirements
- **Preferences**: User-stated approaches

**Infer Acceptance Criteria:**
```
**Inferred AC:**
- [ ] AC 1: [specific measurable outcome]
- [ ] AC 2: [specific measurable outcome]
```
</parse_request>

<ultra_think>
**2. ULTRA THINK: Plan Analysis Strategy**

**CRITICAL: Know EXACTLY what to search for before launching agents.**

Create mental checklist:
- [ ] Key concepts and terms to search
- [ ] Files likely to be modified
- [ ] Patterns to look for in existing code
- [ ] Libraries/APIs that might be involved
- [ ] Similar existing features to use as examples
</ultra_think>

<parallel_agents>
**3. Launch Parallel Analysis Agents**

**CRITICAL: Launch ALL agents in a SINGLE message for parallel execution.**

**Agent 1: Codebase Exploration** (`explore-codebase`)
```
Explore the codebase to find context for: {task_description}

Find:
1. Similar implementations to use as examples
2. Files that will likely need modification
3. Existing patterns and conventions used
4. Related utilities and helpers
5. Test patterns for similar features

Return file paths with line numbers (e.g., `src/auth.ts:42`)
```

**Agent 2: Documentation Research** (`explore-docs`)
```
Research documentation for: {task_description}

Find:
1. API documentation for relevant libraries
2. Best practices for the tools being used
3. Code examples from official docs
4. Migration guides if applicable

Focus on practical implementation guidance.
```

**Agent 3: Web Research** (`websearch`)
```
Search for: {task_description}

Find:
1. Latest approaches and solutions
2. Community examples and patterns
3. Architectural guidance
4. Common pitfalls to avoid

Focus on recent, high-quality sources.
```
</parallel_agents>

<synthesize>
**4. Synthesize Findings**

Combine findings from all agents:

**Codebase Context:**
- Similar implementations found
- Files to modify with line numbers
- Patterns to follow
- Helper utilities available

**Documentation Insights:**
- API patterns to use
- Best practices
- Configuration requirements

**Research Findings:**
- Recommended approaches
- Pitfalls to avoid
- Community patterns
</synthesize>

<present>
**5. Present Context Summary**

```
**Context Gathered:**

**Files to modify:**
- `path/file.ts:line` - Purpose/reason

**Patterns identified:**
- Pattern name (from `example/file.ts:line`)

**Dependencies:**
- External: [libraries]
- Internal: [modules]

**Similar implementations found:**
- `path/similar.ts` - Can use as reference

**Inferred Acceptance Criteria:**
- [ ] AC 1
- [ ] AC 2
```

**NO CONFIRMATION NEEDED** - Proceed directly to planning.
</present>

</execution_sequence>

---

<success_metrics>

- Files to modify identified with line numbers
- Patterns documented with examples
- Dependencies noted
- Acceptance criteria defined
</success_metrics>

<failure_modes>

- Not identifying specific files to modify
- Missing obvious patterns in existing code
- Launching agents without clear search strategy
- Launching agents sequentially instead of parallel
</failure_modes>

---

<next_step_directive>
**CRITICAL:** After presenting context summary, immediately state:

"**NEXT:** Loading `step-02-plan.md`"

Then load and execute `steps/step-02-plan.md`.
</next_step_directive>
