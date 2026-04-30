# Follow-up Plan — Public Option Counts

## objective

Expose public per-option counts during round results so projector and player reveal states can show how the room answered.

## scope

- extend the public session reveal payload with per-option response counts for the active question
- keep the existing public/player session contracts stable outside the reveal payload addition
- render the new counts on the projector round-results surface and the player round-results surface
- add test coverage for the new helper logic and update milestone status notes

## constraints

- preserve pre-reveal correctness boundaries
- only expose counts during `round_results`
- keep option ordering identical to the question option order
- use repo-local verification only
- avoid changing unrelated gameplay rules or leaderboard behavior

## steps

1. Add SQL support for building public per-option counts for the current question.
2. Extend the public reveal type in `lib/gameplay.ts`.
3. Render counts in projector and player round-results UIs.
4. Add unit coverage for any new helper behavior.
5. Run the follow-up verification loop and update `docs/status.md`.

## verification

- `commands/verify`
- or `scripts/check-follow-up`

## follow-ups

- decide whether the host controls should show the same public per-option count graph later
- consider adding an integration-level check for public reveal payload shape if the test surface grows
