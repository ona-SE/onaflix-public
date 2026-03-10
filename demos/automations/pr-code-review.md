# PR Code Review Automation

PR-triggered automation that reviews every pull request targeting main. Checks for bugs, security issues, missing error handling, and test coverage gaps. Posts inline comments or approves clean PRs.

## Trigger

PR event -- on open or on push to PR branch.

## Scope

- **Repo:** ona-se/ona-flix
- **Target branch:** main

## Prerequisites

- GitHub SCM integration (already configured)
- 3 demo PRs open against main (see setup below)

## Demo PRs

Three branches exist with intentional issues:

### PR 1 -- SQL injection (branch: demo/review-sql-injection)

Adds a search filter route that uses string interpolation instead of parameterized queries. The agent should flag this as a security vulnerability.

### PR 2 -- Missing error handling (branch: demo/review-missing-auth)

Adds a bulk delete endpoint with no try/catch, no auth check, and no input validation. The agent should flag missing auth and error handling.

### PR 3 -- Clean code (branch: demo/review-health-endpoint)

Adds a well-structured, tested health endpoint. The agent should approve this.

## Automation Steps

### Step 1 -- Fetch PR diff [Script]

```bash
gh pr diff $PR_NUMBER > /tmp/pr_diff.patch
gh pr view $PR_NUMBER --json title,body,files > /tmp/pr_metadata.json
```

### Step 2 -- Review [Prompt]

```
Review this pull request diff. Check for:

1. **Security vulnerabilities** -- SQL injection, XSS, hardcoded secrets, insecure deserialization
2. **Bugs or logic errors** -- off-by-one, null pointer, race conditions, resource leaks
3. **Missing error handling** -- unhandled exceptions, missing try/catch, no input validation
4. **Missing authentication/authorization** -- endpoints without auth middleware
5. **Test coverage gaps** -- new code paths without corresponding tests
6. **Style violations** -- inconsistency with project conventions

For each finding:
- Identify the specific file and line
- Explain the issue clearly
- Suggest a fix

If the PR is clean and well-tested, approve it with a summary of what you verified.
```

### Step 3 -- Post review [Script]

```bash
# Post review comments via GitHub API
gh pr review $PR_NUMBER --comment --body "$REVIEW_BODY"
# Or for approval:
gh pr review $PR_NUMBER --approve --body "$APPROVAL_BODY"
```

## Expected Demo Output

- PR 1: Flagged for SQL injection with inline comment on the vulnerable line
- PR 2: Flagged for missing auth middleware and error handling
- PR 3: Approved with a summary of verification checks

## Reset Procedure

1. Delete review comments on each PR
2. PRs remain open for the next demo run
