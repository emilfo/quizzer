# Constraints

## Repo-local truth

- decisions that affect agent behavior belong in this repository
- avoid relying on memory-only conventions

## Thin wrapper rule

- command wrappers should stay minimal
- shell shortcuts must not obscure real execution paths

## Mechanical enforcement

- rules should become checks when feasible
- prose alone is not a durable safeguard

## Change strategy

- prefer narrow slices
- avoid broad refactors without a plan in `docs/plans/in-progress/` or `docs/plans/backlog/`
- document architecture-impacting changes immediately

## Milestone execution

- `docs/status.md` is the active execution pointer
- work should target one milestone and one smallest useful deliverable at a time
- verification should run through `commands/verify` or the matching `scripts/check-m*`

## Quiz app invariants

- quiz-master actions require authentication
- local development must support a non-Google host sign-in path
- participants join without accounts and use nickname only
- each question must have exactly 4 answer options
- each question must have exactly 1 correct answer
- only published quizzes can be hosted
- participants may answer at most once per question
- answers must not be accepted after a round closes
- correct answers must not be exposed before reveal
- participant reconnect relies on a signed cookie carrying an opaque session token, not raw client-trusted identity
- hosts may only manage their own quizzes and sessions

## Escalation cases

Escalate when:

- multiple designs are valid with product tradeoffs
- a new boundary affects several subsystems
- verification requires credentials or external state not available locally
- realtime, scoring, or security behavior cannot be validated with existing checks
