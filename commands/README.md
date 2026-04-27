# Commands

Place lightweight command entrypoints here.

Recommended commands:

- `plan`
- `status`
- `verify`

These should remain thin wrappers around visible scripts or harness modules.

Current behavior:

- `plan` reads the active milestone from `docs/status.md`
- `status` prints the current execution state from `docs/status.md`
- `verify` dispatches to `scripts/check-m1` through `scripts/check-m5`
