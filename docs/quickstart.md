# Quickstart

## Objective

Bootstrap a local harness that lets agents work with minimal ambiguity.

## Setup order

1. install and configure `opencode`
2. install `oh-my-opencode-slim`
3. copy or generate local config into `config/`
4. expose common entrypoints in `commands/`
5. make verification scripts runnable from `scripts/`

## First-run checklist

- confirm the agent can read `AGENTS.md`
- confirm the agent can discover the docs tree
- confirm at least one bootstrap command works
- confirm at least one verification command works
- confirm failures are visible and actionable

## Minimal operating workflow

1. open task
2. read `AGENTS.md`
3. read `docs/status.md`
4. read the active milestone plan in `docs/plans/`
5. implement the smallest useful slice
6. run `commands/verify` for the active milestone
7. record follow-up work in `docs/status.md` and the relevant plan

## Suggested first implementations

- `scripts/bootstrap-agent`
- `scripts/check-agent-context`
- `commands/plan`
- `commands/status`
- `commands/verify`
- `src/harness/context/`
- `src/harness/verification/`

## Notes

Keep this doc short. Put deeper operational details in the docs linked from `AGENTS.md`.
