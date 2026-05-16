# Lane 1 Proposal — Quiet Control Room

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Quiet Control Room

## 2. one-sentence thesis

Quizzer should feel calm, precise, and trustworthy, like a refined operations surface where every state is legible and nothing shouts.

## 3. target mood words

Quiet, disciplined, composed, high-trust, spacious, restrained, exact.

## 4. primary audience emphasis

- **Hosts:** make control, validation, and live-session status feel obvious and dependable.
- **Players:** remove friction and visual noise so joining and answering feel simple on mobile.
- **Projector audience:** keep public screens sparse, large, and instantly readable from a distance.

## 5. design thesis

This lane treats Quizzer like an operations room that happens to run a game. The visual system should reduce cognitive load through strong hierarchy, controlled contrast, and ample breathing room. Calm surfaces, precise labels, and subtle state changes should make the app feel safe to use under pressure.

The core rule: clarity is the aesthetic. Every surface should feel intentional, quiet, and slightly institutional without becoming cold or sterile.

Quiet Control Room should differentiate itself from the other restrained lanes by pushing hardest on operational trust, minimal signal, and action-first calm rather than editorial composition or visible modular structure.

## 6. shared-state treatment

All surfaces should share the same state language, but the framing must stay subdued and consistent:

- **Waiting** feels prepared, not empty.
- **Live** feels active, not frenetic.
- **Locked** feels authoritative, not punitive.
- **Error** feels direct and recoverable, not alarming.
- **Finished** feels conclusive and tidy, not celebratory by default.

Realtime refresh and player restoration should be invisible when they work. If the user returns after a reload or reconnect, the interface should simply resume at the correct state with no obvious disruption. The design should make recovery feel like continuity, not repair.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — calm readiness, roster visibility, clear start/join posture
- **question open** — strongest action focus, minimal distraction
- **round results** — authoritative reveal, rank and correctness clarity
- **finished** — tidy finality, stable standings
- **invalid join code / session not found** — factual recovery copy, one clear next move
- **validation** — local, direct, low-noise correction states
- **reconnect / rejoin** — seamless continuity, never a dramatic interruption

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

This should read as a disciplined fork in the road.

- The host path and player path should be visually distinct but equally calm.
- The join-code field should be the most prominent object on the page for players.
- Host sign-in should feel secure and low-noise, with the auth path visually quieter than the join path.
- Any inline join-code error should sit close to the field and use direct, minimal copy.

**Frame intent:** give first-time visitors immediate confidence that the app is simple to enter and serious about correctness.

### `/auth/error` — sign-in recovery

This should feel like a controlled interruption, not a failure page.

- Keep the layout sparse and centered so the recovery action is unmistakable.
- The tone should be factual and calm, with no decorative treatment competing for attention.
- Return-home should be the only obvious action.

**Frame intent:** acknowledge auth failure cleanly, then move the host back to a safe starting point.

### `/host` — dashboard

The dashboard should feel like an orderly inventory board.

- Quiz cards should be structured and quiet, with status pills doing more work than decoration.
- Published, draft, and active states should be easy to scan without color overload.
- The active session card should sit apart from the quiz list, reading like the live center of gravity.

**Frame intent:** let the host instantly answer three questions: what exists, what is ready, and what is live.

### `/host/[quizId]` — quiz editor

This is the most information-dense surface, so it should be the most disciplined.

- Question blocks should feel like clean panels with strong spacing and consistent alignment.
- Validation should be explicit and local to the field or question block it affects.
- Reordering controls should feel structural rather than playful.
- Publish readiness should be framed as a status summary, not a big celebratory moment.

**Frame intent:** support careful editing without making the host feel trapped inside a form maze.

### `/host/session/[sessionId]` — live session controls

This surface should feel like the control center of the lane.

- The current question and action area should dominate the composition.
- Roster, answer counts, and status rows should sit in quieter support zones.
- Lobby, question-open, results, and finished states must be visually distinct through hierarchy, not ornament.
- Controls should always feel gated by state, with no ambiguity about what is available now.

**Frame intent:** create a room where the host can act confidently at a glance, even under time pressure.

### `/play/[joinCode]` — player join and gameplay

This should be minimal, mobile-first, and emotionally neutral in the best way.

- The nickname/join area should feel compact and obvious.
- Answer choices should be large enough to tap without hesitation, but visually quiet.
- Joined, answered, and results states should differ clearly without becoming loud.
- Restoration should feel seamless; if the player returns, the screen should continue from the last known state without requiring explanation.

**Frame intent:** remove visual friction so the player can focus on the quiz, not the interface.

### `/projector/[joinCode]` — projector and audience display

This is the most austere surface in the lane.

- Lobby should center on join code, QR, and room readiness with very little else competing.
- Question screens should use oversized type and an uncluttered answer layout.
- Results should prioritize rank, score movement, and the current winner with immediate scanability.
- Finished state should feel like a clean final board, not a dashboard.

**Frame intent:** make the room display read fast from across the room while preserving the same state sequence as the rest of the app.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same flow: home → join/auth → dashboard/editor → lobby → question → results → finished.
- Same live-state boundaries and read-only projector behavior.
- Same join validation, publish validation, and recovery states.
- Same player restoration and rejoin behavior.
- Same realtime refresh expectations across host, player, and projector surfaces.

## 9. what changes most visibly

- More negative space and less decorative noise.
- Stronger typographic hierarchy and quieter status treatment.
- More restrained color use, with emphasis on functional contrast.
- Less motion overall; when motion exists, it should be subtle and state-led.
- More separation between core action zones and supporting information.

## 10. key risks

- Becoming too severe or clinical.
- Under-signaling important state changes on mobile.
- Making the projector feel too sparse at the cost of energy.
- Allowing quiet styling to reduce the urgency of errors or locked states.

## 11. implementation difficulty

Moderate. The lane is conceptually simple, but it requires excellent hierarchy and restraint so the UI stays calm without becoming dull or ambiguous.

## 12. why this lane matters

This direction gives Quizzer the strongest sense of operational trust. It is the best fit if the team wants the app to feel dependable, composed, and easy to use under live conditions, while still supporting the full range of host, player, and projector states.

## 13. proposal summary

Quiet Control Room should be evaluated as the most disciplined lane: calm in tone, rigorous in hierarchy, and designed to make every live state feel legible without visual noise.

## Visual artifacts

- [Keyframes folder](./2026-04-29-lane-1-quiet-control-room/keyframes/)
- [Entry index](./2026-04-29-lane-1-quiet-control-room/keyframes/index.html)
