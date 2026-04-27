# Quizzer v1 — Milestone 2: Joinable live session

## 1. objective

Enable a quiz master to start a live session from a published quiz and allow participants to join from their phones via QR code or join code.

## 2. scope

Includes these atomic deliverables:

- D8 — start live session
- D9 — projector screen
- D10 — player join flow
- D11 — realtime lobby sync
- D12 — host control screen

Out of scope:

- answering questions
- scoring
- round results
- final leaderboard

## 3. constraints

- only published quizzes can be hosted
- one active session per host in v1
- participants do not need accounts
- participants join with nickname only
- nickname uniqueness is case-sensitive exact match per session
- quiz state starts in `lobby`
- joining is allowed only while the session is in `lobby`
- projector screen must be public
- host control screen must stay private
- starting a second session while one is active must be blocked and should link the host back to the active session
- ended session join codes expire immediately
- lobby host controls are view-only in v1

## 4. steps

1. Create `quiz_sessions` and `participants` schema and policies.
2. Implement session creation from a published quiz.
3. Generate unique join codes.
4. Build a public projector route for lobby state.
5. Render join code, QR code, and participant count on the projector screen.
6. Build player join flow for nickname entry and session join.
7. Enforce nickname uniqueness per session.
8. Add realtime subscription for lobby/session changes.
9. Build the host control screen with participant list and session actions.
10. Add host action to start the quiz.

## 5. acceptance criteria

- host can start a session from a published quiz
- session gets a unique join code
- projector shows QR code and live participant count
- participant can join without authentication
- duplicate nicknames are rejected per session
- host sees participants appear live in the control screen

## 6. verification

- verify sessions cannot be created from draft quizzes
- verify projector route exposes only safe public session data
- verify join by QR code and manual join code both work
- verify realtime lobby updates across host, projector, and player views
- verify unauthenticated users cannot access host controls

## 7. follow-ups

- decide whether projector should show participant nicknames in addition to participant count
- decide whether hosts need lobby moderation controls after v1

## 8. implementation checklist

### D8 — start live session

- [x] add `quiz_sessions` table and `session_state` enum
- [x] snapshot `quiz_title` onto each session for safe public reads
- [x] enforce one active (`lobby` or `in_progress`) session per host
- [x] generate unique uppercase join codes
- [x] allow session creation only from published quizzes owned by the signed-in host
- [x] block second-session creation and redirect the host to the active session

### D9 — projector screen

- [x] add a public projector route keyed by join code
- [x] render quiz title, join code, join URL, QR code, and participant count
- [x] show lobby-only waiting state and a started-state placeholder for M3 handoff
- [x] expose only safe public session data on the projector path

### D10 — player join flow

- [x] add home-page join-code entry that redirects to the player join route
- [x] add player route keyed by join code
- [x] allow nickname-only joins while the session is in `lobby`
- [x] reject duplicate nicknames using case-sensitive exact matching
- [x] persist the joined participant identity locally for later milestones
- [x] reject joins after the host starts the quiz

### D11 — realtime lobby sync

- [x] subscribe host, projector, and player views to session-state changes
- [x] subscribe lobby views to participant joins in realtime
- [x] keep participant count live on projector and player views
- [x] keep host participant list live without manual refresh

### D12 — host control screen

- [x] add private host session-control route
- [x] show active session metadata, participant count, and participant list
- [x] link to the public projector route and player join route
- [x] add host action to start the quiz and close lobby joins
- [x] show a clear M3 handoff state after the quiz starts

### Verification and repo updates

- [x] add or update DB types for new M2 tables, enums, and RPCs
- [x] add unit tests for M2 helper logic
- [x] upgrade `scripts/check-m2` from placeholder to real checks
- [x] update `docs/status.md` after verification completes
