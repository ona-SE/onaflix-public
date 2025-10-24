# Quick Setup Instructions for Repository Sync

## ✅ What's Already Done

1. ✅ Public repository `ona-SE/onaflix-public` exists
2. ✅ Code has been pushed to the public repository
3. ✅ Workflow created in private repo: `.github/workflows/sync-to-public.yml`
4. ✅ One-way sync configured: Private → Public only

## ⚠️ Required: Configure Secrets

You need to add a GitHub secret to the private repository for the workflow to function.

### Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Repository Sync Token"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Add Secret to Private Repository (ona-flix)

```bash
gh secret set PUBLIC_REPO_TOKEN --repo ona-SE/ona-flix
# Paste your token when prompted
```

Or via GitHub UI:
1. Go to [https://github.com/ona-SE/ona-flix/settings/secrets/actions](https://github.com/ona-SE/ona-flix/settings/secrets/actions)
2. Click "New repository secret"
3. Name: `PUBLIC_REPO_TOKEN`
4. Value: Paste your token
5. Click "Add secret"

## 🧪 Testing the Setup

### Test 1: Manual Trigger of Private → Public Sync

1. Go to [https://github.com/ona-SE/ona-flix/actions/workflows/sync-to-public.yml](https://github.com/ona-SE/ona-flix/actions/workflows/sync-to-public.yml)
2. Click "Run workflow" button
3. Select branch: `main`
4. Click "Run workflow"
5. Wait for the workflow to complete
6. Verify changes appear in [https://github.com/ona-SE/onaflix-public](https://github.com/ona-SE/onaflix-public)

## 📅 Automatic Sync Schedule

- **Private → Public**: Runs every night at 2 AM UTC (force push to keep public in sync)

## 🔄 How It Works

```
┌─────────────────────┐
│   ona-SE/ona-flix   │
│   (Private Repo)    │
│   Source of Truth   │
└──────────┬──────────┘
           │
           │ Nightly at 2 AM UTC
           │ (force push - resets public repo)
           ↓
┌─────────────────────┐
│ ona-SE/onaflix-     │
│ public              │
│ Experimental        │
│ Playground          │
│ (Resets Nightly)    │
└─────────────────────┘
```

**Key Concept**: The public repo is like a sandbox that resets every night. 
Experiment freely, merge PRs, try things out - it all gets reset at 2 AM UTC.

## 🤝 Contribution Workflow

The public repository is an **experimental playground**:

1. Anyone can fork `ona-SE/onaflix-public`
2. Create a feature branch
3. Make changes
4. Submit a PR to `onaflix-public`
5. **PRs can be merged freely by anyone with write access**
6. Every night at 2 AM UTC, the public repo resets to match the private repo
7. This allows experimentation without affecting the source of truth

## 📝 Notes

- The private repository (`ona-flix`) is the **only** source of truth
- Nightly sync uses `--force` to reset public repo to match private repo
- Public repository is an experimental playground - merge freely!
- All changes in public repo are wiped nightly and reset to private repo state
- If you want changes to persist, they must be merged into the private repo

## 🆘 Troubleshooting

### Workflow fails with "Authentication failed"
- Check that secrets are correctly set in both repositories
- Verify the token has `repo` scope
- Token may have expired - generate a new one

### Workflow fails with "Merge conflict"
- Manual intervention required
- Clone both repositories locally
- Resolve conflicts
- Push resolution to appropriate repository

### Changes not syncing
- Check workflow runs in Actions tab
- Verify secrets are set correctly
- Check that workflows are enabled in repository settings
