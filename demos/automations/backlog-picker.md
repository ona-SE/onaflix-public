# Backlog Picker Automation

Scheduled automation that scans the Linear backlog, self-assesses ticket feasibility, picks the highest-priority feasible ticket, implements it, and opens a PR.

## Trigger

Scheduled daily at 7:00 AM (or manual trigger for demos).

## Scope

- **Repo:** ona-se/ona-flix
- **Issue tracker:** Linear, Sales Engineering team, "OnaFlix Demo Backlog" project

## Prerequisites

- Linear MCP integration configured (or LINEAR_API_KEY secret)
- ona-flix DevContainer cached for fast spin-up

## Automation Steps

### Step 1 -- Fetch backlog [Script]

```bash
# Using Linear MCP or API to fetch open tickets from the OnaFlix Demo Backlog project
# The agent will use the Linear MCP tool to list issues in the project
```

### Step 2 -- Self-assess and pick [Prompt]

```
You have access to the Linear MCP integration. Query the "OnaFlix Demo Backlog" project in the Sales Engineering team for all issues in Backlog status.

For each ticket:
1. Read the title and full description
2. Assess whether you can complete it autonomously. Consider:
   - Does it require external tool access you don't have? (Figma, Stripe, CockroachDB)
   - Is the scope too large for a single session? (multi-week projects, infrastructure changes)
   - Is the acceptance criteria clear enough to verify?
   - Can you run tests to validate your work?
3. Score each ticket 1-5 on feasibility (5 = definitely can do, 1 = definitely cannot)

Pick the highest-priority ticket you scored 4 or 5. If multiple tickets tie on priority, pick the one with the clearest acceptance criteria.

Output your assessment as a table, then explain which ticket you picked and why.
```

### Step 3 -- Implement [Prompt]

```
Implement the ticket you selected. Follow the codebase conventions in ona-flix:
- TypeScript with strict types
- Express route handlers in src/routes/
- Business logic in src/services/
- Database queries in src/repositories/
- Tests in src/__tests__/ using Jest and Supertest

Write tests that cover the acceptance criteria. Run the test suite with `npm test`. Keep iterating until all tests pass.
```

### Step 4 -- Commit and PR [Script + Prompt]

```bash
git add -A && git commit -m "feat: implement [ticket-id] - [ticket-title]"
```

```
Use the /pr slash command to create a pull request. Reference the Linear ticket ID in the PR title and description. Summarize what was implemented and note any assumptions you made.
```

### Step 5 -- Update ticket [Script]

```
Update the Linear ticket status and add a comment with the PR link.
```

## Expected Demo Output

- Agent assessment table showing all 13 tickets with feasibility scores
- The 3 unfriendly tickets (Figma redesign, CockroachDB migration, Stripe integration) scored 1-2
- A well-scoped ticket picked and implemented
- PR with passing tests and Linear ticket reference

## Reset Procedure

1. Close/delete the PR
2. Reopen the Linear ticket (set back to Backlog)
3. `git checkout main && git branch -D [branch-name]`
