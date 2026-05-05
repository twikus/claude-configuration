# Claude Code Config Changelog

## [2026-01-21] - Skills & Statusline Refresh

### New Skills
- `skills/vercel-react-best-practices/` - React/Next.js performance optimization guidelines from Vercel Engineering
- `skills/web-design-guidelines/` - Review UI code for Web Interface Guidelines compliance

### Updated Skills
- `skills/apex/` - Enhanced APEX methodology with setup templates and updated step flows
- `skills/create-saas/` - Complete SaaS workflow with discovery, brainstorm, validate, PRD, architecture, and task phases
- `skills/debug-skills/` - Improved error debugging with systematic analysis and verification
- `skills/review-code/` - Enhanced code review with security, clean code, and best practices

### Scripts - Statusline Complete Refresh
- **New**: `statusline/src/analyze-daily-usage.ts` - Daily usage analysis tool
- **New**: `statusline/src/debug-payloads.ts` - Debug payloads tool
- **New**: `statusline/src/lib/features/spend/payload-logger.ts` - Payload logging functionality
- **New**: `statusline/statusline.config.free.json` - Free tier configuration
- **Reorganized**: Commands moved to `src/lib/features/spend/commands/` structure
- **Removed**: Old renderers (renderer.ts, spend-v2.ts, usage-limits.ts, database.ts)
- **Removed**: Old commands (spend-today.ts, spend-month.ts, spend-project.ts, weekly-analysis.ts, migrate-to-sqlite.ts)

### Other Changes
- Updated agents (action, code-reviewer, explore-codebase, explore-docs, fix-grammar, snipper, websearch)
- New commands: `quick-search.md`, `softcompact.md`
- New agent: `code-simplifier.md`

---

## [2026-01-09] - Synced TO ~/.claude

### New Command
- `commands/debug-ccli.md` - Debug Claude CLI errors by analyzing debug logs

### New Skills
- `skills/apex-skills/` - APEX methodology skill
- `skills/brainstorm-skills/` - Deep iterative research skill
- `skills/ci-experts-skills/` - CI/CD debugging skill
- `skills/claude-memory-skills/` - CLAUDE.md creation skill
- `skills/create-hooks-skills/` - Hook configuration skill
- `skills/create-meta-prompts-skills/` - Meta-prompt creation skill
- `skills/create-prompt-skills/` - Prompt engineering skill
- `skills/create-slash-commands-skills/` - Slash command creation skill
- `skills/create-subagents-skills/` - Subagent creation skill
- `skills/review-code-skills/` - Code review skill

---

## [2026-01-06]

### Scripts - Full Replacement
- **New**: `auto-rename-session/` - Auto-rename Claude sessions with AI-generated titles
- **New**: `claude-code-ai/` - Claude Code AI helper utilities
- **New**: `statusline/__tests__/` - Test suite for statusline
- **New**: `statusline/src/lib/config.ts` - Configuration management
- **New**: `statusline/src/lib/config-types.ts` - Config type definitions
- **New**: `statusline/src/lib/menu-factories.ts` - Menu factory functions
- **New**: `statusline/src/lib/presets.ts` - Statusline presets
- **New**: `statusline/src/lib/render-pure.ts` - Pure render functions
- **New**: `statusline/defaults.json` - Default configuration
- Added root `biome.json` and `CLAUDE.md` for scripts workspace

---

## [2026-01-04]

### Commands
- **New**: `docs` - Deep documentation research using explore-docs agents
- **New**: `explore` - Deep exploration of codebase, docs, and web

### Statusline
- Sync latest updates from ~/.claude
- Switch from npm to bun (replace package-lock.json with bun.lockb)

### Cleanup
- Remove unused scripts (spec-kit, worktree setup/cleanup, cc-gpt)
- Remove generated files (bun.lockb, data/)

---

## [2026-01-03]

### Agents
- **New**: `code-reviewer` - Expert code reviewer for PR analysis

### Skills
- **New**: `review-code` - Code review guidance (security, clean code, SOLID)

---

## [2026-01-02]

### Project
- Add README.md documentation

### Statusline
- Initial sync with package-lock.json

---

## [2025-12-26]

### Commands
- **New**: `add-llm-comments` - Add minimal JSDoc comments for LLM understanding
- **New**: `brainstorm` - Deep iterative research with web search
- **New**: `ci-experts` - Debug CI/CD with Vercel and GitHub CLI
- **New**: `fix-errors` - Auto-fix iOS/watchOS build errors
- **New**: `learn-docs` - Deep documentation research with parallel agents
- **New**: `linkedin-ideas` - Generate LinkedIn post ideas
- **New**: `nextjs-speed` - Optimize Next.js pages for speed
- **New**: `optimize-prisma-query` - Audit Prisma queries for minimal data selection
- **New**: `review-emails` - Analyze marketing emails for clarity
- **New**: `melvyn/*` - Personal utility commands (vercel-cli, neon-cli, knip-cleanup, etc.)

### Skills
- **New**: `ci-experts` - CI/CD debugging with Vercel and GitHub CLI references

### Scripts
- Add various utility scripts (spec-kit, worktree management)

---

## [2025-12-15]

### Agents
- Upgrade all agents model from haiku to sonnet (better quality)

---

## [2025-12-14]

### Commands
- **New**: `create-context-docs` - Create context documentation in .claude/docs/
- **New**: `deploy` - Run build, lint, tests then commit and push
- **New**: `refactor` - Refactor code with parallel Snipper agents
- **New**: `ultrathink` - Deep thinking mode for elegant solutions
- **New**: `skills/claude-memory` - Create CLAUDE.md memory files
- **New**: `skills/create-skills` - Create Claude Code skills
- **New**: `skills/review-claude-memory` - Review CLAUDE.md quality
- **New**: `prompts/saas-create-headline` - Generate SaaS headlines
- **New**: `prompts/saas-create-logos` - Create minimalist SVG logos

### Deleted
- **Removed**: `melvyn/*` commands (moved to personal config)

### Skills
- **New**: `claude-memory` - CLAUDE.md file structure and best practices

### Statusline
- Add SQLite database support for spend tracking
- Add project-based spend tracking
- Replace spend.ts with spend-v2.ts (new architecture)

---

## [2025-12-09]

### Commands (SaaS Prompts)
- **New**: `prompts/nextjs-add-prisma-db` - Setup Prisma with PostgreSQL
- **New**: `prompts/nextjs-setup-better-auth` - Setup Better Auth with Email OTP
- **New**: `prompts/nextjs-setup-project` - Complete Next.js project setup
- **New**: `prompts/saas-challenge-idea` - Challenge business ideas
- **New**: `prompts/saas-create-architecture` - Design technical architecture
- **New**: `prompts/saas-create-landing-copy` - Landing page copywriting
- **New**: `prompts/saas-create-legals-docs` - GDPR-compliant legal docs
- **New**: `prompts/saas-create-prd` - Product Requirements Document
- **New**: `prompts/saas-create-tasks` - Generate implementation tasks
- **New**: `prompts/saas-define-pricing` - Data-driven pricing strategy
- **New**: `prompts/saas-find-domain-name` - Domain name generation
- **New**: `prompts/saas-implement-landing-page` - Implement landing pages
- **New**: `prompts/tools` - Recommended tools reference

---

## [2025-12-08]

### Statusline
- Sync script changes from global config

---

## [2025-11-24]

### Commands
- **New**: `skills/create-meta-prompt` - Create prompts for Claude-to-Claude pipelines
- **New**: `skills/create-prompt` - Expert prompt engineering
- **New**: `skills/create-slash-command` - Create slash commands
- **New**: `skills/create-subagent` - Create specialized subagents

### Skills
- **New**: `create-agent-skills` - Skill authoring guidance
- **New**: `create-hooks` - Hook configuration and event listeners
- **New**: `create-meta-prompts` - Multi-stage workflow prompts
- **New**: `create-prompt` - Anthropic/OpenAI best practices
- **New**: `create-slash-commands` - Command patterns and examples
- **New**: `create-subagents` - Agent orchestration patterns

---

## [2025-11-12]

### Commands
- **New**: `melvyn/*` - Personal utility commands
- Reorganize commands: move utils/ to git/ for git-related commands
- Rename validate to examine in apex-quick workflow

### Statusline
- Add interactive config command
- Improve formatters and renderer

---

## [2025-11-11]

### Agents
- **New**: `fix-grammar` - Fix grammar/spelling while preserving formatting
- **New**: `snipper` - Fast code modification agent

### Commands
- **New**: `apex` workflow (formerly epct) - Systematic implementation
- **New**: `apex-quick/*` - Quick versions without task folders
- **New**: `debug` - Deep error analysis
- **New**: `explain` - Deep code explanation with diagrams
- **New**: `marketing/copywriting` - Marketing copy specialist
- **New**: `quick-search` - Lightning-fast search
- **New**: `review` - Deep PR review with parallel agents
- **New**: `utils/commitizen` - Conventional commit messages

### Structure
- Reorganize commands into modules (git/, prompts/, tasks/, utils/, marketing/)
- Rename epct to apex (Analyze-Plan-Execute-eXamine)

### Statusline
- Add interactive config
- Add stats tracking
- Improve renderer

---

## [2025-11-10] - Initial commit

### Agents
- **New**: `action` - Conditional action executor
- **New**: `explore-codebase` - Fast codebase exploration
- **New**: `explore-docs` - Documentation research with Context7
- **New**: `websearch` - Quick web search

### Commands
- **New**: `commit` - Quick commit and push
- **New**: `create-pull-request` - Create PR with auto-generated description
- **New**: `epct` - Systematic implementation workflow
- **New**: `explore` - Codebase exploration
- **New**: `fix-pr-comments` - Fix PR review comments
- **New**: `oneshot` - Ultra-fast feature implementation
- **New**: `run-tasks` - Run implementation tasks
- **New**: `watch-ci` - Watch CI status

### Scripts
- **New**: `command-validator` - Validate command security
- **New**: `statusline` - Claude Code statusline with spend tracking
