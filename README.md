# Claude Configuration

This repository contains Claude Code configuration files and automatically syncs with the upstream repository.

## Automated Sync

This repository automatically syncs from [Melvynx/aiblueprint-cli-premium](https://github.com/Melvynx/aiblueprint-cli-premium) **once per day** at midnight UTC.

### How It Works

- **Source Repository**: https://github.com/Melvynx/aiblueprint-cli-premium
- **Sync Schedule**: Daily at 00:00 UTC
- **Sync Strategy**: Upstream repository is the source of truth. Any conflicts are resolved in favor of the upstream repository.
- **Branch**: `main`

### Manual Sync

To trigger a sync manually:

1. Go to the **Actions** tab in this repository
2. Select **"Sync from Upstream Repository"** workflow
3. Click **"Run workflow"** button
4. Select the `main` branch and click **"Run workflow"**

### Monitoring

- Check the [Actions tab](../../actions) to view sync history and status
- Each sync run shows which commits were synchronized
- You'll receive notifications for failed sync attempts (configure in Settings → Notifications)

### Notes

- This repository should be treated as read-only to avoid merge conflicts
- The upstream repository always wins in case of conflicts
- Sync logs are available in the Actions tab for 90 days


