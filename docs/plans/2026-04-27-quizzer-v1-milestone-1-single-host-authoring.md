# Quizzer v1 — Milestone 1: Single-host authoring

## 1. objective

Enable a quiz master to sign in, create quizzes, add valid questions, and publish a quiz that is ready to host.

## 2. scope

Includes these atomic deliverables:

- D1 — project foundation
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
- quizzes must support many questions
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
7. Build the quiz creation flow for title and draft metadata.
8. Build question editing with validation for 4 options and 1 correct answer.
9. Add publish validation so only complete quizzes can be published.

## 5. acceptance criteria

- app runs locally with Supabase configured
- host can sign in and sign out with Google
- unauthenticated users cannot access host routes
- host can create, edit, and save draft quizzes
- host can add multiple questions to a quiz
- invalid question structures are blocked
- only valid quizzes can be published

## 6. verification

- verify local app startup
- verify Google auth flow in development
- verify protected routes redirect correctly
- verify database migrations apply cleanly
- verify RLS prevents cross-host access
- verify publish validation blocks incomplete quizzes

## 7. follow-ups

- define whether quiz metadata needs description, theme, or category in v1
- decide whether published quizzes remain editable or require draft duplication
