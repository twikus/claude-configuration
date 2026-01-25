---
name: save-docs
description: Fetch library documentation using Context7 MCP and save to .claude/output/docs/
allowed-tools: Write, Bash(mkdir :*)
argument-hint: <library> <topic>
---

# Save Docs

Fetch documentation for a library/topic and save it locally for future reference.

## Workflow

1. **PARSE REQUEST**: Extract library and topic
   - Example: `shadcn ui button` → library: `shadcn`, topic: `button`
   - Example: `react hooks` → library: `react`, topic: `hooks`

2. **RESOLVE LIBRARY**: Use `mcp__context7__resolve-library-id`
   - Search for the library name
   - Get the Context7-compatible library ID
   - Example: `shadcn` → `/shadcn-ui/ui`

3. **FETCH DOCS**: Use `mcp__context7__query-docs`
   - Query with the resolved library ID
   - Include the specific topic in the query
   - Request comprehensive documentation with examples

4. **CREATE OUTPUT DIRECTORY**:
   ```bash
   mkdir -p .claude/output/docs
   ```

5. **SAVE DOCUMENTATION**: Write to file
   - Filename: `{library}-{topic}.md` (kebab-case)
   - Example: `.claude/output/docs/shadcn-button.md`
   - Include: API reference, usage examples, configuration options

## File Format

```markdown
# {Library} - {Topic}

> Source: Context7 documentation

## Overview
[Brief description]

## Usage
[Code examples]

## API Reference
[Props, methods, options]

## Examples
[Working code snippets]
```

## Examples

| Command | Output File |
|---------|-------------|
| `/save-docs shadcn button` | `.claude/output/docs/shadcn-button.md` |
| `/save-docs react useEffect` | `.claude/output/docs/react-useeffect.md` |
| `/save-docs nextjs app router` | `.claude/output/docs/nextjs-app-router.md` |

## Rules

- ALWAYS resolve library ID first with `resolve-library-id`
- ALWAYS create output directory before writing
- Use kebab-case for filenames
- Include code examples from documentation
- Keep documentation concise but complete

User: $ARGUMENTS
