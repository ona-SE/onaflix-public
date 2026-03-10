# Spec-to-Shipped Automation

Takes a product spec, breaks it into implementable tickets, creates them in Linear, then executes them sequentially -- writing code, running tests, opening PRs for each.

## Trigger

Manual (interactive start, then automated execution).

## Scope

- **Repo:** ona-se/ona-flix
- **Issue tracker:** Linear, Sales Engineering team
- **Spec file:** specs/movie-reviews.md

## Prerequisites

- Linear MCP integration configured
- specs/movie-reviews.md committed to the repo

## Automation Steps

### Step 1 -- Break spec into tickets [Prompt]

```
Read the product spec at specs/movie-reviews.md.

Break it into 4-5 implementable engineering tickets. Each ticket should have:
- A clear title (e.g., "Add reviews database table and migration")
- A description with technical details
- Acceptance criteria that can be verified with tests
- Estimated complexity (S/M/L)

Create each ticket in Linear under the Sales Engineering team. Use the Linear MCP integration.

Output the list of tickets you created with their IDs.
```

### Step 2 -- Implement tickets sequentially [Prompt, repeated]

```
Implement Linear ticket [ID]: [title].

Follow the ona-flix codebase conventions:
- TypeScript with strict types
- Express route handlers in src/routes/
- Business logic in src/services/
- Database queries in src/repositories/
- Tests in src/__tests__/ using Jest and Supertest
- Zod for input validation

Follow the acceptance criteria exactly. Write tests. Run `npm test` in backend/catalog. Keep iterating until all tests pass.

When done, commit and use /pr to open a pull request referencing the Linear ticket.
```

### Step 3 -- Update tickets [Script]

```
Update each Linear ticket with the PR link and move to "In Review" status.
```

## Expected Demo Output

- 4-5 well-scoped tickets created in Linear
- At least 3 tickets implemented with passing tests and PRs
- 1-2 tickets still in progress (realistic partial completion)
- Each PR references its Linear ticket

## Reset Procedure

1. Archive the created Linear tickets
2. Close/delete the PRs
3. `git checkout main && git branch -D [branch-names]`
