# Agent Map

## Purpose

This file maps the main execution surfaces an agent or operator should use.

## Commands

### `commands/plan`
- show the active milestone and plan file from `docs/status.md`
- list available plans in `docs/plans/in-progress/`, `docs/plans/backlog/`, and `docs/plans/archive/`
- remain read-only unless explicitly extended later

### `commands/verify`
- run the standard local quality loop
- should resolve the active milestone from `docs/status.md` by default
- should call the relevant scripts in `scripts/`
- for M1, runs `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`
- for follow-up implementation plans, falls back to `scripts/check-follow-up`

### `commands/status`
- summarize active milestone, current deliverable, recent checks, blockers, and follow-ups

## Scripts

### `scripts/check-project-setup`
- validate local prerequisites
- print next steps
- avoid mutating hidden state without explicit output

### `scripts/export-proposal-keyframes.mjs`
- export styled PNG screenshots from the static proposal `keyframes/index.html` boards
- keep the exported pictures coupled to the finished HTML/CSS rather than separate mock files
- validate that each proposal lane contains the expected ten export sheets

### `scripts/check-repo-context`
- verify required docs and directories exist
- fail with a clear remediation message

### `scripts/check-m1` … `scripts/check-m5`
- run milestone-targeted checks
- succeed with explicit deferred notices when app-level checks are not available yet
- fail with exact remediation steps when milestone prerequisites are missing
- `scripts/check-m1` now validates the app files, local Supabase config, tests, and local quality commands for single-host authoring

## Hooks

Potential future uses:

- pre-task context validation
- post-change verification reminders
- plan freshness checks

## Expected outputs

Every command/script should:

- print a short purpose line
- print success/failure clearly
- print exact remediation steps on failure
- avoid interactive prompts unless explicitly intended
- prefer deriving state from repo files over hidden shell state

## Plan swimlane flow

- keep the active plan under `docs/plans/in-progress/`
- move deferred or not-yet-active work to `docs/plans/backlog/`
- move completed or superseded work to `docs/plans/archive/`
- when `docs/status.md` changes, update `active_milestone_file` and move the plan file to the matching swimlane in the same change

## Commit policy

- agents may create commits for completed bounded changes
- prefer small atomic commits over batching unrelated work
- use conventional commit messages
