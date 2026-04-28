# Quickstart

## Objective

Get oriented on the current quizzer milestone and run the local app verification loop with minimal ambiguity.

## Setup order

1. install app dependencies with `npm install`
2. start local Supabase with `supabase start`
3. apply the repo migrations with `supabase db reset`
4. copy the local Supabase URL and anon key into `.env.local`
5. set `QUIZZER_ENABLE_LOCAL_AUTH=true` in `.env.local`
6. set `QUIZZER_PARTICIPANT_COOKIE_SECRET` in `.env.local` for production-like player-session signing
7. create the default local host user with `npm run local:user`
8. run the app with `npm run dev` or `docker compose up app`
9. read the active milestone in `docs/status.md`
10. use `commands/` and `scripts/` for verification

## First-run checklist

- confirm the agent can read `AGENTS.md`
- confirm the agent can discover the docs tree
- confirm the active milestone file exists and matches `docs/status.md`
- confirm `supabase/config.toml` matches local app URLs
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
- `supabase start`
- `supabase db reset`
- `npm run local:user`
- `scripts/check-project-setup`
- `scripts/check-repo-context`

## Notes

Keep this doc short. Put deeper operational details in the docs linked from `AGENTS.md`.
