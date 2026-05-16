---
name: explore
description: Fast exploration of codebase, documentation, and web. Use when understanding code structure, researching libraries, or gathering context for implementation.
argument-hint: <query>
context: fork
agent: haiku
---

# Explore

Fast context gathering combining codebase search, documentation lookup, and web research.

## Query Modes

Detect mode from query:

| Pattern | Mode | Primary Tools |
|---------|------|---------------|
| "how does X work", code paths, files | **Codebase** | Grep, Glob, Read |
| library names, APIs, frameworks | **Docs** | Context7, Exa |
| current events, external services | **Web** | WebSearch, Exa |
| mixed/unclear | **Hybrid** | All tools |

## Execution

### Codebase Mode

```
1. Grep with broad keywords → find entry points
2. Glob for related files → patterns like **/*auth*.ts
3. Read key files → understand context
4. Follow imports → map dependencies
```

**Optimized queries:**
- Function: `functionName\s*[=:(]`
- Component: `(function|const)\s+ComponentName`
- Import chain: `from ['"].*moduleName`
- Type/interface: `(type|interface)\s+TypeName`

### Docs Mode

```
1. mcp__context7__resolve-library-id → get library ID
2. mcp__context7__query-docs → fetch relevant docs
3. Extract: setup, APIs, examples, patterns
```

**If Context7 lacks info**, use Exa:
- `mcp__exa__get_code_context_exa` for code examples (max 2-3 calls, 0.05$/call)

### Web Mode

```
1. WebSearch with specific keywords
2. WebFetch on authoritative sources
3. Summarize key findings
```

**Or use Exa:**
- `mcp__exa__web_search_exa` for comprehensive search

### Hybrid Mode

Run searches in parallel:
1. Grep/Glob for codebase matches
2. Context7 for library docs
3. WebSearch for external context

## Output Format

**CRITICAL**: Output all findings directly. NEVER create files.

### Findings

<codebase>
**[File Path]** (lines X-Y)
- Purpose: [what it does]
- Key code: [relevant snippet or description]
- Connects to: [related files/features]
</codebase>

<documentation>
**[Library/API]**
- Setup: [installation/config]
- Key APIs: [functions/methods]
- Example:
```
[code snippet]
```
</documentation>

<web>
**[Topic]**
- Summary: [key information]
- Source: [URL]
</web>

### Connections

- [How pieces fit together]
- [Patterns discovered]
- [Dependencies/relationships]

### Gaps

- [Missing information needing follow-up]

## Rules

- **Speed first**: Use parallel searches when possible
- **Cost aware**: Context7 before Exa, limit Exa to 2-3 calls
- **Targeted**: Extract only what's relevant to the query
- **No files**: Output everything in response, never create markdown files
- **Source everything**: Include file paths, URLs, library IDs

## Query

$ARGUMENTS
