---
description: Create or update the project constitution based on repository analysis and constitutional principles.
---

Given the operation mode (create/update) provided as an argument, do this:

## Command Usage
- `/constitution create` - Create a new constitution from scratch
- `/constitution update` - Update existing constitution

## Process Flow

1. **Parse Arguments and Setup**:
   - Extract operation mode from arguments (create/update)
   - Get repository root: `REPO_ROOT=$(git rev-parse --show-toplevel)`
   - Set constitution paths:
     - `CONSTITUTION_DIR="$REPO_ROOT/specs/memory"`
     - `CONSTITUTION_FILE="$CONSTITUTION_DIR/constitution.md"`

2. **Load Reference Materials**:
   - Read `~/.claude/templates/spec-kit/constitution.md` for template structure
   - Follow analysis guidelines based on project characteristics

3. **Repository Analysis** (analyze project comprehensively):
   - **Repository Structure**: Identify main programming language(s), project type (web app/CLI/library/service), dependency files, testing frameworks, CI/CD config, documentation structure
   - **Technology Stack**: Primary language/version, frameworks/libraries, database technology, build tools, testing tools, deployment platforms
   - **Development Practices**: Coding standards/linting, test coverage patterns, commit history analysis, security practices, performance considerations, documentation quality
   - **Project Constraints**: Business/domain requirements, compliance needs, performance requirements, security considerations, scalability needs, integration requirements

4. **Constitution Processing**:

   ### For Create Mode:
   - Create `$CONSTITUTION_DIR` if it doesn't exist
   - Generate new constitution using template structure
   - Replace all placeholders with project-specific content:
     - `[PROJECT_NAME]` → Repository name
     - `[PRINCIPLE_X_NAME]` → Contextual principle names
     - `[PRINCIPLE_X_DESCRIPTION]` → Technology-specific implementations
     - `[SECTION_X_NAME/CONTENT]` → Project-relevant sections
     - `[GOVERNANCE_RULES]` → Enforcement mechanisms
     - Version info with current date

   ### For Update Mode:
   - Verify existing constitution exists at `$CONSTITUTION_FILE`
   - Analyze current constitution vs project state
   - Preserve valid existing principles
   - Add new requirements based on project evolution
   - Update version and last amended date
   - Maintain manual additions between markers if present

5. **Quality Assurance**:
   - Ensure no placeholder text remains
   - Verify all core principles are contextually relevant
   - Confirm technology-specific standards are included
   - Validate governance section has enforcement mechanisms

6. **Output Results**:
   - Write constitution to `$CONSTITUTION_FILE`
   - Report constitution file path and operation completed
   - Summarize key principles and standards applied

## Technology-Specific Adaptations

The constitution should adapt core principles to the project's technology stack:

- **JavaScript/TypeScript**: Module standards, type safety, package.json conventions
- **Python**: PEP compliance, virtual environments, pytest patterns
- **Rust**: Cargo organization, error handling, memory safety
- **Go**: Module structure, interface design, concurrency patterns
- **Web Apps**: Frontend/backend separation, API design, security headers
- **CLI Tools**: Command interface, I/O protocols, configuration management
- **Libraries**: Public API design, versioning, documentation requirements

## Error Handling

- If repository analysis fails, report specific missing information
- If template files are missing, report template path errors
- If constitution directory cannot be created, report permission issues
- For update mode, if no existing constitution found, suggest using create mode

The constitution should be immediately actionable and reflect the project's current technology choices and development practices.

---

User: $ARGUMENTS
