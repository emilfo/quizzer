# AGENTS.md

## Purpose

This repository hosts an agentic harness for building and operating `quizzer` with `opencode` and `oh-my-opencode-slim`.

Use this file as a startup map. Prefer linked docs and scripts over long inline instructions.

## Start here

1. Read `docs/quickstart.md`
2. Read `docs/architecture.md`
3. Check `docs/quality.md` before making changes
4. Use `docs/agent-map.md` to find commands, hooks, and scripts
5. Read `docs/status.md` to find the active milestone and next deliverable

## Core rules

- Keep repo-local docs as the source of truth
- Prefer small, reversible changes
- Put policy into scripts and checks when possible
- Fail with actionable messages
- Update docs when structure or workflow changes
- Escalate only when a decision needs product or architecture judgment

## Tooling model

### `opencode`
- primary orchestrator
- composes context
- routes work to agents
- runs verification and repair loops

### `oh-my-opencode-slim`
- thin shell/bootstrap layer
- exposes common commands
- should stay legible and low-magic

## Repo map

- `commands/` — agent/operator command entrypoints
- `config/` — harness configuration and templates
- `docs/` — architecture, rules, plans, and onboarding
- `hooks/` — automation triggers and guardrails
- `scripts/` — executable verification/bootstrap tasks
- `src/harness/` — implementation for orchestration and observability

## Working loop

1. orient on docs and current plan
2. select the active milestone in `docs/status.md`
3. read the active plan in `docs/plans/`
4. create or update a plan in `docs/plans/` if the task changes scope
5. implement the smallest useful slice for the current deliverable
6. run the milestone checks from `commands/verify` or `scripts/check-m*`
7. update `docs/status.md` and related docs if behavior, scope, or follow-ups changed

Current quiz app plan set:

- `docs/plans/2026-04-27-quizzer-v1-milestone-1-single-host-authoring.md`
- `docs/plans/2026-04-27-quizzer-v1-milestone-2-joinable-live-session.md`
- `docs/plans/2026-04-27-quizzer-v1-milestone-3-one-question-end-to-end.md`
- `docs/plans/2026-04-27-quizzer-v1-milestone-4-full-quiz-flow.md`
- `docs/plans/2026-04-27-quizzer-v1-milestone-5-hardening.md`

## Required documentation updates

Update these when relevant:

- `docs/architecture.md` for structural changes
- `docs/constraints.md` for new boundaries or decisions
- `docs/quality.md` for new checks or gates
- `docs/agent-map.md` for new commands/hooks/scripts
- `docs/status.md` for milestone, deliverable, blockers, and verification state

## Definition of done

- change is documented
- verification path is clear
- failure modes are inspectable
- next agent can resume without guessing
