# quizzer

Scaffold for an agentic development harness inspired by OpenAI's harness engineering guidance, adapted for `opencode` and `oh-my-opencode-slim`.

## Goals

- Keep repo-local instructions as the source of truth
- Give agents a small, reliable entrypoint
- Push quality rules into scripts, checks, and structure
- Make progress, failures, and recovery paths easy to inspect

## Entry points

- `AGENTS.md` — agent startup map
- `docs/quickstart.md` — operator setup flow
- `docs/architecture.md` — harness layout and responsibilities
- `docs/quality.md` — invariants and verification loop
- `docs/agent-map.md` — commands, hooks, and execution surfaces

## Proposed layout

```text
.
├── AGENTS.md
├── README.md
├── commands/
├── config/
├── docs/
│   ├── agent-map.md
│   ├── architecture.md
│   ├── constraints.md
│   ├── plans/
│   ├── quality.md
│   └── quickstart.md
├── hooks/
├── scripts/
└── src/
    └── harness/
```

## What this scaffold assumes

- `opencode` is the primary orchestration runtime
- `oh-my-opencode-slim` provides lightweight shell/bootstrap ergonomics
- future automation should prefer explicit scripts over hidden shell behavior

## Next steps

1. Wire real `opencode` commands into `commands/`
2. Add executable checks under `scripts/`
3. Implement harness modules under `src/harness/`
4. Add project-specific plans in `docs/plans/`
