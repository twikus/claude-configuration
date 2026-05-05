---
name: setup-tmux
description: "Setup tmux with Melvyn's config on any machine or IDE terminal. Use when setting up tmux, configuring tmux, or when user mentions tmux setup."
allowed-tools:
  - Bash
  - Read
  - Write
---

# Setup Tmux

Install and configure tmux with a custom config: Ctrl+A prefix, mouse support, minimal status bar, TPM plugins (resurrect, continuum, yank), and intuitive keybindings.

## Setup

Run the setup script:

```bash
bash ~/.claude/skills/setup-tmux/scripts/setup-tmux.sh
```

The script handles everything automatically:
1. Install tmux if missing (supports brew, apt, dnf, pacman)
2. Backup existing `~/.tmux.conf`
3. Write the config
4. Install TPM + plugins
5. Reload config if tmux is running

## IDE Integration

After running the setup script, configure the IDE terminal to use tmux:

**VS Code / Cursor** - Add to `settings.json`:
```json
{
  "terminal.integrated.profiles.osx": {
    "tmux": {
      "path": "tmux",
      "args": ["new-session", "-A", "-s", "main"]
    }
  },
  "terminal.integrated.defaultProfile.osx": "tmux"
}
```

For Linux, replace `osx` with `linux`.

**Zed** - Add to `settings.json`:
```json
{
  "terminal": {
    "shell": {
      "program": "tmux",
      "args": ["new-session", "-A", "-s", "main"]
    }
  }
}
```

**Warp / iTerm2 / Alacritty / Kitty** - Add to shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
if command -v tmux &>/dev/null && [[ -z "$TMUX" ]]; then
  tmux new-session -A -s main
fi
```

## Key Bindings Reference

| Action | Binding |
|---|---|
| Prefix | `Ctrl+A` |
| Split horizontal | `Prefix + s` |
| Split vertical | `Prefix + v` |
| New window | `Prefix + c` |
| Kill pane | `Prefix + w` |
| Rename window | `Prefix + r` |
| Copy mode | `Prefix + f` |
| List all keys | `Prefix + h` |
| Switch panes | `Alt + Arrow` |
| Switch windows | `Shift + Arrow` |
| Detach | `Prefix + d` |

## Plugins

- **tmux-resurrect** - Persist sessions across restarts
- **tmux-continuum** - Auto-save/restore sessions
- **tmux-yank** - System clipboard integration

Install plugins inside tmux: `Prefix + I`
