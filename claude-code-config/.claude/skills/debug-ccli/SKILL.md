---
name: debug-ccli
description: Debug Claude CLI errors by analyzing debug logs, hook logs, and security logs, then fix all problems. Use when Claude CLI has errors, MCP plugins fail, hooks crash, or commands are blocked.
---

# Debug Claude CLI

Analyze all Claude CLI debug logs to identify errors, failures, and exceptions, then fix all problems found.

## Dynamic Context

### Debug Session Logs (most recent first)
!`ls -lt ~/.claude/debug/*.txt 2>/dev/null | head -10`

### Current Session Log
!`cat ~/.claude/debug/latest 2>/dev/null | tail -100`

### Auto-Rename Hook Log
!`cat ~/.claude/scripts/auto-rename-session/debug.log 2>/dev/null | tail -50`

### Command Validator Security Log
!`cat ~/.claude/scripts/command-validator/data/security.log 2>/dev/null | tail -50`

### Errors in Debug Logs
!`grep -ri "error\|fail\|exception\|not found\|invalid\|denied\|refused" ~/.claude/debug/ 2>/dev/null | tail -100`

### Errors in Hook Logs
!`grep -i "error\|fail\|exception" ~/.claude/scripts/auto-rename-session/debug.log 2>/dev/null | tail -30`

### Security Issues
!`grep -i "blocked\|denied\|suspicious\|rejected" ~/.claude/scripts/command-validator/data/security.log 2>/dev/null | tail -30`

## Log Locations

| Path | Description |
|------|-------------|
| `~/.claude/debug/` | Debug logs per session (.txt files with UUID) |
| `~/.claude/debug/latest` | Symlink to current session log |
| `~/.claude/scripts/auto-rename-session/debug.log` | Auto-rename hook log |
| `~/.claude/scripts/command-validator/data/security.log` | Command validator security log |

## Process

1. Read all dynamic context above
2. Read the 3 most recent UUID .txt files in `~/.claude/debug/`
3. Check `~/.claude/debug/latest` for active issues
4. Analyze `auto-rename-session/debug.log` for hook failures
5. Review `command-validator/data/security.log` for blocked commands
6. Search for error patterns: `error`, `fail`, `exception`, `not found`, `invalid`, `blocked`, `denied`, `rejected`
7. Categorize issues:
   - **Plugin errors** - MCP plugins not loading, plugin-not-found
   - **Hook errors** - auto-rename failures, hook crashes
   - **Security blocks** - commands blocked by validator
   - **Configuration errors** - invalid settings, missing files
   - **Network errors** - API/connection issues
   - **Permission errors** - file access denied
8. Fix ALL issues found (identify root cause, apply fix, verify)

## Common Fixes

**Plugin not found**: Check `~/.claude/plugins/installed_plugins.json`, verify plugin exists, re-install if needed.

**Hook failures**: Check script permissions (`chmod +x`), verify dependencies, check hook config in `settings.json`.

**Security blocks**: Review blocked command pattern, update command-validator rules if false positive, add to allowlist if legitimate.

**Configuration errors**: Validate JSON syntax, check required fields, reset to defaults if corrupted.

## Success Criteria

- All 4 log locations checked
- All errors identified and categorized
- Root cause found for each error
- ALL issues fixed (not just proposed)
- Verification that fixes work
