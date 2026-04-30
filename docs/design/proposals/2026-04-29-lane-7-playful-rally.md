# Lane 7 Proposal — Playful Rally

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Playful Rally

## 2. one-sentence thesis

Quizzer should feel like Playful Signal first — friendly, colorful, and memorable — while using Classroom Rally’s projector-led, color-first gameplay structure underneath.

## 3. target mood words

Friendly, vivid, playful, energetic, classroom-ready, fast, rewarding, memorable.

## 4. primary audience emphasis

- **Players:** quick taps on large colored pads on phone or iPad.
- **Projector audience:** question, answer text, and color coding stay easy to read from across the room.
- **Hosts:** keep the room moving with clear control states and low-friction live handling.

## 5. design thesis

This lane merges Lane 5’s visual character — its warmth, friendliness, font feel, roundedness, and memorable tone — with Lane 6’s interaction and presentation model — projector-led questions, color-first answer pads, mobile quick-tap interaction, and visible results graphs.

The tone should stay much closer to Lane 5 than Lane 6: more inviting, more human, and a little more playful, while still being disciplined enough for a classroom room-display flow. The palette should be bright but less orange-heavy, leaning into mint, cyan, violet, pink, and soft lime accents.

The core rule: the experience should feel like a cheerful game show for the classroom, but the interaction model must stay quick, obvious, and color-led.

## 6. shared-state treatment

All surfaces should feel like one cheerful game system:

- **Waiting / lobby** feels welcoming and ready.
- **Question open** feels energetic and easy to act on.
- **Round results** feel encouraging and data-rich.
- **Finished** feels like a happy finish line.
- **Errors** feel helpful, brief, and non-punitive.
- **Reconnect / rejoin** should feel reassuring and invisible.

Realtime refresh and player restoration should feel like the app remembered the room on purpose.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — welcoming room invite, join code + QR hero
- **question open** — projector-led prompt and answer text, player color pads
- **round results** — per-option graph plus visible leaderboard shifts
- **finished** — final podium and celebratory closure
- **invalid join code / session not found** — friendly recovery and retry
- **validation** — compact local correction states
- **reconnect / rejoin** — safe continuity and restoration

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

This should feel warm and welcoming, like an easy entry into a game.

- Keep the player path the visual center of gravity.
- Make the host path clear and safe, but slightly quieter.
- Use friendly recovery copy for invalid codes.

**Frame intent:** lower friction and make joining feel inviting.

### `/auth/error` — sign-in recovery

This should be a small detour, not a wall.

- Keep the message short and helpful.
- Give one clear way back.

**Frame intent:** preserve momentum after a host sign-in failure.

### `/host` — dashboard

The dashboard should feel lively but organized.

- Cards should show readiness and live state with simple labels.
- The active session tile should feel like a launch point.

**Frame intent:** make hosting feel calm, fast, and approachable.

### `/host/[quizId]` — quiz editor

The editor should stay precise and approachable.

- Validation is visible but not harsh.
- Question blocks remain modular and easy to read.

**Frame intent:** support setup without making the host feel buried.

### `/host/session/[sessionId]` — live session controls

The host control room should support the projector-led flow rather than compete with it.

- State, timing, and control should stay obvious.
- Results should show graphing and top-3 movement cues.

**Frame intent:** keep the room moving while the projector does the visual storytelling.

### `/play/[joinCode]` — player join and gameplay

Player devices should show large colored tap targets only.

- Keep answer order and color order identical to the projector.
- Optimize for fast tapping on phone and iPad.
- Keep text minimal on-device so the color blocks do the work.

**Frame intent:** make the answer action fast, obvious, and fun.

### `/projector/[joinCode]` — projector and audience display

The projector is the primary display for questions and answers.

- Show question text and answer text with strong distinct colors.
- Keep the answer options readable from across the room.
- Results should include a per-option graph and top-3 movement.

**Frame intent:** make the room feel like it is playing a bright, friendly game.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same recoverable state families and safe rejoin behavior.
- Same one-active-session constraint.
- Same need for fast, understandable state changes.

## 9. what changes most visibly

- Player devices become color-pad answer boards.
- Projector becomes the main home for question + answer text.
- Results include answer distribution graphs.
- Finished state highlights the top 3 and their shifts.
- The palette stays playful and bright, but less orange-heavy than Lane 5.

## 10. key risks

- Could become too colorful if options and supporting UI compete.
- Could lose readability if projector colors are not separated clearly.
- Could feel too game-like for hosts if control states are underdesigned.

## 11. implementation difficulty

High. This lane intentionally merges tone and interaction assumptions, so it needs a careful low-fi pass before any final visual polish.

## 12. why this lane matters

This direction combines the most lovable visual character with the fastest classroom-friendly game model, making it a strong candidate when the product needs to feel fun, modern, and easy to enter.

## 13. proposal summary

Playful Rally should be evaluated as a merged lane: Lane 5’s friendliness, rounded look/feel, and playful visual voice fused with Lane 6’s projector-led, color-first gameplay presentation for a classroom-ready live quiz experience.

## 14. visual artifacts

- Keyframe folder: `docs/design/proposals/2026-04-29-lane-7-playful-rally/keyframes/`
- Main board: `docs/design/proposals/2026-04-29-lane-7-playful-rally/keyframes/index.html`
