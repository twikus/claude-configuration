# Auto-Rename Session - Project Memory

Automatically generates meaningful titles for Claude Code sessions using AI.

## How It Works

1. **Hook Trigger**: Claude Code's `Stop` hook runs `index.ts`
2. **Parse Transcript**: Extracts first user message and assistant response
3. **Skip if Titled**: Checks for existing `custom-title` in transcript
4. **Generate Title**: Calls Claude Haiku via `generateTextCC`
5. **Write to Transcript**: Appends `{"type":"custom-title","customTitle":"..."}` line

## Commands

```bash
bun run auto-rename:start      # Run the hook handler
bun run auto-rename:rename-all # Batch rename all sessions in a project
bun run auto-rename:test       # Run tests
```

## Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Hook entry point, spawns worker |
| `src/worker.ts` | Calls AI, writes title to transcript |
| `src/shared.ts` | `buildPrompt`, `parseTitle`, `extractTextContent` |
| `src/rename-all.ts` | CLI to batch-rename old sessions |

## Hook Configuration

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [{
      "command": "bun /path/to/auto-rename-session/src/index.ts"
    }]
  }
}
```

## Title Generation Rules

- 2-5 words, starts with verb
- Always in English (even for non-English input)
- Examples: "Build React Auth", "Debug API Error", "Fix Code Bug"

## Testing

```bash
bun test auto-rename-session/__tests__/shared.test.ts         # Unit tests
bun test auto-rename-session/__tests__/title-generation.test.ts  # Integration (real API)
```

## Dependencies

- Uses `../../claude-code-ai/claude.ts` for API calls
- Uses `../../claude-code-ai/helper/paths.ts` for cross-platform paths
