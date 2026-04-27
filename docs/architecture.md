# Architecture

## Intent

The repository should make the quiz product, its milestones, and its verification path easy for agents and operators to navigate.

## Layers

### 1. Guidance layer

- `AGENTS.md`
- `docs/*.md`

Purpose: provide stable orientation, boundaries, milestones, and recovery paths.

### 2. Product layer

- `app/`
- `lib/`
- `supabase/migrations/`
- `supabase/config.toml`
- `tests/`

Purpose: implement quizzer itself, including host auth, local auth setup, authoring flows, validation, and database behavior.

### 3. Support tooling layer

- `commands/`
- `hooks/`
- `scripts/check-project-setup`
- `scripts/check-repo-context`
- `scripts/check-m*`

Purpose: provide lightweight entrypoints and mechanical checks without hiding core behavior.

### 4. Repo automation layer

- `src/tooling/`
- `config/`

Purpose: hold repo-specific automation, templates, and observability helpers that support the app but are not the product itself.

### 5. Verification layer

- `scripts/check-repo-context`
- future lint/test/build scripts
- future boundary and contract checks

Purpose: enforce invariants mechanically.

### 6. Observability layer

- future logs, traces, task artifacts, and run summaries

Purpose: let humans and agents inspect what happened and why.

## Suggested `src/tooling/` modules

```text
src/tooling/
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

1. keep milestone docs aligned with shipped quiz behavior
2. expand verification from m1 through m5
3. add task artifacts and summaries where they help debugging
4. keep support tooling small and legible
5. add continuous cleanup/refinement routines
