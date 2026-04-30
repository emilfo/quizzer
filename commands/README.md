# Commands

Place lightweight command entrypoints here.

Recommended commands:

- `plan`
- `status`
- `verify`

These should remain thin wrappers around visible scripts or repo support modules.

Current behavior:

- `plan` reads the active milestone from `docs/status.md`
- `plan` lists plan swimlanes from `docs/plans/in-progress/`, `docs/plans/backlog/`, and `docs/plans/archive/`
- `status` prints the current execution state from `docs/status.md`
- `verify` dispatches to `scripts/check-m1` through `scripts/check-m5`, or `scripts/check-follow-up` for follow-up implementation work
- setup/context checks live in `scripts/check-project-setup` and `scripts/check-repo-context`
