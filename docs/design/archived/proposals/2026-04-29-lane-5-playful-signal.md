# Lane 5 Proposal — Playful Signal

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Playful Signal

## 2. one-sentence thesis

Quizzer should feel welcoming, lively, and memorable without losing the confidence required for live play.

## 3. target mood words

Friendly, bright, nimble, a little cheeky, optimistic, game-like, crisp.

## 4. primary audience emphasis

- **Players:** make joining and answering feel low-pressure and rewarding.
- **Hosts:** keep control states calm and trustworthy, with delight as a secondary layer.
- **Projector audience:** add character, but never at the cost of legibility from across the room.

## 5. design thesis

This lane uses warmth and personality to reduce intimidation at the moment users enter the experience. The system should feel like it is cheering people on: the entry screen is inviting, the host dashboard is approachable, the editor feels less sterile, and live play gets small bursts of energy at state changes.

The core rule: the product stays serious about correctness, but the surface treatment stays human and upbeat.

## 6. shared-state treatment

Playful Signal should keep the same content hierarchy and state language across all surfaces, but frame those states with lighter, friendlier cues:

- **Waiting** feels like a gentle pause, not an idle void.
- **Success** feels celebratory and encouraging.
- **Errors** feel corrective but not punishing.
- **Finished** feels like a clean finish line, not a dead end.

Realtime refresh and player restoration must feel invisible and reassuring. If a player returns after refresh, the experience should feel like the app remembered them on purpose rather than recovered from a failure.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — welcoming energy, low-pressure invitation
- **question open** — bold action confidence, fast answer clarity
- **round results** — encouraging reveal, clear correctness feedback
- **finished** — friendly finish-line summary, stable result readback
- **invalid join code / session not found** — helpful correction, not scolding
- **validation** — constructive fix-it guidance with strong clarity
- **reconnect / rejoin** — remembered progress, reassuring continuity

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

This is the most expressive entry point in the lane.

- The split between host and player should be obvious at a glance, but softened by friendly language and rounded framing.
- Host auth should feel encouraging, not enterprise-like.
- The join-code field should be the visual center of gravity for players.
- Error feedback for invalid join codes should be direct, but phrased like a helpful nudge.

**Frame intent:** give new visitors confidence that joining is easy and that the host path is safe to enter.

### `/auth/error` — sign-in recovery

This should read as a graceful detour, not a broken page.

- Use a calm, lightly apologetic tone.
- Keep the layout minimal so the recovery action is the obvious next step.
- Avoid turning the screen into a failure state parade; it should feel like a quick reset.

**Frame intent:** acknowledge auth failure without making the host feel stuck.

### `/host` — dashboard

The dashboard should feel lively and organized, with a slightly more playful surface than a classic admin console.

- Quiz cards can feel like approachable “projects” rather than records.
- Published and active states should be instantly legible.
- The active session card should feel like a live status tile with a bit more personality than the rest of the dashboard.

**Frame intent:** make quiz management feel less like maintenance and more like getting a game ready to run.

### `/host/[quizId]` — quiz editor

The editor should still be precise, but with enough personality to make editing feel less dry.

- Use upbeat status framing around publish readiness.
- Question blocks should feel modular and inviting, not like a dense form.
- Validation errors should be clear and constructive, with a tone that helps the host fix the quiz quickly.

**Frame intent:** support careful editing while keeping the experience lightweight and approachable.

### `/host/session/[sessionId]` — live session controls

This surface needs the most discipline in the lane: it is playful in style, not in behavior.

- The current question, answer count, and control buttons must remain the visual anchors.
- Status rows and participant chips can carry subtle charm, but the host should always understand what to do next.
- Result states should celebrate progress without overpowering the control surface.

**Frame intent:** keep the live control room energetic enough to feel human, but never unclear.

### `/play/[joinCode]` — player join and gameplay

This is the emotional center of the lane.

- Joining should feel welcoming and safe, with a strong sense that the player is stepping into a game, not a form.
- Answer buttons/cards should be bold, touch-friendly, and slightly playful in their motion or emphasis.
- Locked-answer and round-results states should feel rewarding, with gentle celebratory feedback when correct.
- Restoration after refresh should feel seamless; the page should behave like it remembers the player’s progress.

**Frame intent:** make the player feel confident enough to act quickly without second-guessing.

### `/projector/[joinCode]` — projector and audience display

The projector should carry the lane’s personality in a restrained way.

- Lobby onboarding can be more welcoming than the other lanes, but the join code and QR remain the heroes.
- Question and results screens should feel energized and game-like, yet remain simple to scan from a distance.
- Leaderboard moments can feel celebratory, but the rank and score hierarchy must stay unambiguous.

**Frame intent:** make the room feel alive while preserving instant readability.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same flow: home → join/auth → dashboard/editor → lobby → question → results → finished.
- Same live-session state boundaries.
- Same read-only projector behavior.
- Same join-code validation, publish validation, and recovery states.
- Same restoration behavior for returning players.

## 9. what changes most visibly

- Friendlier language and more optimistic microcopy.
- Rounder, more buoyant framing for cards, pills, and status elements.
- Slightly more expressive color accents and success states.
- More energetic treatment of transitions between lobby, question, and results.
- More personality in empty/waiting states so they feel intentional.

## 10. key risks

- Becoming childish or distracting in places where clarity matters.
- Overusing delight so that host controls feel less authoritative.
- Making projector screens too decorative to read quickly.
- Letting playful tone soften error messages too much.

## 11. implementation difficulty

Moderate. The lane is visually approachable, but it needs strong restraint at live-session and projector moments so personality never competes with comprehension.

## 12. why this lane matters

This direction lowers the perceived friction of Quizzer. It is the most likely lane to make first-time players feel comfortable fast, while giving the product a memorable, human tone that can carry across host, player, and room-facing surfaces.

## 13. proposal summary

Playful Signal should be evaluated as a friendly, high-confidence game layer: expressive enough to feel distinct, disciplined enough to support live quiz flow, and consistent enough that the same state still reads clearly in every surface.

## Visual artifacts

- Keyframes folder: [`keyframes/`](./2026-04-29-lane-5-playful-signal/keyframes/)
- Entry point: [`index.html`](./2026-04-29-lane-5-playful-signal/keyframes/index.html)
