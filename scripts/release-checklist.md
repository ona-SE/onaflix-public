# Release Readiness Checklist

Standards that must pass before any release to production.

## Automated Checks

1. **Lint** — `npm run lint` passes with zero errors in both frontend and backend
2. **Tests** — `npm test` passes with zero failures across all packages
3. **Type check** — `npx tsc --noEmit` reports zero type errors (backend)
4. **Dependency audit** — `npm audit` reports no high or critical vulnerabilities
5. **Build** — `npm run build` succeeds for both frontend and backend

## Code Quality

6. **No TODO/FIXME in changed files** — all outstanding items resolved or tracked in Linear
7. **No console.log statements** — use the logger utility instead
8. **No hardcoded secrets** — API keys, tokens, passwords must come from environment variables

## Report Format

Generate a markdown report with:
- **Summary**: READY or NOT READY
- **Each check**: ✅ Pass or ❌ Fail with details
- **Auto-fixed issues**: list file, line, and what was fixed
- **Remaining issues**: items that need human attention
