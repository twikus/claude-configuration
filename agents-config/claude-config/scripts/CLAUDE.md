# Statusline Scripts - Project Memory

Claude Code statusline utility using Bun and TypeScript.

## Structure

```
scripts/
├── statusline/   # Custom statusline for Claude Code
└── package.json  # Root package with statusline commands
```

## Commands

```bash
bun run test              # Run statusline tests
bun run lint              # Lint statusline scripts
```

### Statusline Commands

| Command | Purpose |
|---------|---------|
| `bun run statusline:start` | Run the Claude Code statusline |
| `bun run statusline:test` | Run statusline tests |
| `bun run statusline:config` | Open interactive statusline config |
| `bun run statusline:stats` | Show local statusline stats |

## Cross-Platform Support

Statusline scripts support macOS, Linux, and Windows via WSL:
- Use `path.join()` instead of string concatenation
- Use `os.homedir()` instead of `process.env.HOME`
- Use `path.sep` or regex `[/\\]` for path splitting

## Shared Dependencies

- `picocolors` - Terminal colors
- `table` - CLI tables for spend commands
- `@biomejs/biome` - Linting/formatting
- `bun:test` - Testing

## Credentials

Claude Code OAuth tokens are retrieved directly by the statusline limits module:
- macOS: Keychain (`security find-generic-password`)
- Linux/Windows: `~/.claude/.credentials.json`
