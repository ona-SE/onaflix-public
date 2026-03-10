# Self-Healing CI Automation

Automation that triggers when a CI pipeline fails. Reads the failure logs, diagnoses the root cause, implements a fix, and pushes to re-trigger CI.

## Trigger

Webhook from GitHub Actions on workflow failure, or scheduled scan of failed pipelines.

## Scope

- **Repo:** ona-se/ona-flix
- **CI system:** GitHub Actions

## Prerequisites

- GitHub Actions CI pipeline configured (already exists)
- A branch with an intentional CI failure (demo/break-ci)

## Demo Setup

The `demo/break-ci` branch introduces a CI failure that looks like a realistic Dependabot/Renovate issue -- a peer dependency conflict between TypeScript versions.

## Automation Steps

### Step 1 -- Detect failure [Script]

```bash
# Get the most recent failed workflow run
FAILED_RUN_ID=$(gh run list --status failure --limit 1 --json databaseId -q '.[0].databaseId')
echo "Failed run: $FAILED_RUN_ID"

# Get the failure logs
gh run view $FAILED_RUN_ID --log-failed > /tmp/ci_failure.log 2>&1
```

### Step 2 -- Diagnose and fix [Prompt]

```
Read the CI failure log at /tmp/ci_failure.log. 

1. Identify the root cause of the failure
2. Determine the minimal fix required
3. Implement the fix in the codebase
4. Run the test suite locally to verify: `cd backend/catalog && npm test`
5. If tests pass, commit the fix

Do not make unnecessary changes beyond what is needed to fix the CI failure.
```

### Step 3 -- Push fix [Script]

```bash
git add -A && git commit -m "fix: resolve CI failure - [root cause summary]"
git push
```

## Expected Demo Output

- Agent reads the GitHub Actions failure log
- Correctly identifies the peer dependency conflict
- Pins or resolves the conflicting dependency
- Pushes the fix, CI re-triggers and goes green

## Reset Procedure

1. `git checkout demo/break-ci`
2. `git reset --hard demo-ci-broken` (tag pointing to the broken state)
3. `git push --force`
