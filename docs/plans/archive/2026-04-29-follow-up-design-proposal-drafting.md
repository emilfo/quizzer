# Follow-up Plan — Design Proposal Drafting

## 1. objective

Draft five distinct design proposal lanes from the approved design-planning brief so the team can compare complete host, player, and projector directions without additional product discovery.

## 2. scope

Includes these deliverables:

- five lane proposal documents under `docs/design/proposals/`
- one comparison worksheet for scoring, selection, and merge notes
- status updates that point the next reviewer at the scoring and selection step

Working artifacts created from this plan:

- `docs/design/proposals/2026-04-29-lane-1-quiet-control-room.md`
- `docs/design/proposals/2026-04-29-lane-2-broadcast-night.md`
- `docs/design/proposals/2026-04-29-lane-3-editorial-precision.md`
- `docs/design/proposals/2026-04-29-lane-4-modular-lab.md`
- `docs/design/proposals/2026-04-29-lane-5-playful-signal.md`
- `docs/design/proposals/2026-04-29-proposal-comparison-worksheet.md`

Inputs that remain authoritative:

- `docs/design/archived/2026-04-29-keyframe-inventory-and-matrix.md`
- `docs/design/archived/2026-04-29-parallel-design-lanes-and-rubric.md`

Out of scope:

- selecting the winning lane
- merging traits into a final direction
- low-fidelity or high-fidelity frame production
- implementation of any visual direction in the app

## 3. constraints

- every lane must preserve the shipped MVP flow and route/state inventory
- every lane must use the same canonical state names: lobby, question open, round results, finished, invalid join code / session not found, validation, reconnect / rejoin
- lanes must stay planning-focused and concrete enough for low-fi drafting without specifying implementation details
- lane differentiation must come from visual thesis, hierarchy, framing, and tone rather than product-flow changes
- host, player, and projector surfaces must all be covered in each lane

## 4. steps

1. Use the canonical inventory doc as the shared source of truth for route/state coverage.
2. Draft one proposal per lane using the shared template and the same required low-fi frame list.
3. Record the inventory revision/date used in each lane doc.
4. Add a comparison worksheet with a coverage gate, weighted rubric, and merge-note fields.
5. Review the full set for alignment, distinctiveness, and low-fi readiness.
6. Update `docs/status.md` so the next step is explicit.

## 5. acceptance criteria

- all five lane docs exist and cover the same real routes and state families
- each lane is distinct enough to compare meaningfully against the others
- each lane includes a required low-fi frame list so later design work does not drift
- the comparison worksheet can be used directly for scoring and selection
- the proposal set stays design/planning focused and does not drift into implementation details

## 6. verification

- verify all proposal files exist under `docs/design/proposals/`
- verify each lane references the canonical inventory and records the inventory revision/date used
- verify each lane includes canonical state coverage and required low-fi frames
- verify the worksheet includes the pre-score coverage gate and weighted rubric
- verify `docs/status.md` points to the correct active plan and next action

## 7. follow-ups

- score all five lanes with the worksheet before starting low-fi work
- pick one primary lane and capture merge traits from the other four
- create the next plan for low-fi keyframes once a direction is selected
