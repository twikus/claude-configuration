---
allowed-tools: Bash(neon *)
description: Neon CLI commands for managing serverless Postgres databases
---

# Neon CLI Commands

## Authentication
```bash
# Login via web browser
neon auth

# Use API key
neon --api-key <your-api-key> <command>
# or set environment variable
export NEON_API_KEY=<your-api-key>
```

## Projects
```bash
# List all projects
neon projects list

# Create new project
neon projects create --name "My Project"

# Get project details
neon projects get <project-id>

# Delete project
neon projects delete <project-id>
```

## Branches
```bash
# List branches
neon branches list --project-id <project-id>

# Create branch
neon branches create --project-id <project-id> --name <branch-name>

# Create branch from parent
neon branches create --project-id <project-id> --name <branch-name> --parent <parent-branch-id>

# Delete branch
neon branches delete <branch-id>

# Reset branch
neon branches reset <branch-id>

# Compare schemas
neon branches schema-diff <branch-id> <compare-branch-id>

# Set default branch
neon branches set-default <branch-id>
```

## Databases
```bash
# List databases
neon databases list <branch-id>

# Create database
neon databases create <branch-id> --name <db-name>

# Delete database
neon databases delete <branch-id> <db-name>
```

## Connection Strings
```bash
# Get connection string
neon connection-string <branch-id>

# Get connection string for specific database
neon connection-string <branch-id> --database-name <db-name>

# Get connection string with role
neon connection-string <branch-id> --role-name <role-name>
```

## Roles
```bash
# List roles
neon roles list <branch-id>

# Create role
neon roles create <branch-id> --name <role-name>

# Delete role
neon roles delete <branch-id> <role-name>
```

## Operations
```bash
# List operations
neon operations list --project-id <project-id>

# Get operation details
neon operations get <operation-id>
```

## Endpoints
```bash
# List endpoints
neon endpoints list <branch-id>

# Create endpoint
neon endpoints create <branch-id>

# Delete endpoint
neon endpoints delete <endpoint-id>
```

## Global Options
```bash
# Output format
-o, --output <format>    # json, yaml, table (default)

# API key
--api-key <key>         # Use specific API key

# Help
-h, --help             # Show help for any command
```

## Common Workflows

### Create a new project with branch
```bash
# 1. Create project
neon projects create --name "My App"

# 2. Get project ID from output, then create development branch
neon branches create --project-id <project-id> --name "development"

# 3. Get connection string
neon connection-string <branch-id>
```

### Development workflow
```bash
# 1. Create feature branch
neon branches create --project-id <project-id> --name "feature/new-feature" --parent <main-branch-id>

# 2. Work with your feature branch
neon connection-string <feature-branch-id>

# 3. Reset branch if needed
neon branches reset <feature-branch-id>

# 4. Delete when done
neon branches delete <feature-branch-id>
```

## Tips
- Use `--project-id` when you have multiple projects
- Always check branch status before operations
- Use schema-diff to compare database structures
- Connection strings include all necessary parameters for database connections

---

User: $ARGUMENTS
