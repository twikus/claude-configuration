---
description: Ultra-fast search for instant answers - maximum speed, minimal tokens
argument-hint: <question>
model: haiku
allowed-tools: [Grep, Read]
---

<objective>
Answer the question as fast as possible using minimal token and tool usage.

This is optimized for instant answers to specific questions like "quel fichier gère l'authentification?" - no deep analysis, just fast results.
</objective>

<process>
1. **SEARCH**: Single targeted Grep search
   - Extract THE most specific search term from question
   - One Grep call with precise pattern
   - **CRITICAL**: No parallel searches - one shot only

2. **READ**: Minimal file reading
   - Read ONLY the single most relevant file found
   - Scan for exact answer location
   - **SPEED RULE**: 1 file maximum

3. **ANSWER**: Instant response
   - Direct answer with file path and line number
   - Format: `file.ts:42`
   - **NO explanations** - just the answer
</process>

<success_criteria>
- Question answered in under 10 seconds
- Single Grep search executed
- Maximum 1 file read
- Answer includes file:line reference
- Ultra-concise response (1-2 sentences max)
</success_criteria>

---

User: #$ARGUMENTS
