# Public Repository Sync Setup

This document explains the bidirectional sync setup between the private and public repositories.

## Repositories

- **Private**: `ona-SE/ona-flix` (source of truth)
- **Public**: `ona-SE/onaflix-public` (public mirror, accepts contributions)

## Sync Workflows

### 1. Private → Public (Nightly Sync)

**Location**: `.github/workflows/sync-to-public.yml` in `ona-flix`

- **Trigger**: Every night at 2 AM UTC (also manual via workflow_dispatch)
- **Action**: Force pushes `main` branch from private to public
- **Purpose**: Ensures public repo stays up-to-date with private repo changes

### 2. Public → Private (On Push)

**Location**: `.github/workflows/sync-from-public.yml` in `onaflix-public`

- **Trigger**: When changes are pushed to `main` in public repo
- **Action**: Pushes changes from public back to private repo
- **Purpose**: Allows community contributions to flow back to private repo

## Required Secrets

### In Private Repository (ona-flix)

- `PUBLIC_REPO_TOKEN`: GitHub Personal Access Token with `repo` scope for pushing to `onaflix-public`

### In Public Repository (onaflix-public)

- `PRIVATE_REPO_TOKEN`: GitHub Personal Access Token with `repo` scope for pushing to `ona-flix`

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

**For onaflix-public (public)**:
```bash
gh secret set PRIVATE_REPO_TOKEN --repo ona-SE/onaflix-public
# Paste the token when prompted
```

### 3. Copy Workflow to Public Repository

The file `.github/workflows/sync-from-public.yml` needs to be copied to the public repository:

```bash
# From the ona-flix directory
git checkout main
git pull origin main

# Add the public remote if not already added
git remote add public https://github.com/ona-SE/onaflix-public.git

# Create a temporary directory for the public repo workflow
mkdir -p /tmp/public-workflow
cp .github/workflows/sync-from-public.yml /tmp/public-workflow/

# Clone public repo
cd /tmp
git clone https://github.com/ona-SE/onaflix-public.git
cd onaflix-public

# Create workflows directory if it doesn't exist
mkdir -p .github/workflows

# Copy the workflow
cp /tmp/public-workflow/sync-from-public.yml .github/workflows/

# Commit and push
git add .github/workflows/sync-from-public.yml
git commit -m "Add sync workflow from public to private repo"
git push origin main
```

## Testing the Setup

### Test Private → Public Sync

```bash
# Trigger manually from GitHub UI
# Go to: https://github.com/ona-SE/ona-flix/actions/workflows/sync-to-public.yml
# Click "Run workflow"
```

Or wait for the nightly scheduled run.

### Test Public → Private Sync

1. Make a change in the public repository
2. Push to main branch
3. Verify the change appears in the private repository

## Contribution Workflow

For external contributors to the public repository:

1. Fork `onaflix-public`
2. Create a feature branch
3. Make changes and submit a PR to `onaflix-public`
4. Once merged, changes automatically sync to `ona-flix`

## Conflict Resolution

If conflicts occur during sync:

1. The workflow will fail and notify via GitHub Actions
2. Manual intervention required:
   - Review the conflicting changes
   - Resolve conflicts locally
   - Push the resolution to the appropriate repository

## Notes

- The private repository is the source of truth
- Nightly sync from private to public uses `--force` to ensure consistency
- Public to private sync does NOT use force push to preserve private repo history
- If there are conflicts in public→private sync, manual resolution is required
