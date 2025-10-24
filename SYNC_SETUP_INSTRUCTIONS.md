# Quick Setup Instructions for Repository Sync

## ✅ What's Already Done

1. ✅ Public repository `ona-SE/onaflix-public` exists
2. ✅ Code has been pushed to the public repository
3. ✅ Workflow created in private repo: `.github/workflows/sync-to-public.yml`
4. ✅ Workflow created in public repo: `.github/workflows/sync-from-public.yml`

## ⚠️ Required: Configure Secrets

You need to add GitHub secrets to both repositories for the workflows to function.

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

### Step 3: Add Secret to Public Repository (onaflix-public)

```bash
gh secret set PRIVATE_REPO_TOKEN --repo ona-SE/onaflix-public
# Paste your token when prompted
```

Or via GitHub UI:
1. Go to [https://github.com/ona-SE/onaflix-public/settings/secrets/actions](https://github.com/ona-SE/onaflix-public/settings/secrets/actions)
2. Click "New repository secret"
3. Name: `PRIVATE_REPO_TOKEN`
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

### Test 2: Public → Private Sync

1. Make a small change in the public repository (e.g., edit README)
2. Commit and push to main
3. Check [https://github.com/ona-SE/onaflix-public/actions](https://github.com/ona-SE/onaflix-public/actions)
4. Verify the sync workflow runs
5. Check that the change appears in the private repository

## 📅 Automatic Sync Schedule

- **Private → Public**: Runs every night at 2 AM UTC
- **Public → Private**: Runs automatically on every push to main in public repo

## 🔄 How It Works

```
┌─────────────────────┐
│   ona-SE/ona-flix   │
│   (Private Repo)    │
│   Source of Truth   │
└──────────┬──────────┘
           │
           │ Nightly at 2 AM UTC
           │ (force push)
           ↓
┌─────────────────────┐
│ ona-SE/onaflix-     │
│ public              │
│ (Public Repo)       │
│ Accepts PRs         │
└──────────┬──────────┘
           │
           │ On push to main
           │ (normal push)
           ↓
┌─────────────────────┐
│   ona-SE/ona-flix   │
│   (Private Repo)    │
└─────────────────────┘
```

## 🤝 Contribution Workflow

External contributors can now:

1. Fork `ona-SE/onaflix-public`
2. Create a feature branch
3. Make changes
4. Submit a PR to `onaflix-public`
5. Once merged → automatically syncs to `ona-flix`

## 📝 Notes

- The private repository (`ona-flix`) is the source of truth
- Nightly sync uses `--force` to ensure public repo matches private
- Public to private sync does NOT use force to preserve history
- If conflicts occur, workflows will fail and require manual resolution

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
