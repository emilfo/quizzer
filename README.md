# quizzer

Single-host quiz authoring app plus the agentic harness docs/scripts used to build it.

## Milestone 1 app

- Next.js App Router app for host authoring
- Supabase SSR auth with Google sign-in
- Supabase SQL migrations for profiles, quizzes, questions, and question options
- Host dashboard and quiz editor with publish validation

## Local app commands

- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

Apply the SQL files in `supabase/migrations/` to your Supabase project before testing runtime authoring flows.

## Goals

- Keep repo-local instructions as the source of truth
- Give agents a small, reliable entrypoint
- Push quality rules into scripts, checks, and structure
- Make progress, failures, and recovery paths easy to inspect

## Entry points

- `AGENTS.md` — agent startup map
- `docs/quickstart.md` — operator setup flow
- `docs/architecture.md` — harness layout and responsibilities
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
    └── harness/
```

## Harness assumptions

- `opencode` is the primary orchestration runtime
- `oh-my-opencode-slim` provides lightweight shell/bootstrap ergonomics
- future automation should prefer explicit scripts over hidden shell behavior

## Current verification

Run `commands/verify m1` or `scripts/check-m1` for the local Milestone 1 verification loop.
