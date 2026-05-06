# Claude Code AI - Project Memory

Shared utilities for accessing Claude API using Claude Code's OAuth credentials.

## Purpose

Provides a unified way to:
1. Retrieve Claude Code OAuth tokens (cross-platform)
2. Make authenticated API calls to Claude models
3. Handle common path operations for Claude config

## Files

```
claude-code-ai/
├── claude.ts           # Main API: generateTextCC()
├── helper/
│   ├── credentials.ts  # getClaudeCodeToken(), getClaudeCodeTokenSafe()
│   ├── paths.ts        # getHomeDir(), getClaudeConfigDir(), encodeProjectPath()
│   └── index.ts        # Re-exports all helpers
└── __tests__/
    ├── claude.test.ts  # Integration tests (real API calls)
    └── paths.test.ts   # Unit tests for path helpers
```

## Usage

### Generate Text with Claude

```typescript
import { generateTextCC } from "../claude-code-ai/claude";

const response = await generateTextCC({
  prompt: "Your prompt here",
  model: "haiku",  // "haiku" | "sonnet" | "opus"
  system: "Optional system prompt",
});
```

### Get OAuth Token

```typescript
import { getClaudeCodeToken, getClaudeCodeTokenSafe } from "../claude-code-ai/helper";

const token = await getClaudeCodeToken();     // Throws on error
const token = await getClaudeCodeTokenSafe(); // Returns null on error
```

### Cross-Platform Paths

```typescript
import {
  getHomeDir,
  getClaudeConfigDir,
  getClaudeProjectsDir,
  encodeProjectPath
} from "../claude-code-ai/helper";

const home = getHomeDir();                    // Works on all platforms
const configDir = getClaudeConfigDir();       // ~/.config/claude or ~/.claude
const projectPath = encodeProjectPath("/Users/me/myproject");
```

## Credential Storage

| Platform | Location |
|----------|----------|
| macOS | Keychain (`security find-generic-password -s "Claude Code-credentials"`) |
| Linux | `~/.claude/.credentials.json` |
| Windows | WSL required, uses Linux path |

## Testing

```bash
bun run ai:test  # Runs all tests (includes real API calls, ~15s)
```

## Models

| Model | ID |
|-------|-----|
| haiku | `claude-haiku-4-5-20251001` |
| sonnet | `claude-sonnet-4-5-20250929` |
| opus | `claude-opus-4-5-20251101` |
