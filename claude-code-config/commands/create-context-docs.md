---
description: Deep research and create context documentation in .claude/docs/ for quick future reference
argument-hint: <topic-or-library>
model: opus
---

<objective>
Create comprehensive documentation files in `.claude/docs/` by performing deep multi-source research on "#$ARGUMENTS".

This command enables rapid context loading for future sessions without needing to re-research topics. The generated docs serve as cached knowledge that can be referenced with `@.claude/docs/topic-name.md`.
</objective>

<workflow>

## Phase 1: Location Selection

**FIRST**: Ask the user where to save the documentation using AskUserQuestion:

```
Question: "Where should I save the documentation?"
Options:
- "Global (~/.claude/docs/)" - Available across all projects
- "Project (.claude/docs/)" - Project-specific, committed to git
```

**Create the docs directory** if it doesn't exist at the chosen location.

## Phase 2: Deep Multi-Source Research

**CRITICAL**: Launch 3-4 agents IN PARALLEL in a SINGLE message for comprehensive coverage:

### Agent 1: Documentation Research (explore-docs)

```
Task(subagent_type="explore-docs", prompt="
Research official documentation for: #$ARGUMENTS

Focus on:
- Core concepts and architecture
- API reference and key functions
- Configuration options
- Best practices from official docs

Use Context7 MCP to get the most up-to-date documentation.
Return structured findings with code examples.
")
```

### Agent 2: Web Deep Search (websearch)

```
Task(subagent_type="websearch", prompt="
Deep web search for: #$ARGUMENTS

Search for:
- Latest tutorials and guides (2024-2025)
- Common patterns and anti-patterns
- Real-world usage examples
- Performance tips and gotchas
- Community best practices

Use Exa for deep search and WebSearch for broad coverage.
Focus on high-quality sources: official blogs, reputable tech sites, GitHub discussions.
Return key insights with source URLs.
")
```

### Agent 3: Code Examples Research (explore-docs)

```
Task(subagent_type="explore-docs", prompt="
Find practical code examples for: #$ARGUMENTS

Focus on:
- Getting started examples
- Common use cases with code
- Advanced patterns
- Integration examples
- Testing patterns

Use mcp__exa__get_code_context_exa for code-focused results.
Return working code snippets with explanations.
")
```

### Agent 4: Edge Cases & Troubleshooting (websearch)

```
Task(subagent_type="websearch", prompt="
Research problems and solutions for: #$ARGUMENTS

Search for:
- Common errors and fixes
- Edge cases and limitations
- Migration guides if applicable
- Debugging tips
- Known issues and workarounds

Focus on Stack Overflow, GitHub issues, and official troubleshooting docs.
Return actionable solutions.
")
```

## Phase 3: Ultra-Think Synthesis

After all agents return, use extended thinking to:

1. **Merge and deduplicate** information from all sources
2. **Organize hierarchically** from basics to advanced
3. **Validate consistency** across sources
4. **Extract actionable patterns** vs theoretical knowledge
5. **Identify gaps** and note areas needing more research

## Phase 4: Generate Documentation File

Create the documentation file with this structure:

```markdown
# [Topic Name] - Context Documentation

> Generated: [date] | Sources: Official docs, Web research, Code examples
> Quick load: `@.claude/docs/[filename].md`

## Overview

[2-3 paragraph executive summary of what this is and why it matters]

## Core Concepts

### [Concept 1]

[Explanation with code example]

### [Concept 2]

[Explanation with code example]

## Quick Start

\`\`\`[language]
// Minimal working example
\`\`\`

## API Reference

### Key Functions/Methods

| Function | Description  | Example     |
| -------- | ------------ | ----------- |
| `func()` | What it does | `func(arg)` |

## Common Patterns

### Pattern 1: [Name]

\`\`\`[language]
// Pattern implementation
\`\`\`

### Pattern 2: [Name]

\`\`\`[language]
// Pattern implementation
\`\`\`

## Configuration

\`\`\`[language]
// Configuration example with comments
\`\`\`

## Best Practices

- **Do**: [Recommended approach]
- **Don't**: [Anti-pattern to avoid]
- **Why**: [Reasoning]

## Troubleshooting

### Common Error: [Error Name]

**Problem**: [Description]
**Solution**: [Fix]

### Common Error: [Error Name 2]

**Problem**: [Description]
**Solution**: [Fix]

## Advanced Topics

[Deeper dive into complex features]

## Integration Examples

### With [Technology A]

\`\`\`[language]
// Integration code
\`\`\`

## Resources

- [Official Docs](url)
- [Best Tutorial](url)
- [GitHub Repo](url)

---

_Last researched: [date] | Re-run `/create-context-docs #$ARGUMENTS` to update_
```

</workflow>

<execution_rules>

1. **ALWAYS ask location first** - Never assume global or project
2. **PARALLEL AGENTS** - Launch all 4 agents in ONE message for speed
3. **DEEP SEARCH** - Use Exa with `type: "deep"` for thorough results
4. **CODE FOCUS** - Prioritize working code examples over theory
5. **RECENT INFO** - Filter for 2024-2025 content when relevant
6. **VALIDATE** - Cross-reference findings across sources
7. **FILENAME** - Use kebab-case: `nextjs-app-router.md`, `prisma-schema.md`

</execution_rules>

<success_criteria>

- Documentation file created at chosen location
- Contains working code examples
- Covers basics to advanced topics
- Includes troubleshooting section
- Has clear quick-start section
- Sources are cited
- File is immediately usable as context reference
  </success_criteria>

<output>
File created: `[~/.claude | .claude]/docs/[topic-name].md`

Usage: `@.claude/docs/[topic-name].md` to load as context in future conversations
</output>
