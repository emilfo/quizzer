# Architecture

## Intent

The harness should make the repository easy for agents to navigate, act in, and recover within.

## Layers

### 1. Guidance layer

- `AGENTS.md`
- `docs/*.md`

Purpose: provide stable orientation, boundaries, and plans.

### 2. Shell/bootstrap layer

- `oh-my-opencode-slim`
- `commands/`
- `hooks/`
- `scripts/bootstrap-agent`

Purpose: give lightweight entrypoints without hiding core behavior.

### 3. Orchestration layer

- `opencode`
- `src/harness/`
- `config/`

Purpose: assemble context, route tasks, invoke tools, and manage validation.

### 4. Verification layer

- `scripts/check-agent-context`
- future lint/test/build scripts
- future boundary and contract checks

Purpose: enforce invariants mechanically.

### 5. Observability layer

- future logs, traces, task artifacts, and run summaries

Purpose: let humans and agents inspect what happened and why.

## Suggested `src/harness/` modules

```text
src/harness/
├── context/          # prompt/context assembly
├── routing/          # task → agent/tool selection
├── plans/            # plan loading and execution metadata
├── verification/     # check orchestration and repair loops
├── observability/    # logs, traces, artifacts
└── policies/         # repo-specific constraints and escalation logic
```

## Design constraints

- prefer explicit files over implicit convention
- prefer inspectable scripts over shell aliases
- prefer small commands with stable output
- prefer repo-local templates over tribal knowledge

## Planned evolution

1. document the flow
2. wire bootstrap commands
3. wire verification commands
4. add task artifacts and summaries
5. add continuous cleanup/refinement routines
