# Parallel Design Lanes and Rubric

Based on `docs/plans/archive/2026-04-29-follow-up-design-proposal-planning.md` and the shipped host/player/projector surfaces.

## 1. objective

Create five design directions that can be explored in parallel without drifting the product flow. The result should let the team compare distinct visual systems against the same real quizzer experience: authoring, hosting, joining, answering, projecting, syncing, and finishing.

## 2. product surfaces in scope

Canonical route/state inventory: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md`

- `app/page.tsx` — home, host auth, player join entry
- `app/auth/error/page.tsx` — host sign-in failure state
- `app/host/page.tsx` — host dashboard
- `app/host/[quizId]/page.tsx` — quiz editor
- `app/host/session/[sessionId]/page.tsx` — host live session controls
- `app/play/[joinCode]/page.tsx` — player join and gameplay
- `app/projector/[joinCode]/page.tsx` — projector and audience display

Shared behavior constraints to respect:

- `components/live-session-refresh.tsx` — live state refresh behavior
- cookie/session-token-based player restoration and rejoin

## 3. guardrails to prevent product-flow drift

- Do not invent new gameplay rules, states, or modes.
- Keep the shipped flow intact: home → join/auth → editor/dashboard → lobby → question → results → finished.
- Preserve current constraints: one active session per host, lobby-only join, one answer per question, and read-only projector behavior.
- Treat `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` as the single route/state source of truth for every lane.
- Every concept must cover the existing edge cases: invalid join code, session not found, join closed, join failure, duplicate nickname, duplicate answer, round closed, rejoin/reconnect, and finished-session readback.
- Differences between lanes should come from tone, hierarchy, density, motion, and framing—not from changing the underlying product logic.
- If a lane requires a new component or structural layout idea, mark it as a design dependency, not a scope expansion.

## 4. recommended parallel work split

### Shared discovery owner

Owns the single source of truth for flow, state inventory, and terminology. Responsibilities:

- verify which states each route must express
- maintain the cross-surface matrix
- resolve ambiguities before lane work starts
- keep the proposals aligned to real shipped behavior

### Lane owners

One owner per design lane. Responsibilities:

- develop the lane thesis
- apply the lane consistently across all surfaces
- call out risks and implementation complexity
- keep the lane distinct from the others
- record the inventory doc revision/date used while drafting

### Synthesis owner

Owns comparison, scoring, and merge recommendations. Responsibilities:

- score each lane against the rubric
- identify the strongest direction
- note the best traits to borrow from the other lanes
- prepare the next-phase recommendation

## 5. app-wide design principles

1. **Clarity first** — users should understand the current state within seconds.
2. **Role-aware hierarchy** — host, player, and projector should feel related but not identical.
3. **Live-state visibility** — waiting, syncing, locked, and finished states must read instantly.
4. **Low-friction interaction** — joining, answering, and advancing should feel obvious and confident.
5. **Distance-safe projector design** — large type, simple composition, and minimal ambiguity.
6. **Operational confidence for hosts** — validation, progress, and control states should feel trustworthy.
7. **Mobile confidence for players** — touch targets, answer states, and feedback must be unmissable.
8. **One system, many moods** — all lanes must preserve the same content structure and state language.

## 6. five intentionally distinct design lanes

### Lane 1 — Quiet Control Room

**Thesis:** calm, precise, and high-trust. Quizzer feels like a refined operations tool with generous space and disciplined hierarchy.

- **Host:** most detailed surface; prioritize validation, session control, and clean status readout.
- **Player:** strip to the essentials; minimize visual noise around nickname entry and answer selection.
- **Projector:** sparse and highly legible; treat it as a stage-light display, not a dashboard.

### Lane 2 — Broadcast Night

**Thesis:** energetic, theatrical, and show-forward. Quizzer feels like a live game show with stronger contrast and bolder moments.

- **Host:** control room energy, but secondary to the broadcast experience.
- **Player:** exciting but still frictionless; answers should feel rewarding, not gimmicky.
- **Projector:** the hero surface; maximize spectacle, round transitions, and audience readability.

### Lane 3 — Editorial Precision

**Thesis:** premium, type-led, and composed. Quizzer feels designed like a magazine or keynote deck: restrained, sharp, and intentional.

- **Host:** structured information architecture, with strong typography for state and instruction.
- **Player:** elegant and minimal; keep form and options extremely readable.
- **Projector:** large editorial moments, minimal supporting chrome, maximum scan speed.

### Lane 4 — Modular Lab

**Thesis:** systematized, flexible, and visibly structured. Quizzer feels like a well-organized product lab built from clear panels and repeatable patterns.

- **Host:** best fit for dense operational content and comparison across sessions.
- **Player:** simplify the modular language so it stays approachable on mobile.
- **Projector:** reduce panel complexity; preserve the modular rhythm without sacrificing distance readability.

### Lane 5 — Playful Signal

**Thesis:** expressive, friendly, and memorable. Quizzer feels approachable and lightly mischievous while still serious about timing and clarity.

- **Host:** keep delight secondary to control confidence.
- **Player:** most expressive surface; make joining and answering feel welcoming.
- **Projector:** controlled playfulness; use character without undermining legibility.

## 7. standard per-lane template

Each lane must be documented with the same structure:

1. **Lane name**
2. **One-sentence thesis**
3. **Target mood words**
4. **Primary audience emphasis**
5. **Host treatment**
6. **Player treatment**
7. **Projector treatment**
8. **Shared-state treatment**
9. **What stays constant across the app**
10. **What changes most visibly**
11. **Key risks**
12. **Implementation difficulty**
13. **Why this lane matters**

## 8. consistency checklist

- Same state vocabulary across all five lanes.
- Same route coverage across all five lanes.
- Clear distinction between host action states and read-only public states.
- Player join and answer flows never feel harder than the current MVP.
- Projector always reads fastest from a distance.
- Empty, error, waiting, and finished states are not treated as afterthoughts.
- CTA priority is consistent within each lane.
- Visual treatment of status, success, and error is coherent across surfaces.
- Each lane can be compared without needing to reinterpret the product flow.

## 9. scoring rubric

Use a 1–5 score for each category, then multiply by the weight.

- **Flow fidelity (20%)** — stays true to the shipped product and known constraints.
- **Host clarity (20%)** — supports control, validation, and confidence.
- **Player confidence (20%)** — makes join and answer actions obvious on mobile.
- **Projector readability (20%)** — works at distance and in a live room.
- **Distinctiveness (10%)** — feels meaningfully different from the other lanes.
- **Cross-surface coherence (10%)** — host/player/projector feel like one family.

Scoring guidance:

- **5** = excellent fit, immediately usable
- **3** = workable with notable revision
- **1** = weak fit or unclear direction

## 10. recommended next-phase sequence

1. Draft all five proposal lanes from the same discovery brief.
2. Review each lane against the guardrails and consistency checklist.
3. Score all five lanes using the rubric.
4. Select one primary direction and one fallback merge set.
5. Convert the chosen direction into low-fi keyframes for host, player, and projector.
6. Resolve component and state rules in low-fi before polishing visuals.
7. Move the approved low-fi set into high-fi execution.
8. Keep the fallback traits as optional refinements, not extra design branches.

## 11. note

This document is for planning and comparison only. It should help the team choose a direction and sequence the next design phase without redefining the product.
