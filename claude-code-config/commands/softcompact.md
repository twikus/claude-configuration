---
description: Compress a session transcript by removing redundant content while preserving conversation flow
argument-hint: [session-id]
allowed-tools: Skill(softcompact), Bash, Read
---

<objective>
Delegate session compression to the softcompact skill, which intelligently reduces Claude Code session transcript size by removing redundant tool uses, simplifying verbose assistant messages, and eliminating large MCP outputs while preserving all user messages and conversation continuity.
</objective>

<process>
1. If session ID provided in args, use it directly
2. Otherwise, help user find their session using the find-session utility
3. Use Skill tool to invoke softcompact skill
4. Let skill handle the compression workflow with scripts
5. Report compression statistics and new session ID
</process>

<success_criteria>
- Session successfully compressed
- New session ID provided to user (original ending changed to "AA")
- Compression ratio reported (target: 35-80% reduction)
- User can continue conversation with compacted session
</success_criteria>
