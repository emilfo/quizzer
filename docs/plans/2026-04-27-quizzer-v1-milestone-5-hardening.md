# Quizzer v1 — Milestone 5: Hardening

## 1. objective

Make the quiz app resilient, secure, and maintainable enough for regular use and future iteration.

## 2. scope

Includes these atomic deliverables:

- D20 — reconnect and resilience
- D21 — security and access rules
- D22 — quality checks
- D23 — documentation

Out of scope:

- advanced analytics
- team play
- richer host moderation tools

## 3. constraints

- reconnect should handle common refresh/disconnect cases without requiring player accounts
- correct answers must not leak before reveal
- checks must be runnable locally
- docs must be sufficient for another agent or developer to resume work
- participant reconnect identity is a signed cookie that carries an opaque session token
- players who already answered and refresh mid-round return to a submitted waiting state
- local verification for milestone completion includes typecheck, lint, tests, and build

## 4. steps

1. Add lightweight participant rejoin strategy for device refresh/reconnect.
2. Restore current session/question state on reconnect.
3. Review and tighten RLS and mutation paths for host and participant actions.
4. Ensure public/projector/player queries do not expose hidden correctness data mid-round.
5. Add migration workflow, linting, formatting, and typechecking.
6. Add targeted tests for scoring, publishing, joining, and answer submission rules.
7. Document architecture, data model, realtime state flow, and setup instructions.

## 5. acceptance criteria

- common player refresh cases recover into the active session
- players cannot access hidden correct-answer data before reveal
- hosts cannot access or mutate other hosts' quizzes
- core checks run locally and fail clearly
- docs explain how to run, extend, and verify the app

## 6. verification

- verify reconnect behavior during lobby, active question, and result states
- verify security boundaries with authenticated and unauthenticated clients
- verify tests cover core gameplay rules
- verify docs reference real commands and current file structure

## 8. implementation checklist

- [x] sign participant cookies and bind player RPCs to an opaque session token
- [x] restore joined player state across lobby, question, result, and finished screens
- [x] keep pre-reveal correctness out of public/player/projector payloads and finished transitions
- [x] allow public finished-state reads so projector and player refresh flows can complete cleanly
- [x] upgrade `scripts/check-m5` to run the local quality loop

## 7. follow-ups

- consider anti-cheat or latency-normalization improvements if speed scoring proves noisy
- consider observability for session failures and reconnect anomalies
