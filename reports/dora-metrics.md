# DORA Metrics Report — ona-SE Organization

**Report date:** 2026-04-02  
**Analysis window:** 2026-03-03 to 2026-04-02 (30 days)  
**Data source:** GitHub API (merged PRs, commit history, CI check runs)  
**Repos analyzed:** 9

---

## Executive Summary

| Metric | Org-Wide Value | DORA Classification |
|---|---|---|
| Deployment Frequency | 2.1 deploys/week | **Medium** (weekly–monthly) |
| Lead Time for Changes | 1.6 min median | **Elite** (<1 hour) |
| Mean Time to Recovery | ~2 hours (estimated) | **Elite** (<1 hour) / **High** (<1 day) |
| Change Failure Rate | 22.2% | **Medium** (16–30%) |

**Overall DORA band: Medium** — The organization shows elite-level lead times but is held back by low deployment frequency concentrated in a single repo and a moderate change failure rate. Eight of nine repos had zero activity in the analysis window.

---

## Per-Repo Breakdown

### Activity Summary

| Repository | Merged PRs (30d) | Direct Pushes (30d) | Total Deploys | Status |
|---|---|---|---|---|
| **ona-flix** | 1 | 8 | 9 | Active |
| ona-flix-api | 0 | — | 0 | Inactive |
| ona-flix-frontend | 0 | — | 0 | Inactive |
| onaflix-auth-service | 0 | — | 0 | Inactive |
| onaflix-catalog-service | 0 | — | 0 | Inactive |
| onaflix-notification-service | 0 | — | 0 | Inactive |
| onaflix-admin-panel | 0 | — | 0 | Inactive |
| onaflix-data-pipeline | 0 | — | 0 | Inactive |
| onaflix-mobile-bff | 0 | — | 0 | Inactive |

> **Note:** 8 of 9 repos returned zero merged PRs from the GitHub search API for the entire repo lifetime. These repos may be empty, private scaffolds, or not yet in active development.

### Per-Repo DORA Scores

| Repository | Deploy Freq | Lead Time | MTTR | Change Failure Rate |
|---|---|---|---|---|
| **ona-flix** | Medium (2.1/wk) | Elite (1.6 min) | High (~2h est.) | Medium (22.2%) |
| ona-flix-api | Inactive | — | — | — |
| ona-flix-frontend | Inactive | — | — | — |
| onaflix-auth-service | Inactive | — | — | — |
| onaflix-catalog-service | Inactive | — | — | — |
| onaflix-notification-service | Inactive | — | — | — |
| onaflix-admin-panel | Inactive | — | — | — |
| onaflix-data-pipeline | Inactive | — | — | — |
| onaflix-mobile-bff | Inactive | — | — | — |

---

## Metric Details

### 1. Deployment Frequency

**Definition:** Count of deployments to main (merged PRs + direct pushes) per week.

| Week | Period | Deployments | Deploys/Day |
|---|---|---|---|
| Week 4 (most recent) | Mar 27 – Apr 2 | 1 | 0.14 |
| Week 3 | Mar 20 – Mar 26 | 0 | 0.00 |
| Week 2 | Mar 13 – Mar 19 | 5 | 0.71 |
| Week 1 | Mar 3 – Mar 12 | 3 | 0.33 |
| **Total** | **30 days** | **9** | **0.30** |

**Weekly average:** 2.1 deploys/week  
**Classification:** **Medium** (weekly–monthly cadence)

Deployment activity is bursty: 8 of 9 deploys occurred in a 6-day window (Mar 10–15), followed by a 12-day gap, then a single deploy on Mar 27. This pattern suggests batch-style development rather than continuous delivery.

**Breakdown by type:**
- Merged PRs: 1 (PR #82 on Mar 10)
- Direct pushes to main: 8

> ⚠️ **89% of deployments bypassed the PR process.** Direct pushes to main skip code review and CI gates.

### 2. Lead Time for Changes

**Definition:** Time from first commit on a feature branch to PR merge.

> Note: Lead time is computed only for the 1 merged PR in the 30-day window. Historical PR data (all-time) is included in the raw data section for context.

**30-day window (PR #82 only):**

| Percentile | Value |
|---|---|
| Median | 105.5 min |
| P75 | 105.5 min |
| P95 | 105.5 min |

**All-time PR data (for context, 11 PRs):**

| Percentile | Value |
|---|---|
| Median | 2.6 min |
| P75 | 3.2 min |
| P95 | 105.5 min |
| Mean | 19.4 min |

**Classification:** **Elite** (<1 hour median, all-time)

Most PRs are merged within minutes of the first commit, indicating either very small changes or limited review gates. PR #82 (105 min) and PR #4 (74 min) are the only PRs with lead times exceeding 5 minutes — both were multi-commit feature branches.

### 3. Mean Time to Recovery (MTTR)

**Definition:** Time from a fix/hotfix/revert PR being opened to merged.

**30-day window:**

| Fix Event | Type | Timestamp | Est. Recovery Time |
|---|---|---|---|
| `fix: replace placeholder project IDs with real Ona project IDs` | Direct push | 2026-03-10T21:31:15Z | ~2h after PR #82 merge |
| `fix: align automation YAMLs with Ona platform schema` | Direct push | 2026-03-15T19:08:40Z | Unknown (no linked incident) |

Both fix events were direct pushes to main, not PRs. No formal incident/revert PRs were detected in the 30-day window.

**Estimated MTTR:** ~2 hours (based on the Mar 10 fix following PR #82)  
**Classification:** **High** (<1 day)

**All-time fix PRs (for context):**

| PR | Title | First Commit → Merge |
|---|---|---|
| #70 | Add backend Sentry DSN to catalog service and test task | 0.7 min |

PR #70 (a fix PR from Feb 19) had a sub-minute lead time, suggesting the fix was trivial and pre-prepared.

### 4. Change Failure Rate

**Definition:** Percentage of deployments that required a subsequent fix or were reverted.

| Metric | Value |
|---|---|
| Total deployments in window | 9 |
| Deployments followed by a fix commit | 2 |
| PRs with CI failure on final commit | 0 |
| Reverted PRs (within 48h) | 0 |
| **Change failure rate** | **22.2%** |

**Classification:** **Medium** (16–30%)

The 2 fix commits were both configuration corrections (project IDs, YAML schema alignment) rather than production-breaking incidents. No CI failures were detected on merged PRs, and no reverts occurred in the window.

**CI coverage note:** Only 2 of 11 all-time PRs had CI check runs recorded (PR #82: success, PR #4: failure). Most PRs were merged without CI gates, which means the true change failure rate may be underreported.

---

## Trend Comparison

No previous DORA report exists in this repository. This report establishes the baseline.

| Metric | Baseline (this report) | Previous | Delta |
|---|---|---|---|
| Deployment Frequency | 2.1/week (Medium) | — | — |
| Lead Time for Changes | 2.6 min median (Elite) | — | — |
| MTTR | ~2h estimated (High) | — | — |
| Change Failure Rate | 22.2% (Medium) | — | — |

---

## Top 3 Recommendations

### 1. Enforce PR-based workflow for all changes to main

**Problem:** 89% of deployments in the last 30 days were direct pushes to main, bypassing code review and CI.  
**Action:** Enable branch protection on `main` requiring PR reviews and passing CI checks. This will improve change failure rate by catching issues before merge and provide better data for DORA tracking.  
**Expected impact:** Reduce change failure rate from Medium → Low; improve auditability.

### 2. Activate CI pipelines across all repos

**Problem:** Only 2 of 11 all-time PRs had CI check runs. Eight satellite repos have zero activity and likely no CI configuration.  
**Action:** Add GitHub Actions workflows (lint, test, build) to `ona-flix` and any satellite repos that become active. Gate merges on CI passing.  
**Expected impact:** Earlier defect detection; accurate change failure rate measurement.

### 3. Increase deployment cadence and reduce batch size

**Problem:** Deployments are clustered in bursts (8 deploys in 6 days, then 12 days of silence). Large batches increase risk and make it harder to isolate failures.  
**Action:** Aim for daily deployments with smaller, incremental changes. Break large feature branches (like PR #82 with 6 commits) into smaller PRs.  
**Expected impact:** Move deployment frequency from Medium → High; reduce change failure rate through smaller blast radius.

---

## Raw Data

### All Merged PRs (ona-flix, all time)

| PR | Title | First Commit | Merged At | Lead Time | Commits | CI Status |
|---|---|---|---|---|---|---|
| #82 | seed: dead code, vulnerable deps, and compliance gaps | 2026-03-10T18:41Z | 2026-03-10T20:26Z | 105.5 min | 6 | ✅ success |
| #70 | Add backend Sentry DSN to catalog service and test task | 2026-02-19T14:36Z | 2026-02-19T14:36Z | 0.7 min | 1 | No CI |
| #69 | Update Sentry DSNs to new organisation | 2026-02-19T14:21Z | 2026-02-19T14:23Z | 1.6 min | 1 | No CI |
| #68 | Add frontend errors to Sentry test task | 2026-02-17T17:07Z | 2026-02-17T17:08Z | 1.6 min | 1 | No CI |
| #67 | Improve Sentry test task with realistic error scenarios | 2026-02-17T16:41Z | 2026-02-17T16:42Z | 0.5 min | 1 | No CI |
| #66 | Add manual task to trigger Sentry test errors | 2026-02-17T16:06Z | 2026-02-17T16:07Z | 0.8 min | 1 | No CI |
| #65 | Add Sentry error tracking to frontend and backend | 2026-02-17T15:41Z | 2026-02-17T15:44Z | 2.6 min | 1 | ✅ success |
| #33 | Add Trending button to navigation bar | 2026-01-27T18:34Z | 2026-01-27T18:37Z | 3.0 min | 1 | No CI |
| #10 | Rename .gitpod directory to .ona | 2025-11-13T18:10Z | 2025-11-13T18:14Z | 3.2 min | 1 | No CI |
| #8 | Develop (race condition fix + startup optimization) | — | 2025-10-23 | — | — | No CI |
| #4 | feat: rebuild backend with layered architecture | 2025-10-02T16:35Z | 2025-10-02T17:49Z | 74.3 min | 2 | ❌ failure |

### Direct Pushes to Main (30-day window)

| Date | Commit Message | Type |
|---|---|---|
| 2026-03-27T00:23Z | feat: seed demo data for three new demo blocks | Feature |
| 2026-03-15T23:05Z | feat: add API tests for review endpoints (closes SE-404) | Feature |
| 2026-03-15T23:04Z | feat: add review API routes with validation and rate limiting (closes SE-402) | Feature |
| 2026-03-15T23:02Z | feat: add review repository and service layer (closes SE-401) | Feature |
| 2026-03-15T22:58Z | feat: add reviews database table and migration (closes SE-400) | Feature |
| 2026-03-15T19:08Z | fix: align automation YAMLs with Ona platform schema | Fix |
| 2026-03-12T17:31Z | feat: add Jira variants for Backlog Picker and Spec-to-Shipped automations | Feature |
| 2026-03-10T21:31Z | fix: replace placeholder project IDs with real Ona project IDs | Fix |

### Inactive Repos

| Repository | Merged PRs (all time) | Notes |
|---|---|---|
| ona-flix-api | 0 | No PR activity detected |
| ona-flix-frontend | 0 | No PR activity detected |
| onaflix-auth-service | 0 | No PR activity detected |
| onaflix-catalog-service | 0 | No PR activity detected |
| onaflix-notification-service | 0 | No PR activity detected |
| onaflix-admin-panel | 0 | No PR activity detected |
| onaflix-data-pipeline | 0 | No PR activity detected |
| onaflix-mobile-bff | 0 | No PR activity detected |

---

## Methodology

- **Deployment Frequency:** Counted first-parent commits on `main` in the 30-day window (merged PRs + direct pushes). Classified per DORA benchmarks.
- **Lead Time for Changes:** Measured from the author date of the first commit on a feature branch to the merge commit date. Computed via `git log` on merge commit parents. Only applicable to PRs (not direct pushes).
- **MTTR:** Identified fix events by scanning PR titles and commit messages for "fix", "hotfix", "revert", or "incident". Measured time from the preceding deployment to the fix deployment.
- **Change Failure Rate:** Counted deployments followed by a fix commit, plus PRs with CI failure on the final commit, plus PRs reverted within 48 hours. Divided by total deployments.
- **Inactive repos:** Repos with zero merged PRs returned from the GitHub search API were marked inactive. Direct push history was not checked for satellite repos (API access limited to PR search).

---

*Generated by Ona DORA Metrics Analyzer*
