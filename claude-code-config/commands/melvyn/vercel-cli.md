---
allowed-tools: Bash(vercel *)
description: Vercel CLI commands for project management and deployment
---

# Vercel CLI Commands

## Projects

```bash
# List all projects
vercel projects ls

# Add new project
vercel projects add

# Remove project
vercel projects rm <project-name>
```

## Deployment

```bash
# Deploy current directory
vercel

# Deploy with production flag
vercel --prod

# Deploy specific directory
vercel <directory>
```

## Inspection & Debugging

```bash
# Quick status check
vercel inspect <project-url>

# Get build logs when issues occur
vercel inspect --logs <project-url>

# Get deployment details
vercel inspect <deployment-url>
```

## Domains

```bash
# List domains
vercel domains ls

# Add domain
vercel domains add <domain>

# Remove domain
vercel domains rm <domain>
```

## Environment Variables

```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add <name>

# Remove environment variable
vercel env rm <name>
```

## Aliases

```bash
# List aliases
vercel alias ls

# Set alias
vercel alias <deployment-url> <alias>

# Remove alias
vercel alias rm <alias>
```

## Teams

```bash
# List teams
vercel teams ls

# Switch team
vercel teams switch <team-name>
```

## Logs & Monitoring

```bash
# View function logs
vercel logs <deployment-url>

# Follow logs in real-time (watch deployment progress)
vercel logs <deployment-url> --follow
vercel logs <deployment-url> -f

# View build logs
vercel logs <deployment-url> --since <time>

vercel inspect https://broll-finder-mono-1lld1gzo5-codelynx.vercel.app --logs
```

## Secrets

```bash
# List secrets
vercel secrets ls

# Add secret
vercel secrets add <name>

# Remove secret
vercel secrets rm <name>
```

---

User: $ARGUMENTS
