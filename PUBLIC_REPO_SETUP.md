# Public Repository Sync Setup

This document explains the bidirectional sync setup between the private and public repositories.

## Repositories

- **Private**: `ona-SE/ona-flix` (source of truth, permanent changes happen here)
- **Public**: `ona-SE/onaflix-public` (experimental playground, resets nightly)

## Sync Workflow

### Private → Public (Nightly Sync)

**Location**: `.github/workflows/sync-to-public.yml` in `ona-flix`

- **Trigger**: Every night at 2 AM UTC (also manual via workflow_dispatch)
- **Action**: Force pushes `main` branch from private to public
- **Purpose**: Resets public repo to match private repo, wiping any experimental changes

## Required Secrets

### In Private Repository (ona-flix)

- `PUBLIC_REPO_TOKEN`: GitHub Personal Access Token with `repo` scope for pushing to `onaflix-public`

## Setup Instructions

### 1. Create GitHub Personal Access Tokens

Create two tokens (or use the same token for both):

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token value

### 2. Add Secrets to Repositories

**For ona-flix (private)**:
```bash
gh secret set PUBLIC_REPO_TOKEN --repo ona-SE/ona-flix
# Paste the token when prompted
```

## Testing the Setup

### Test Private → Public Sync

```bash
# Trigger manually from GitHub UI
# Go to: https://github.com/ona-SE/ona-flix/actions/workflows/sync-to-public.yml
# Click "Run workflow"
```

Or wait for the nightly scheduled run at 2 AM UTC.

## Contribution Workflow

The public repository is an **experimental playground**:

1. Fork `onaflix-public`
2. Create a feature branch
3. Make changes and submit a PR to `onaflix-public`
4. **Anyone with write access can merge PRs freely**
5. Experiment, test, and try things out
6. Every night at 2 AM UTC, the public repo resets to match the private repo
7. If you want changes to persist, they must be merged into `ona-flix` (private)

## Notes

- The private repository (`ona-flix`) is the **only** source of truth
- Nightly sync from private to public uses `--force` to reset the public repo
- Public repository is a sandbox for experimentation
- Merge freely to the public repo - it resets every night
- Only changes merged to the private repo will persist
- This allows safe experimentation without affecting the production codebase
