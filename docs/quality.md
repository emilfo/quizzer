# Quality

## Standard loop

1. plan the change
2. implement the smallest slice
3. run targeted checks
4. fix failures
5. record any new invariant or follow-up

## Required checks to add over time

- context integrity checks
- formatting/lint checks
- unit/integration tests
- contract or boundary validation
- artifact/log capture for failures

## Milestone gates

### M1 — single-host authoring

- auth route protection is verified
- schema and migrations apply cleanly
- quiz validation enforces 4 options and 1 correct answer
- local checks run with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`

### M2 — joinable live session

- only published quizzes can start sessions
- join code and QR join flow are verified
- lobby realtime sync is verified across host, projector, and player views

### M3 — one question end-to-end

- one-answer-per-player rule is enforced
- round close blocks late submissions
- scoring and round-result calculations are checked

### M4 — full quiz flow

- multi-question progression follows saved order
- finished sessions reject new gameplay mutations
- final leaderboard matches accumulated score

### M5 — hardening

- reconnect restores common player flows
- correct answers do not leak before reveal
- security boundaries and regression checks run cleanly

## Quality rules

- checks must be runnable locally
- failures must explain how to recover
- flaky checks should be fixed or removed
- slow checks should be separated from fast default checks
- commits should be small, atomic, and easy to revert
- commit messages should follow conventional commits

## Initial repo acceptance criteria

- docs map is complete enough for a fresh agent
- app setup steps are documented
- repo context check exists
- command and script responsibilities are explicit

## Future enforcement ideas

- verify required docs exist
- verify plan files follow a template
- verify commands call real scripts rather than hidden shell logic
- verify `docs/status.md` points to a real active milestone file
- verify each milestone has a corresponding `scripts/check-m*` script
