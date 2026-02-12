#!/bin/bash
set -euo pipefail

TMUX_CONF="$HOME/.tmux.conf"
TPM_DIR="$HOME/.tmux/plugins/tpm"

echo "=== Tmux Setup ==="

# 1. Check if tmux is installed
if ! command -v tmux &>/dev/null; then
  echo "tmux not found. Installing..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install tmux
  elif command -v apt-get &>/dev/null; then
    sudo apt-get update && sudo apt-get install -y tmux
  elif command -v dnf &>/dev/null; then
    sudo dnf install -y tmux
  elif command -v pacman &>/dev/null; then
    sudo pacman -S --noconfirm tmux
  else
    echo "ERROR: Could not detect package manager. Install tmux manually."
    exit 1
  fi
  echo "tmux installed: $(tmux -V)"
else
  echo "tmux already installed: $(tmux -V)"
fi

# 2. Backup existing config if present
if [[ -f "$TMUX_CONF" ]]; then
  BACKUP="$TMUX_CONF.backup.$(date +%Y%m%d%H%M%S)"
  cp "$TMUX_CONF" "$BACKUP"
  echo "Existing config backed up to: $BACKUP"
fi

# 3. Write tmux config
cat > "$TMUX_CONF" << 'TMUXCONF'
# Mouse
set -g mouse on

# Start at 1
set -g base-index 1
setw -g pane-base-index 1

# Prefix = Ctrl+A
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Visual feedback when prefix is pressed
set -g status-left '#{?client_prefix,#[fg=green bold] TMUX ,}'

# Actions (Ctrl+A then...)
unbind d
bind d detach-client
bind c new-window -c "#{pane_current_path}"
bind s split-window -h -c "#{pane_current_path}"
bind v split-window -v -c "#{pane_current_path}"
bind w kill-pane
bind r command-prompt -I "#W" "rename-window '%%'; setw automatic-rename on"
bind f copy-mode
bind h list-keys

# Switch panes (no prefix)
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Switch windows (no prefix)
bind -n S-Left previous-window
bind -n S-Right next-window

# Settings
set -g allow-passthrough on
set -g history-limit 50000
set -sg escape-time 0
set -g default-terminal "screen-256color"
set -ag terminal-overrides ",xterm-256color:RGB"
set -g renumber-windows on

# Minimal status bar
set -g status-position bottom
set -g status-style 'bg=default fg=#555555'
set -g status-right '#[fg=#555555]#S'
set -g allow-rename on
set -g set-titles on
set -g set-titles-string '#{pane_title}'
setw -g automatic-rename on
setw -g automatic-rename-format '#{pane_title}'
setw -g window-status-format '#[fg=#555555] #I:#W'
setw -g window-status-current-format '#[fg=white,bold] #I:#W'
set -g status-justify left

# Pane borders
set -g pane-border-style 'fg=#333333'
set -g pane-active-border-style 'fg=#555555'

# Plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @plugin 'tmux-plugins/tmux-yank'

set -g @resurrect-capture-pane-contents 'on'
set -g @continuum-restore 'on'

run '~/.tmux/plugins/tpm/tpm'
TMUXCONF

echo "Config written to $TMUX_CONF"

# 4. Install TPM if not present
if [[ ! -d "$TPM_DIR" ]]; then
  echo "Installing TPM (Tmux Plugin Manager)..."
  git clone https://github.com/tmux-plugins/tpm "$TPM_DIR"
  echo "TPM installed."
else
  echo "TPM already installed."
fi

# 5. Install plugins via TPM
echo "Installing tmux plugins..."
"$TPM_DIR/bin/install_plugins" 2>/dev/null || echo "Note: Plugin install requires tmux server. Run 'prefix + I' inside tmux to install plugins."

# 6. Reload config if tmux is running
if tmux list-sessions &>/dev/null; then
  tmux source-file "$TMUX_CONF"
  echo "Config reloaded in running tmux server."
else
  echo "No tmux server running. Config will apply on next tmux start."
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Key bindings:"
echo "  Prefix:         Ctrl+A"
echo "  Split horiz:    Prefix + s"
echo "  Split vert:     Prefix + v"
echo "  New window:     Prefix + c"
echo "  Kill pane:      Prefix + w"
echo "  Rename window:  Prefix + r"
echo "  Copy mode:      Prefix + f"
echo "  List keys:      Prefix + h"
echo "  Switch panes:   Alt + Arrow"
echo "  Switch windows: Shift + Arrow"
echo "  Detach:         Prefix + d"
