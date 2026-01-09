---
name: ci-experts
description: Expert for debugging CI/CD using Vercel CLI and GitHub CLI. Fetches deployment logs, workflow artifacts, build errors, and stores them in /tmp/{project-name}/. Use when debugging failed deployments, investigating CI errors, or retrieving build artifacts.
---

<objective>
Debug and investigate CI/CD issues using Vercel CLI and GitHub CLI. Retrieve deployment logs, workflow artifacts, and build information. All artifacts are stored in `/tmp/{project-name}/` for analysis.
</objective>

<quick_start>
<setup>
Ensure CLIs are authenticated:

```bash
vercel login
gh auth login
```
</setup>

<common_workflows>
**Debug a failed Vercel deployment:**
```bash
PROJECT="my-app"
mkdir -p /tmp/$PROJECT/vercel

vercel ls --output json > /tmp/$PROJECT/vercel/deployments.json
vercel inspect <deployment-url> > /tmp/$PROJECT/vercel/deployment-details.txt
```

**Debug a failed GitHub Actions workflow:**
```bash
PROJECT="my-app"
mkdir -p /tmp/$PROJECT/github

gh run list --limit 10 --json databaseId,status,conclusion,name
gh run view <run-id> --log-failed > /tmp/$PROJECT/github/failed-logs.txt
gh run download <run-id> --dir /tmp/$PROJECT/github/artifacts
```
</common_workflows>
</quick_start>

<artifact_storage>
**Directory structure:**
```
/tmp/{project-name}/
├── vercel/
│   ├── deployments.json
│   ├── deployment-details.txt
│   ├── build-logs.txt
│   └── runtime-logs.txt
├── github/
│   ├── workflow-runs.json
│   ├── failed-logs.txt
│   ├── job-logs/
│   └── artifacts/
└── analysis/
    └── error-summary.md
```

**Always create directories before storing:**
```bash
PROJECT="your-project-name"
mkdir -p /tmp/$PROJECT/{vercel,github/job-logs,github/artifacts,analysis}
```
</artifact_storage>

<vercel_commands>
**Deployment inspection:**
```bash
vercel ls                              # List recent deployments
vercel ls --output json               # JSON output for parsing
vercel inspect <url>                   # Detailed deployment info
vercel logs <url>                      # Runtime logs (streams for 5 min)
vercel logs <url> --json              # JSON format for parsing
```

**Build debugging:**
```bash
vercel build                           # Build locally to reproduce
vercel build --prod                    # Build with production env
vercel build --debug                   # Verbose build output
vercel pull                            # Pull env vars and settings
```

**Deploy options:**
```bash
vercel deploy --logs                   # Deploy with build logs visible
vercel deploy --force                  # Skip build cache
vercel deploy --prebuilt              # Deploy pre-built .vercel/output
```

**Project info:**
```bash
vercel project ls                      # List projects
vercel env ls                          # List environment variables
vercel domains ls                      # List domains
```
</vercel_commands>

<github_commands>
**Workflow runs:**
```bash
gh run list                            # List recent runs
gh run list --workflow ci.yml          # Filter by workflow
gh run list --branch main              # Filter by branch
gh run list --status failure          # Filter failures only
gh run list --json databaseId,status,conclusion,name,headBranch
```

**Inspect specific run:**
```bash
gh run view <run-id>                   # Summary view
gh run view <run-id> --log            # Full logs
gh run view <run-id> --log-failed     # Only failed step logs
gh run view <run-id> --json jobs      # JSON output
```

**Download artifacts:**
```bash
gh run download <run-id>               # All artifacts
gh run download <run-id> -n artifact-name  # Specific artifact
gh run download <run-id> --dir /tmp/project/artifacts
```

**Re-run workflows:**
```bash
gh run rerun <run-id>                  # Re-run all jobs
gh run rerun <run-id> --failed        # Re-run only failed jobs
gh run rerun <run-id> --debug         # Re-run with debug logging
```

**Workflow management:**
```bash
gh workflow list                       # List all workflows
gh workflow view <workflow>           # View workflow details
gh workflow run <workflow>            # Trigger workflow manually
gh workflow run ci.yml -f branch=main # With parameters
```

**Watch running workflow:**
```bash
gh run watch <run-id>                  # Watch until complete
gh run watch                           # Interactive selection
```
</github_commands>

<debugging_workflows>
<vercel_build_failure>
**Step 1: Get deployment info**
```bash
PROJECT="my-app"
mkdir -p /tmp/$PROJECT/vercel

DEPLOYMENT=$(vercel ls --output json | jq -r '.[0].url')
vercel inspect $DEPLOYMENT > /tmp/$PROJECT/vercel/deployment-details.txt
```

**Step 2: Check build logs on dashboard or reproduce locally**
```bash
vercel pull --yes
vercel build --debug 2>&1 | tee /tmp/$PROJECT/vercel/build-logs.txt
```

**Step 3: Common fixes**
- Memory issues: Check for large dependencies, reduce bundle size
- Module not found: Check imports and dependencies
- Build timeout (45min max): Optimize build or use build cache
- Env vars: Verify with `vercel env ls`
</vercel_build_failure>

<github_actions_failure>
**Step 1: Get failed run info**
```bash
PROJECT="my-app"
mkdir -p /tmp/$PROJECT/github/job-logs

RUN_ID=$(gh run list --status failure --limit 1 --json databaseId -q '.[0].databaseId')
echo "Failed run: $RUN_ID"
```

**Step 2: Get logs**
```bash
gh run view $RUN_ID --log-failed > /tmp/$PROJECT/github/failed-logs.txt
gh run view $RUN_ID --json jobs | jq '.jobs[] | select(.conclusion=="failure")' > /tmp/$PROJECT/github/failed-jobs.json
```

**Step 3: Download artifacts if any**
```bash
gh run download $RUN_ID --dir /tmp/$PROJECT/github/artifacts 2>/dev/null || echo "No artifacts"
```

**Step 4: Re-run with debug**
```bash
gh run rerun $RUN_ID --debug
gh run watch $RUN_ID
```
</github_actions_failure>

<full_ci_investigation>
**Complete investigation script:**
```bash
#!/bin/bash
PROJECT="${1:-$(basename $(pwd))}"
BASE="/tmp/$PROJECT"
mkdir -p $BASE/{vercel,github/job-logs,github/artifacts,analysis}

echo "=== CI Investigation for $PROJECT ===" | tee $BASE/analysis/error-summary.md
echo "Date: $(date)" | tee -a $BASE/analysis/error-summary.md

echo -e "\n## Vercel Status" | tee -a $BASE/analysis/error-summary.md
vercel ls --output json 2>/dev/null | jq '.[0:5]' > $BASE/vercel/deployments.json
cat $BASE/vercel/deployments.json | jq -r '.[] | "\(.state) - \(.url)"' | tee -a $BASE/analysis/error-summary.md

echo -e "\n## GitHub Actions Status" | tee -a $BASE/analysis/error-summary.md
gh run list --limit 10 --json databaseId,status,conclusion,name,headBranch > $BASE/github/workflow-runs.json
cat $BASE/github/workflow-runs.json | jq -r '.[] | "\(.conclusion // .status) - \(.name) (\(.headBranch))"' | tee -a $BASE/analysis/error-summary.md

FAILED_RUN=$(cat $BASE/github/workflow-runs.json | jq -r '[.[] | select(.conclusion=="failure")][0].databaseId // empty')
if [ -n "$FAILED_RUN" ]; then
    echo -e "\n## Failed Run Details (ID: $FAILED_RUN)" | tee -a $BASE/analysis/error-summary.md
    gh run view $FAILED_RUN --log-failed > $BASE/github/failed-logs.txt 2>&1
    gh run download $FAILED_RUN --dir $BASE/github/artifacts 2>/dev/null
fi

echo -e "\nArtifacts saved to: $BASE"
```
</full_ci_investigation>
</debugging_workflows>

<vercel_api_endpoints>
**Using Vercel API for advanced queries:**
```bash
VERCEL_TOKEN="your-token"
TEAM_ID="your-team-id"

curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?teamId=$TEAM_ID&limit=10"

curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v2/deployments/<deployment-id>/events"
```
</vercel_api_endpoints>

<github_api_endpoints>
**Using GitHub API for advanced queries:**
```bash
gh api repos/{owner}/{repo}/actions/runs --jq '.workflow_runs[0:5]'
gh api repos/{owner}/{repo}/actions/runs/{run_id}/jobs
gh api repos/{owner}/{repo}/actions/artifacts
gh api repos/{owner}/{repo}/actions/runs/{run_id}/logs  # Downloads zip
```
</github_api_endpoints>

<common_issues>
**Vercel build failures:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Out of Memory | Large dependencies/bundles | Reduce bundle, use Pro build machines |
| Module not found | Missing/wrong import | Check paths, run locally first |
| Build timeout | Build > 45 minutes | Optimize build, check cache |
| Missing env vars | Not configured | `vercel env add` or dashboard |

**GitHub Actions failures:**
| Issue | Cause | Solution |
|-------|-------|----------|
| Artifact not found | Wrong name/expired | Check name, download from correct run |
| Permission denied | Missing token scope | Add required permissions to workflow |
| Job cancelled | Timeout or manual | Check timeout settings, re-run |
| Cache miss | Key changed | Review cache key configuration |
</common_issues>

<workflow_examples>
**Vercel + GitHub integration check:**
```bash
PROJECT="my-app"

echo "Checking Vercel-GitHub integration..."
gh run list --workflow vercel.yml --limit 5 --json conclusion,name | jq '.'

LATEST_COMMIT=$(git rev-parse HEAD)
echo "Latest commit: $LATEST_COMMIT"

vercel ls --output json | jq --arg commit "$LATEST_COMMIT" '.[] | select(.meta.githubCommitSha == $commit)'
```
</workflow_examples>

<detailed_references>
For extended command references, see:
- [references/vercel-cli.md](references/vercel-cli.md) - Complete Vercel CLI reference
- [references/github-cli.md](references/github-cli.md) - Complete GitHub CLI reference
- [references/troubleshooting.md](references/troubleshooting.md) - Common issues and solutions
</detailed_references>

<success_criteria>
- All artifacts stored in `/tmp/{project-name}/` with clear structure
- Build logs captured and saved for analysis
- Failed workflow logs downloaded and parsed
- Root cause identified from logs
- Re-run or fix applied successfully
</success_criteria>
