# quizzer

Live quiz app repository with milestone-based docs, checks, and support tooling.

## Milestone 1 app

- Next.js App Router app for host authoring
- Supabase SSR auth with Google sign-in
- Supabase SQL migrations for profiles, quizzes, questions, and question options
- Host dashboard and quiz editor with publish validation

## Local app commands

- `npm install`
- `npm run dev`
- `docker compose up app`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run local:user`

For local development, start Supabase with `supabase start`, apply the repo migrations with `supabase db reset`, set `QUIZZER_ENABLE_LOCAL_AUTH=true` in `.env.local`, copy the local URL and anon key into `.env.local`, then run `npm run local:user` once to create the default local host account.

## Current focus

- Milestone 1: single-host authoring
- Next planned milestones: live session join, question rounds, full quiz flow, and hardening

## Repo goals

- Keep repo-local instructions as the source of truth
- Give agents and operators a small, reliable entrypoint
- Push quality rules into scripts, checks, and structure
- Make progress, failures, and recovery paths easy to inspect

## Entry points

- `AGENTS.md` — agent startup map
- `docs/quickstart.md` — operator setup flow
- `docs/architecture.md` — app structure and support tooling responsibilities
- `docs/quality.md` — invariants and verification loop
- `docs/agent-map.md` — commands, hooks, and execution surfaces

## Repo layout

```text
.
├── AGENTS.md
├── README.md
├── commands/
├── config/
├── docs/
│   ├── agent-map.md
│   ├── architecture.md
│   ├── constraints.md
│   ├── plans/
│   ├── quality.md
│   └── quickstart.md
├── hooks/
├── app/
├── lib/
├── supabase/
├── tests/
└── src/
    └── tooling/
```

## Working assumptions

- the repository itself is the source of truth for active plans and constraints
- future automation should prefer explicit scripts over hidden shell behavior
- support tooling should stay secondary to the quiz product code

## Current verification

Run `commands/verify m1` or `scripts/check-m1` for the local Milestone 1 verification loop.

## Local auth defaults

- set `QUIZZER_ENABLE_LOCAL_AUTH=true` in `.env.local`
- email: `host@example.com`
- password: `quizzer-local-password`
