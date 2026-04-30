# Lane 6 Proposal — Classroom Rally

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Classroom Rally

## 2. one-sentence thesis

Quizzer should feel like a high-energy classroom game: playful, colorful, fast to answer, and built to keep kids and youth players moving with confidence.

## 3. target mood words

Bright, inviting, energetic, playful, classroom-friendly, fast, clear, rewarding.

## 4. primary audience emphasis

- **Players:** answer fast on phone or iPad using big colored tap targets.
- **Projector audience:** make the question, answers, and result graph instantly readable in the room.
- **Hosts:** keep the room moving with clear control states and low-friction transitions.

## 5. design thesis

This lane takes the friendly energy of Playful Signal and pushes it toward a classroom rally format: more color, more momentum, and more visual payoff for players. Questions and answer options should appear on the projector only, while player devices use large colored buttons in the same color/order logic for quick tapping.

This is a feedback-driven future-direction lane. It intentionally changes some interaction and display assumptions from the current shipped MVP so the experience can feel more game-like, more youth-friendly, and more optimized for fast classroom play.

The core rule: fun is the first read, clarity is the guardrail, and speed is the interaction model.

## 6. shared-state treatment

Shared states should feel like a game round that keeps moving:

- **Waiting / lobby** feels like a lively launch pad, not a dead hold.
- **Question open** feels like a race to tap.
- **Round results** feel like a celebratory reveal with real data.
- **Finished** feels like a clean finish line with a strong payoff.
- **Errors** stay readable, friendly, and brief.
- **Reconnect / rejoin** should feel like the game remembered the player.

Realtime refresh and restoration should be invisible when they work. Returning users should land back into the same round state without explanation unless something genuinely failed.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — lively waiting room, join code + QR, ready-to-start energy
- **question open** — projector-led prompt, players see color targets only
- **round results** — per-option graph plus answer summary
- **finished** — top-3 reveal and final ranking closure
- **invalid join code / session not found** — friendly recovery, one clear next step
- **validation** — local, constructive correction states
- **reconnect / rejoin** — safe continuity, no technical drama

## 6.6 required low-fi frames

- `/` — unauthenticated host entry, authenticated host entry, invalid join code
- `/auth/error` — sign-in failure recovery
- `/host` — no active session, active session present
- `/host/[quizId]` — publishable, blocked by validation
- `/host/session/[sessionId]` — lobby, question open, round results, finished
- `/play/[joinCode]` — invalid/not-found, join-open, join-closed, question-open unanswered, question-open answered, round-results, finished-restored-player, rejoin-required
- `/projector/[joinCode]` — invalid/not-found, lobby, question-open, round-results, finished

## 7. route-by-route treatment

### `/` — home / host auth / player join

This should feel like the front door to a game, not a software login.

- Make the player join path the most obvious object on the page.
- Keep the host path calm and trustworthy, but less dominant than the player path.
- Show invalid code recovery as a small, friendly correction.

**Frame intent:** get players into the game fast and make the host path feel safe.

### `/auth/error` — sign-in recovery

This should feel like a brief snag, not a stop sign.

- Keep the copy short and friendly.
- Give one clear way back.
- Avoid technical language unless absolutely necessary.

**Frame intent:** preserve momentum after a failed host sign-in.

### `/host` — dashboard

The dashboard should be a simple launch board for live play.

- Cards should show what is ready, what is live, and what is blocked.
- Session state should be visible at a glance.
- Actions should feel obvious and low-friction.

**Frame intent:** make the host confident enough to launch a classroom round quickly.

### `/host/[quizId]` — quiz editor

This surface should feel like setup for a game session.

- Validation should be short, visible, and practical.
- Question structure should stay easy to scan.
- Editing should support quick prep, not long-form authoring drama.

**Frame intent:** keep prep clear so the host can get back to the room.

### `/host/session/[sessionId]` — live session controls

This is the control center, but it should stay secondary to the projector-led game experience.

- The host should see state, controls, and progress clearly.
- Questions and answers are not the main visual story here; they belong on the projector.
- Results should show answer distribution and top-3 movement.

**Frame intent:** keep the room moving with calm, legible control states.

### `/play/[joinCode]` — player join and gameplay

On player devices, the answer UI should be reduced to quick-tap color blocks.

- Show large colored choices in the same order/colors as the projector.
- Keep text minimal; speed matters more than explanation.
- Make tablets and phones equally easy to use.
- After answer submission, keep the state obvious and reassuring.

**Frame intent:** make tapping fast enough for a classroom rush.

### `/projector/[joinCode]` — projector and audience display

This is the hero surface.

- Questions and answer options should live here.
- Each option should have a distinct strong color.
- Results should include a graph showing how many chose each option.
- Finished should reveal the top 3 and show shifts in the top 3.

**Frame intent:** make the room visually exciting while preserving instant readability.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same live-session state boundaries and recoverable errors.
- Same one-session-at-a-time host constraint.
- Same safe refresh/rejoin behavior.
- Same accessibility goal: the current state should be understandable within seconds.

## 9. what changes most visibly

- Projector becomes the main location for question text and answer options.
- Player views become quick-tap colored choice boards.
- Results include a visible option graph before ranking closure.
- Top-3 reveal includes rank shifts.
- Color becomes a primary gameplay signal, with less orange and more mint, cyan, violet, lime, and warm pink energy.

## 10. key risks

- Could become too loud if color is not disciplined.
- Could hurt accessibility if option colors and labels are not handled carefully.
- Could over-prioritize fun over clarity for hosts.
- Could feel too game-like if results and finish states are not grounded.

## 11. implementation difficulty

High. The lane intentionally rebalances the current MVP interaction model, so it needs careful low-fi validation before any visual polish or component work.

## 12. why this lane matters

This direction is the strongest fit if the product should feel like a classroom rally: fast, inviting, and memorable for players, with a projector-led game flow that makes the room feel alive.

## 13. proposal summary

Classroom Rally should be evaluated as a future-direction lane for youth-heavy, room-based play: colorful, playful, and speed-first for players, with projector-led questions and results that make the game feel bigger than the device.

## 14. visual artifacts

- Keyframe folder: `docs/design/proposals/2026-04-29-lane-6-classroom-rally/keyframes/`
- Main board: `docs/design/proposals/2026-04-29-lane-6-classroom-rally/keyframes/index.html`
