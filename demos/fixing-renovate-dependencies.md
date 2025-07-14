# Fixing Renovate Dependencies Demo

This demo shows how to use Renovate to create pull requests for dependency updates and then use AI assistance to resolve any breaking changes.

## Prerequisites

- Access to a Gitpod environment with this repository
- GitHub CLI token configured (`GH_CLI_TOKEN` environment variable)
- Renovate CLI installed (included in the devcontainer)

## Steps to Replicate

### 1. Create a Renovate Pull Request

Navigate to the catalog service directory and run the renovate Jest command:

```bash
cd backend/catalog
npm run renovate:jest
```

This command will:

- Use the existing `renovate.json` configuration
- Create a pull request specifically for Jest dependency updates
- Target Jest upgrades that may introduce breaking changes

### 2. Review the Pull Request

After the command completes, check the GitHub repository for the newly created pull request. The PR will contain:

- Updated Jest dependencies
- Breaking changes that need to be addressed

### 3. Resolve Breaking Changes with AI

You have several options to get AI assistance for resolving the breaking changes:

#### Option A: Using GitHub CLI

```bash
# Get PR details and diff
gh pr view <PR_NUMBER> --json body,title,files
gh pr diff <PR_NUMBER>

# Use this information to prompt your AI assistant
```

#### Option B: Manual Context Gathering

1. Copy the PR description and diff manually
2. Include relevant test files that might be affected
3. Construct a prompt asking for help with Jest migration

#### Option C: Direct File Analysis

1. Review the failing tests after merging the PR
2. Copy error messages and affected code
3. Ask AI to help fix the deprecated Jest matchers

## Example AI Prompt

```
I have a Jest upgrade from v29 to v30 that's causing test failures due to deprecated matchers. Here are the failing tests:

[Include test file contents and error messages]

Please help me update the deprecated Jest matchers to their v30 equivalents.
```
