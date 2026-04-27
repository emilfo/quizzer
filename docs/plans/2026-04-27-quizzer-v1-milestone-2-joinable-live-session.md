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
- participants do not need accounts
- participants join with nickname only
- quiz state starts in `lobby`
- projector screen must be public
- host control screen must stay private

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

- define whether a host may run multiple active sessions at once
- decide whether join codes expire after a session ends
