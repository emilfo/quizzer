# Follow-up Low-Fi Keyframes Plan

## objective

Convert the selected design direction into low-fi keyframes for all canonical quizzer surfaces and states, using **Lane 7 Playful Rally** as the base system and borrowing only the traits needed to keep it readable, fast, and implementation-ready.

This phase should lock the structural design language before any high-fi polish begins.

## scope

### base direction

- **Primary base:** Lane 7 — Playful Rally
- **Lane 7 merge source:**
  - Lane 5 — Playful Signal: colors, font feel, friendliness, roundedness, and inviting player tone
  - Lane 6 — Classroom Rally: projector-led question/answer model, color-first answer pads, mobile/iPad quick-tap form factor, answer graph, and top-3 movement
- **Supporting borrow traits:**
  - Lane 1 — Quiet Control Room: recovery calm and operational restraint where the room-facing system needs more discipline
  - Lane 3 — Editorial Precision: hierarchy polish if needed for projector reading order

Promotion confirmation:

- promote **Lane 7 — Playful Rally** as the preferred direction based on user preference
- keep the **Lane 5 visual character** as the dominant aesthetic reference inside Lane 7
- keep the **Lane 6 form factor** as the dominant interaction/presentation model inside Lane 7
- preserve the fun, inviting, kid/youth-friendly classroom tone while maintaining enough hierarchy for live use

### surfaces in scope

- `/` — home, host auth, player join
- `/auth/error` — sign-in recovery
- `/host` — dashboard
- `/host/[quizId]` — quiz editor
- `/host/session/[sessionId]` — live host controls
- `/play/[joinCode]` — player join/play/rejoin
- `/projector/[joinCode]` — room display

### canonical states in scope

- lobby
- question open
- round results
- finished
- invalid join code / session not found
- validation
- reconnect / rejoin

## constraints

- Preserve the route/state inventory as the comparison baseline from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md`.
- Treat Lane 7 as a **future-direction lane** that intentionally changes some interaction/display assumptions from the currently shipped MVP.
- Keep the player answer flow faster and simpler than the current MVP by using large color-only tap targets on phone and iPad.
- Keep projector screens distance-readable, highly color-distinct, and clearly ordered.
- Ensure answer-device colors and order always match the projector.
- Use graphs and top-3 movement only where they support fast room comprehension.
- Low-fi should settle the system, not finalize visual styling.

## ordered steps

1. Reconfirm canonical surface coverage and explicitly note where Lane 7 intentionally changes display behavior from the shipped MVP.
2. Translate Lane 7 into a consistent low-fi component grammar led by Playful Signal color/font energy and Classroom Rally interaction structure.
3. Lock the projector as the primary place for question text and answer text.
4. Lock player devices to large colored tap targets only, in the same order/colors as the projector, for phone and iPad layouts.
5. Define the projector results pattern: per-option graph first, then visible top-3 movement.
6. Keep host surfaces supportive and operational without letting them overpower the player/projector experience.
7. Use calmer recovery/validation treatment where needed so the playful system still feels trustworthy.
8. Review cross-surface consistency and remove any decorative noise that slows room comprehension.
9. Lock the low-fi system and identify what must be fixed before high-fi work starts.

## what must be locked before high-fi

- Final low-fi layout structure for each canonical surface
- Shared hierarchy rules for projector-first question flow, player color pads, and host support states
- State treatment for lobby, question open, round results, finished, error, validation, and rejoin
- Host/editor support structure and operational hierarchy
- Player phone/iPad interaction pattern for join, answer, lock, and rejoin
- Projector reading order, answer-color system, graph treatment, and top-3 movement reveal
- Cross-surface consistency rules so the app feels like one family

## acceptance criteria

- All canonical routes are represented in low-fi keyframes.
- All required routes and state families are represented in low-fi keyframes, with any future-direction deviations stated explicitly.
- The base system reads as Playful Rally: Lane 5 look first, Lane 6 form factor second.
- The projector-led question model and color-pad player model are obvious in the low-fi set.
- Borrowed restraint/hierarchy traits are purposeful and limited, not decorative overload.
- Host, player, and projector surfaces feel coherent while still role-aware.
- Validation and recovery states are clear enough to hand off to high-fi with no ambiguity.
- The low-fi set establishes the final structural direction for the next design phase.

## verification

- Compare every low-fi frame against the canonical inventory and cross-frame matrix, noting any intentional future-direction changes.
- Check that each surface uses the same state vocabulary.
- Confirm projector layouts remain readable at distance.
- Confirm player screens stay simple on mobile and iPad.
- Confirm host/editor screens can support dense information without collapsing hierarchy.
- Confirm the projector-first answer model and color-pad answer-device model stay consistent across the full flow.

## follow-ups

- Convert approved low-fi frames into the high-fi design brief.
- Capture any component or layout dependencies discovered during low-fi.
- Resolve unanswered system rules before polish work begins.
- Update milestone/status docs if the design phase scope or sequence changes.
