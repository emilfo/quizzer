# Lane 2 Proposal — Broadcast Night

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Broadcast Night

## 2. one-sentence thesis

Quizzer should feel like a live game show with stage energy, crisp control surfaces, and a projector-first sense of occasion.

## 3. target mood words

Theatrical, electric, polished, high-contrast, studio-lit, anticipatory, celebratory.

## 4. primary audience emphasis

- **Projector audience:** the hero surface; make the room feel like the event has started.
- **Players:** keep the energy exciting but never harder than tapping an answer on a phone.
- **Hosts:** make the control room feel authoritative, fast, and trustworthy.

## 5. design thesis

Broadcast Night treats Quizzer like a live production. The visual system should use dark stages, bright signal accents, and strong typographic hierarchy so every state feels like a cue in a show: lobby is pre-roll, question open is the live moment, results are the reveal, and finished is the closing card.

The lane should feel energetic across the app, but the energy must always support timing and clarity rather than compete with them.

## 6. shared-state treatment

Broadcast Night should keep the same route coverage and state vocabulary, but express those states as broadcast moments:

- **Waiting / lobby:** like pre-show standby, with clear “we are live soon” framing.
- **Open question:** like a spotlight on the current round; the active item should dominate the frame.
- **Round results:** like a reveal card or replay segment, with a strong hierarchy for answer correctness and leaderboard movement.
- **Finished:** like the final credits card, confident and complete, not muted.

Realtime refresh and player restoration must feel seamless and expected. If a player returns mid-session, the design should read as “the broadcast kept rolling” rather than “the app recovered.”

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — pre-show standby, room-building energy
- **question open** — spotlight moment, strongest live cue
- **round results** — reveal beat, scoreboard emphasis
- **finished** — closing slate, final payoff
- **invalid join code / session not found** — visible but controlled recovery
- **validation** — backstage prep corrections, never noisy
- **reconnect / rejoin** — mid-broadcast continuity, not technical recovery

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

This is the cold open.

- The split between host and player should feel like two on-ramps into the same live show.
- The join-code area should carry the strongest visual signal on the page so players know where to start immediately.
- Host auth should feel like backstage access: secure, deliberate, and clearly separate from the player path.
- Error feedback for invalid join codes should be visible fast and styled like a show cue gone wrong, not a scary alert.

**Frame intent:** establish “live event” energy within seconds and make the two entry paths unmistakable.

### `/auth/error` — sign-in recovery

This should feel like a production hiccup screen, not a dead end.

- Keep the layout compact and decisive.
- Use a controlled, alert-like treatment that acknowledges failure without turning the page into a technical explanation.
- The return-home action should be visually dominant and easy to trust.

**Frame intent:** recover cleanly and keep the host moving.

### `/host` — dashboard

The dashboard should feel like a backstage control board with a live-show edge.

- Quiz cards can resemble production tiles: clear title, publish state, and readiness at a glance.
- The active session card should feel like the currently airing segment, with stronger emphasis than inactive quizzes.
- Status pills and session badges should be unmistakable, like broadcast labels rather than generic admin tags.

**Frame intent:** let hosts understand what is ready, what is live, and what to launch next without scanning hard.

### `/host/[quizId]` — quiz editor

The editor should feel like assembling a show rundown.

- Question blocks should read as stacked cue cards with clear structure: prompt, choices, correct answer, and validation state.
- Publish readiness should be surfaced as a show-prep signal, not just a form error list.
- Reorder controls and destructive actions need to stay visible but not noisy; the lane should feel brisk, not cluttered.

**Frame intent:** support careful authoring while keeping the sense that this quiz is being prepared for a live broadcast.

### `/host/session/[sessionId]` — live session controls

This is the control room.

- The current question, roster, answer progress, and next-action control must be the dominant elements.
- The page should make state transitions feel like cues: start, close, continue, finished.
- Participant and answer information can feel denser than other surfaces, but it should still be organized like a live production board, not a spreadsheet.

**Frame intent:** give hosts a confident command surface that feels live, urgent, and easy to read under pressure.

### `/play/[joinCode]` — player join and gameplay

This should feel like the audience’s phone companion to the show.

- Joining should be immediate and exciting, with the join code and nickname input framed as a quick pass into the event.
- Answer choices should feel bold, tappable, and visually “on stage” when active.
- Selected, locked, and result states should have a clean reveal rhythm so the player always knows what happened.
- Restoration after refresh should feel like the app recognized the player mid-broadcast and reattached them cleanly.

**Frame intent:** keep the player confident, fast, and rewarded without making mobile interaction feel complex.

### `/projector/[joinCode]` — projector and audience display

This is the headline surface.

- Lobby should read like an opening title card with the join code and QR as the absolute focal points.
- Question state should go full hero-mode: oversized type, minimal chrome, and a composition that is readable from the back of the room.
- Results should feel like a reveal moment, with the leaderboard treated as a featured graphic rather than a table.
- Finished should land like a closing slate with a strong sense of payoff.

**Frame intent:** make the room feel like it is watching a show, not a dashboard.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same shipped flow: home → join/auth → dashboard/editor → lobby → question → results → finished.
- Same live-state boundaries and read-only projector behavior.
- Same validation and recovery states: invalid join code, session not found, join closed, publish validation, auth error, duplicate nickname, duplicate answer, and reconnect/rejoin.
- Same realtime refresh and player restoration behavior.

## 9. what changes most visibly

- Stronger dark-stage / bright-signal contrast.
- More explicit “live show” framing in copy, hierarchy, and labels.
- Larger hero treatment for projector moments and round transitions.
- More dramatic status contrast for waiting, live, reveal, and finished states.
- Tighter, broadcast-style control surfaces for host actions.

## 10. key risks

- Overdoing spectacle and making the app feel noisy or exhausting.
- Letting the projector design overpower readability at distance.
- Making host controls feel secondary to the visual theme.
- Turning errors into drama instead of clear recovery.

## 11. implementation difficulty

Moderate to high. The lane is conceptually straightforward, but it needs discipline to keep theatrical styling from obscuring state clarity on mobile and on the projector.

## 12. why this lane matters

Broadcast Night gives Quizzer the strongest sense of occasion. It is the most obvious choice if the product wants to feel like a live event first and a utility second, while still preserving the exact flow and state boundaries of the shipped MVP.

## 13. proposal summary

Broadcast Night should be evaluated as a high-energy, show-forward direction that makes the projector memorable, the host confident, and the player experience feel like part of a live broadcast—without changing any real product states or routes.

## Visual artifacts

- [Keyframes folder](./2026-04-29-lane-2-broadcast-night/keyframes/)
- [Keyframe index](./2026-04-29-lane-2-broadcast-night/keyframes/index.html)
