# Follow-up Plan — Lane 7 App Implementation

## objective

Implement the selected Lane 7 Playful Rally direction in the shipped app so the live product starts reflecting the chosen visual system instead of only documenting it.

## scope

- update the user-facing routes in `app/` to reflect Lane 7’s playful, projector-led direction
- keep Lane 5’s rounded, friendly, colorful tone as the dominant visual reference
- keep Lane 6’s player-pad and projector-led interaction framing as the dominant structural reference
- update the repo docs and agent harness so the new plan swimlane flow is explicit and maintainable

## constraints

- preserve existing backend behavior and data contracts
- use only repo-local files as design references
- keep host surfaces calmer and more operational than player/projector surfaces
- accept presentational fallbacks where Lane 7 expects data the current public session model does not expose
- update `docs/status.md` and related docs as the active plan changes

## steps

1. Move completed plans into `docs/plans/archive/` and inactive follow-up work into `docs/plans/backlog/`.
2. Move non-selected design proposals into `docs/design/archived/` while keeping Lane 7 active.
3. Update the docs and command harness to explain the new plan swimlane flow.
4. Implement the Lane 7 visual system across home, auth recovery, host, player, and projector routes.
5. Verify the app with the standard follow-up implementation checks.

## verification

- `commands/verify`
- or `scripts/check-follow-up`

## follow-ups

- expose per-option public result counts if the full Lane 7 projector graph should ship later
- decide when to archive or retire the backlog low-fi keyframes plan
