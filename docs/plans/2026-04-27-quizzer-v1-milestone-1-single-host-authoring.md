# Quizzer v1 — Milestone 1: Single-host authoring

## 1. objective

Enable a quiz master to sign in, create quizzes, add valid questions, and publish a quiz that is ready to host.

## 2. scope

Includes these atomic deliverables:

- D1 — project foundation: Next.js app, Supabase wiring, env/config, local startup
- D2 — host authentication
- D3 — database schema
- D4 — host dashboard
- D5 — quiz builder: create quiz
- D6 — quiz builder: question editor
- D7 — publish-ready quiz validation

Out of scope:

- live sessions
- participant join flow
- realtime sync
- scoring and leaderboards

## 3. constraints

- use Next.js + Supabase
- host auth is Google sign-in
- D1 is limited to app foundation and Supabase/bootstrap setup; auth starts in D2
- quizzes must support many questions
- quiz metadata in v1 is title only
- published quizzes remain editable in place after publish
- each question stores a prompt only in v1
- each question must have exactly 4 answer options
- each question must have exactly 1 correct answer
- prefer small, reversible slices
- keep repo-local docs as the source of truth

## 4. steps

1. Create the Next.js app foundation and connect Supabase.
2. Configure environment variables, base layout, and deployment assumptions.
3. Add Google auth for quiz masters.
4. Create `profiles`, `quizzes`, `questions`, and `question_options` schema.
5. Add row-level security so hosts can only manage their own quiz data.
6. Build the host dashboard with list/create/edit affordances.
7. Build the quiz creation flow for title-only draft metadata.
8. Build question editing with prompt-only questions and validation for 4 options and 1 correct answer.
9. Add publish validation so only quizzes with a title and at least 1 complete valid question can be published.

## 5. acceptance criteria

- app runs locally with Supabase configured
- host can sign in and sign out with Google
- unauthenticated users cannot access host routes
- host can create, edit, and save draft quizzes
- host can add multiple questions to a quiz
- invalid question structures are blocked
- published quizzes remain editable by their host
- only quizzes with a title and at least 1 valid question can be published

## 6. verification

- verify local app startup
- verify Google auth flow in development
- verify protected routes redirect correctly
- verify database migrations apply cleanly
- verify RLS prevents cross-host access
- verify publish validation blocks incomplete quizzes

## 7. follow-ups

- consider whether description, theme, category, explanation, or images should be added after v1
