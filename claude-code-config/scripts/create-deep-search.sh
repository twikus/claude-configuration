#!/bin/bash

# Create Deep Search Workspace Automation Script
# Usage: ./create-deep-search.sh "<short-name>"
# Example: ./create-deep-search.sh "add-filter-links"
# Returns: Path to the created workspace directory

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATES_DIR="$CLAUDE_DIR/templates/deep-search"

# Find git root or use current directory
GIT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"

# If git root is the .claude directory itself, workspace is at root
# Otherwise, workspace is inside .claude subdirectory
if [[ "$GIT_ROOT" == *"/.claude" ]] || [[ "$(basename "$GIT_ROOT")" == ".claude" ]]; then
    WORKSPACE_BASE="$GIT_ROOT/deep-search"
else
    WORKSPACE_BASE="$GIT_ROOT/.claude/deep-search"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Function to find next available number
find_next_number() {
    local max_num=0

    # Create workspace base if it doesn't exist
    mkdir -p "$WORKSPACE_BASE"

    # Find all directories matching pattern XX-*
    if [[ -d "$WORKSPACE_BASE" ]]; then
        for dir in "$WORKSPACE_BASE"/*; do
            if [[ -d "$dir" ]]; then
                local basename=$(basename "$dir")
                # Extract number from format XX-name
                if [[ "$basename" =~ ^([0-9]{2})- ]]; then
                    local num="${BASH_REMATCH[1]}"
                    # Remove leading zero for comparison
                    num=$((10#$num))
                    if (( num > max_num )); then
                        max_num=$num
                    fi
                fi
            fi
        done
    fi

    # Increment and format as 2 digits
    local next_num=$((max_num + 1))
    printf "%02d" "$next_num"
}

# Function to generate search name from number and short name
generate_search_name() {
    local number="$1"
    local short_name="$2"
    echo "${number}-${short_name}"
}

# Function to validate inputs
validate_inputs() {
    local short_name="$1"

    if [[ -z "$short_name" ]]; then
        log_error "Short name is required"
        echo "Usage: $0 \"<short-name>\""
        echo "Example: $0 \"add-filter-links\""
        exit 1
    fi

    # Validate short name (should be kebab-case)
    if [[ ! "$short_name" =~ ^[a-z0-9-]+$ ]]; then
        log_error "Short name must be kebab-case (lowercase, numbers, hyphens only)"
        echo "Example: add-filter-links, update-auth-system"
        exit 1
    fi

    if [[ ! -d "$TEMPLATES_DIR" ]]; then
        log_error "Templates directory not found: $TEMPLATES_DIR"
        log_error "Please ensure Claude Code templates are properly installed"
        exit 1
    fi
}

# Function to create workspace directory structure
create_workspace() {
    local search_name="$1"
    local workspace_dir="$WORKSPACE_BASE/$search_name"

    log_info "Creating workspace directory: $workspace_dir"

    # Create the workspace directory
    mkdir -p "$workspace_dir"

    # Verify creation
    if [[ ! -d "$workspace_dir" ]]; then
        log_error "Failed to create workspace directory"
        exit 1
    fi

    echo "$workspace_dir"
}

# Function to populate templates with variables
populate_template() {
    local template_file="$1"
    local output_file="$2"
    local search_name="$3"
    local current_date="$4"

    # Read template and replace variables
    sed \
        -e "s/{SEARCH_NAME}/$search_name/g" \
        -e "s/{DATE}/$current_date/g" \
        -e "s/{ESTIMATED_DURATION}/TBD/g" \
        "$template_file" > "$output_file"
}

# Function to copy and populate templates
setup_templates() {
    local workspace_dir="$1"
    local search_name="$2"
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')

    log_info "Setting up templates in workspace..."

    # List of templates to copy
    local templates=("research-findings.md" "implementation-plan.md" "external-resources.md")

    for template in "${templates[@]}"; do
        local template_file="$TEMPLATES_DIR/$template"
        local output_file="$workspace_dir/$template"

        if [[ -f "$template_file" ]]; then
            log_info "Creating $template from template..."
            populate_template "$template_file" "$output_file" "$search_name" "$current_date"
            log_success "Created: $output_file"
        else
            log_warning "Template not found: $template_file"
            # Create basic file if template missing
            echo "# ${template%.*}: $search_name" > "$output_file"
            echo "" >> "$output_file"
            echo "**Created**: $current_date" >> "$output_file"
            log_success "Created basic: $output_file"
        fi
    done
}

# Function to create workspace README
create_workspace_readme() {
    local workspace_dir="$1"
    local search_name="$2"
    local current_date=$(date '+%Y-%m-%d %H:%M:%S')

    cat > "$workspace_dir/README.md" << EOF
# Deep Search: $search_name

**Created**: $current_date
**Status**: Active Research

## Workspace Files

- **research-findings.md** - Consolidated research findings and analysis
- **implementation-plan.md** - Detailed implementation strategy and planning
- **external-resources.md** - External resources, links, and references

## Usage

This workspace contains all research and planning materials for the deep search task.
Use these files to document findings, plan implementation, and track external resources.

## Workflow

1. **Research Phase** - Populate research-findings.md with discoveries
2. **Analysis Phase** - Update findings with synthesis and insights
3. **Planning Phase** - Create detailed implementation plan
4. **Validation Phase** - Get user approval before proceeding
5. **Issue Creation** - Create GitHub issue with comprehensive details

## Commands

To continue this deep search, use:
\`\`\`bash
/create-deep-search $search_name
\`\`\`

The AI will automatically use this workspace for all research and planning activities.
EOF

    log_success "Created workspace README: $workspace_dir/README.md"
}

# Function to verify git repository context
verify_git_context() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_warning "Not in a git repository"
        log_warning "Deep search workspace will be created but may not be optimal for issue creation"
        return 1
    fi

    local repo_url=$(git config --get remote.origin.url 2>/dev/null || echo "unknown")
    local current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")

    log_info "Git context detected:"
    log_info "  Repository: $repo_url"
    log_info "  Branch: $current_branch"

    return 0
}

# Function to display usage instructions
show_usage_instructions() {
    local workspace_dir="$1"
    local search_name="$2"

    echo ""
    log_success "Deep Search workspace created successfully!"
    echo ""
    echo -e "${BLUE}Workspace Location:${NC} $workspace_dir"
    echo -e "${BLUE}Search Name:${NC} $search_name"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Run the deep search command:"
    echo -e "   ${GREEN}/create-deep-search $search_name${NC}"
    echo ""
    echo "2. The AI will automatically:"
    echo "   - Use the workspace for research storage"
    echo "   - Populate the template files with findings"
    echo "   - Create a comprehensive implementation plan"
    echo "   - Request user validation before creating issues"
    echo ""
    echo -e "${YELLOW}Workspace Files:${NC}"
    echo "   - research-findings.md (research consolidation)"
    echo "   - implementation-plan.md (strategy & planning)"
    echo "   - external-resources.md (links & references)"
    echo "   - README.md (workspace overview)"
    echo ""
}

# Main execution
main() {
    local short_name="$1"

    log_info "Starting Deep Search workspace creation..."

    # Validate inputs
    validate_inputs "$short_name"

    # Find next available number
    local number=$(find_next_number)
    log_info "Auto-assigned number: $number"

    # Generate search name
    local search_name=$(generate_search_name "$number" "$short_name")
    log_info "Generated search name: $search_name"

    # Verify git context (optional)
    verify_git_context

    # Create workspace
    local workspace_dir=$(create_workspace "$search_name")

    # Setup templates
    setup_templates "$workspace_dir" "$search_name"

    # Create workspace README
    create_workspace_readme "$workspace_dir" "$search_name"

    # Show usage instructions
    show_usage_instructions "$workspace_dir" "$search_name"

    # Return the workspace path for the AI to use
    echo ""
    echo "WORKSPACE_PATH:$workspace_dir"
}

# Execute main function with all arguments
main "$@"