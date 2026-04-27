# Quickstart

## Objective

Get oriented on the current quizzer milestone and run the local app verification loop with minimal ambiguity.

## Setup order

1. install app dependencies with `npm install`
2. configure local environment and Supabase access
3. apply SQL files in `supabase/migrations/`
4. read the active milestone in `docs/status.md`
5. use `commands/` and `scripts/` for verification

## First-run checklist

- confirm the agent can read `AGENTS.md`
- confirm the agent can discover the docs tree
- confirm the active milestone file exists and matches `docs/status.md`
- confirm at least one verification command works
- confirm failures are visible and actionable

## Minimal operating workflow

1. open task
2. read `AGENTS.md`
3. read `docs/status.md`
4. read the active milestone plan in `docs/plans/`
5. implement the smallest useful slice
6. run `commands/verify` for the active milestone
7. record follow-up work in `docs/status.md` and the relevant plan

## Main local commands

- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `commands/plan`
- `commands/status`
- `commands/verify`
- `scripts/check-project-setup`
- `scripts/check-repo-context`

## Notes

Keep this doc short. Put deeper operational details in the docs linked from `AGENTS.md`.
