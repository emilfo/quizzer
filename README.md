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

## Run locally for testing

1. install dependencies:

   ```bash
   npm install
   ```

2. start local Supabase:

   ```bash
   supabase start
   supabase db reset
   ```

3. create `.env.local` with your local Supabase values:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<your local publishable key>"
   QUIZZER_ENABLE_LOCAL_AUTH="true"
   ```

   You can get the local publishable key from `supabase status`.

4. create the default local host user:

   ```bash
   npm run local:user
   ```

5. start the app:

   ```bash
   npm run dev
   ```

6. open `http://localhost:3000`

7. sign in with the default local host account:

   - email: `host@example.com`
   - password: `quizzer-local-password`

8. test the live flow:

   - open the host dashboard
   - start or resume a live session
   - open the projector view and player join view
   - verify that `/host/session/[sessionId]` now shows the projector-style session view with only subtle host controls for advancing the quiz

### Local auth note

If the home page shows **Continue with Google** instead of the local email/password form, your shell likely has remote Supabase environment variables overriding `.env.local`. Restart `npm run dev` with the local Supabase values in scope.

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
