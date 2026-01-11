---
description: Debug Claude CLI errors by analyzing all debug logs and fixing problems
---

<objective>
Analyze all Claude CLI debug logs to identify errors, failures, and exceptions, then automatically fix all problems found.

This helps quickly diagnose and resolve issues with Claude CLI, MCP plugins, hooks, and related configurations.
</objective>

<context>
## Debug Session Logs (most recent first)
!`ls -lt ~/.claude/debug/*.txt 2>/dev/null | head -10`

## Current Session Log (symlink)
!`cat ~/.claude/debug/latest 2>/dev/null | tail -100`

## Auto-Rename Hook Log
!`cat ~/.claude/scripts/auto-rename-session/debug.log 2>/dev/null | tail -50`

## Command Validator Security Log
!`cat ~/.claude/scripts/command-validator/data/security.log 2>/dev/null | tail -50`

## Errors in Debug Logs
!`grep -ri "error\|fail\|exception\|not found\|invalid\|denied\|refused" ~/.claude/debug/ 2>/dev/null | tail -100`

## Errors in Hook Logs
!`grep -i "error\|fail\|exception" ~/.claude/scripts/auto-rename-session/debug.log 2>/dev/null | tail -30`

## Security Issues
!`grep -i "blocked\|denied\|suspicious\|rejected" ~/.claude/scripts/command-validator/data/security.log 2>/dev/null | tail -30`
</context>

<log_locations>
| Chemin | Description |
|--------|-------------|
| ~/.claude/debug/ | Logs de debug par session (fichiers .txt avec UUID) |
| ~/.claude/debug/latest | Lien symbolique vers le log de session actuel |
| ~/.claude/scripts/auto-rename-session/debug.log | Log du hook auto-rename |
| ~/.claude/scripts/command-validator/data/security.log | Log de sécurité des commandes validées |
</log_locations>

<process>
1. **Collect all logs** - Read from all 4 log locations listed above
2. **Read recent debug session files** - Focus on the 3 most recent UUID .txt files in ~/.claude/debug/
3. **Read current session** - Check ~/.claude/debug/latest for active issues
4. **Check hook logs** - Analyze auto-rename-session/debug.log for hook failures
5. **Check security logs** - Review command-validator security.log for blocked commands
6. **Search for error patterns**:
   - `error` / `Error` / `ERROR`
   - `fail` / `failed` / `failure`
   - `exception` / `Exception`
   - `not found` / `plugin-not-found`
   - `invalid` / `Invalid`
   - `blocked` / `denied` / `rejected`
7. **Categorize issues**:
   - **Plugin errors** - MCP plugins not loading, plugin-not-found
   - **Hook errors** - auto-rename failures, hook crashes
   - **Security blocks** - commands blocked by validator
   - **Configuration errors** - invalid settings, missing files
   - **Network errors** - API/connection issues
   - **Permission errors** - file access denied
8. **FIX ALL ISSUES** - For each error found:
   - Identify the root cause
   - Apply the fix immediately
   - Verify the fix worked
</process>

<resolution_actions>
Common fixes to apply:

**Plugin not found**:
- Check ~/.claude/plugins/installed_plugins.json
- Verify plugin exists in marketplace
- Re-install plugin if needed

**Hook failures**:
- Check hook script permissions (chmod +x)
- Verify hook dependencies installed
- Check hook configuration in settings.json

**Security blocks**:
- Review blocked command pattern
- Update command-validator rules if false positive
- Add command to allowlist if legitimate

**Configuration errors**:
- Validate JSON syntax in config files
- Check for missing required fields
- Reset to defaults if corrupted
</resolution_actions>

<success_criteria>
- All 4 log locations checked
- All errors identified and categorized
- Root cause found for each error
- ALL issues fixed (not just proposed)
- Verification that fixes work
</success_criteria>
