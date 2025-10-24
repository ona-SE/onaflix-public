# Public Repository Sync Setup

This document explains the bidirectional sync setup between the private and public repositories.

## Repositories

- **Private**: `ona-SE/ona-flix` (source of truth, development happens here)
- **Public**: `ona-SE/onaflix-public` (read-only mirror for visibility)

## Sync Workflow

### Private → Public (Nightly Sync)

**Location**: `.github/workflows/sync-to-public.yml` in `ona-flix`

- **Trigger**: Every night at 2 AM UTC (also manual via workflow_dispatch)
- **Action**: Force pushes `main` branch from private to public
- **Purpose**: Keeps public repo synchronized with private repo as a read-only mirror

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

The public repository is a **read-only mirror**. For external contributors:

1. Fork `onaflix-public`
2. Create a feature branch
3. Make changes and submit a PR to `onaflix-public`
4. **Maintainers must manually review and apply changes to `ona-flix`**
5. Changes will appear in public repo on next nightly sync

## Notes

- The private repository (`ona-flix`) is the **only** source of truth
- Nightly sync from private to public uses `--force` to ensure public always matches private
- Public repository is for visibility and community engagement only
- All development and merging happens in the private repository
- PRs to public repo serve as suggestions that maintainers can review and apply
