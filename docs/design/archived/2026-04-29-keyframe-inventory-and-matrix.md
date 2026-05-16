# Keyframe Inventory and Cross-Frame Matrix

## objective

Give the next designer a codebase-backed map of the shipped MVP so they can design from real frames, real states, and real constraints without extra discovery.

This document is the canonical route/state inventory for parallel lane drafting.

## app-wide state inventory

- **Entry/auth:** home routes to host auth or player join; local auth fallback exists for development.
- **Quiz authoring:** draft vs published quiz status, title editing, question CRUD, ordering, validation before publish, empty/error states.
- **Host live session:** lobby, question open, round results, finished; start/close/continue controls are state-gated.
- **Player join/play:** join code validation, session lookup failure, join-open vs join-closed, nickname validation, one-answer submission, rejoin/restoration, answer/result feedback.
- **Projector display:** join-code onboarding in lobby, distance-readable question and leaderboard states in play/results, finished summary.
- **Realtime sync:** host and public views refresh from live session updates; reconnect/rejoin should feel safe and recoverable.

## keyframes

### 1) `app/page.tsx`
- **Route/source:** `/` — `app/page.tsx`
- **Persona:** host, player
- **Intent:** first decision point: create/manage a quiz or join a session.
- **Must be understood quickly:** this is a split entry screen; host actions require auth, players need a 6-character join code.
- **Primary actions:** sign in/sign up; open host dashboard; enter join code and join session.
- **Secondary actions:** sign out; local dev auth path; keyboard-friendly text input.
- **Critical error / waiting / edge states:** invalid join code inline error; unauthenticated vs authenticated host state; local Supabase auth fallback.

### 2) `app/host/page.tsx`
- **Route/source:** `/host` — `app/host/page.tsx`
- **Persona:** host
- **Intent:** dashboard for quiz inventory and the one active live session.
- **Must be understood quickly:** which quiz is published, which session is live, and where to open editor / controls / projector / player join.
- **Primary actions:** create quiz; open editor; start live session; open host controls.
- **Secondary actions:** inspect status pills; jump to projector or player join views from the active session card.
- **Critical error / waiting / edge states:** no active session; unpublished quiz cannot start; active session state badge must stay trustworthy.

### 2.5) `app/auth/error/page.tsx`
- **Route/source:** `/auth/error` — `app/auth/error/page.tsx`
- **Persona:** host
- **Intent:** recover from a failed sign-in attempt.
- **Must be understood quickly:** auth failed, the likely recovery path is to check auth setup or credentials, and the next action is to return home.
- **Primary actions:** return home.
- **Secondary actions:** none.
- **Critical error / waiting / edge states:** auth misconfiguration or bad credentials; this is a dead-end recovery screen, not a branching flow.

### 3) `app/host/[quizId]/page.tsx`
- **Route/source:** `/host/[quizId]` — `app/host/[quizId]/page.tsx`
- **Persona:** host
- **Intent:** edit and validate a quiz before publishing.
- **Must be understood quickly:** publish readiness, question structure, and which fields block launch.
- **Primary actions:** update title; add question; edit prompt/options/correct answer; reorder questions; delete question; publish.
- **Secondary actions:** scan validation summary; use up/down controls.
- **Critical error / waiting / edge states:** `notFound()` for missing quiz; publish validation errors; disabled move controls at list boundaries; save states implied by form submission.

### 4) `app/host/session/[sessionId]/page.tsx`
- **Route/source:** `/host/session/[sessionId]` — `app/host/session/[sessionId]/page.tsx`
- **Persona:** host
- **Intent:** live operation console for the running quiz.
- **Must be understood quickly:** current session state, current question, answer progress, and what action is available now.
- **Primary actions:** start quiz; close round; continue; open projector; open player join.
- **Secondary actions:** read participant list, answer counts, status rows, leaderboard movement.
- **Critical error / waiting / edge states:** lobby waiting room; question open vs round results button gating; finished lock state; participant sync drift; empty lobby; partial leaderboard while results are live.

### 5) `app/play/[joinCode]/page.tsx`
- **Route/source:** `/play/[joinCode]` — `app/play/[joinCode]/page.tsx`
- **Persona:** player
- **Intent:** join, answer, and review personal outcomes on a phone.
- **Must be understood quickly:** whether the session exists, whether joining is still open, and whether the player is already attached to this session.
- **Primary actions:** join with nickname; submit one answer; read round result; review final result.
- **Secondary actions:** rejoin via cookie restoration; inspect selected answer; use query-string success/error feedback.
- **Critical error / waiting / edge states:** invalid join code; session not found; join closed; missing/duplicate nickname; join failed; answer failed; duplicate answer; round closed; rejoin required; in-progress session after lobby close; finished session without a restored participant.

### 6) `app/projector/[joinCode]/page.tsx`
- **Route/source:** `/projector/[joinCode]` — `app/projector/[joinCode]/page.tsx`
- **Persona:** audience / room display
- **Intent:** a glanceable public screen that explains how to join and tracks live game progress.
- **Must be understood quickly:** join code / QR in lobby, live question during play, leaderboard during results, final standings at finish.
- **Primary actions:** none in-game; open join link in lobby.
- **Secondary actions:** scan QR; read top-3 leaderboard.
- **Critical error / waiting / edge states:** invalid join code; session not found; empty/closed lobby; question open vs round results; finished state.

## shared behavior constraints

- **Realtime refresh:** `components/live-session-refresh.tsx` keeps live host/player/projector pages current via `router.refresh()` when session, participant, answer, or public lobby rows change.
- **Player restoration:** cookie/session-token restoration can move a player directly into joined, answered, results, or finished states without re-entering a nickname.
- **Legacy note:** `components/live-session-panel.tsx` exists in the repo but is not part of the current shipped MVP route flow and should not be treated as a required design surface for this planning pass.

## cross-frame matrix

| Surface | Lobby | Question open | Round results | Finished | Invalid join code / session not found | Validation | Reconnect / rejoin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Host** | `/host/session/[sessionId]` shows lobby roster and start button | current question, answer count, close-round button | leaderboard, continue button | final leaderboard, locked gameplay copy | n/a in host flow; missing session should fail clearly | quiz editor validation before publish | live refresh should keep roster/state current |
| **Player** | `/play/[joinCode]` join form, nickname entry, join-open messaging | answer grid or locked answer state | result feedback, correct/incorrect, selected answer highlighted | personal final rank/score | invalid code / session not found / join-closed errors | nickname length and required field | cookie-based restoration, rejoin-required fallback |
| **Projector** | `/projector/[joinCode]` QR + join code + participant count | full-screen question prompt and answers | visible correct answer and leaderboard | final results / top 3 | invalid code / session not found | none visible; simplicity over form validation | automatic refresh, no manual recovery UI |
| **Shared behavior** | realtime refresh keeps lobby counts and state current | same sync layer powers all live states | same sync layer powers all live states | same sync layer powers all live states | shared failure messaging should be simple and recoverable | publish validation, nickname validation, route validation, auth failure recovery | realtime refresh, cookie/session restoration, safe reload behavior |

## notes

- This inventory intentionally stops at the shipped MVP surfaces.
- Any later visual proposal should preserve the state boundaries above before introducing new styling systems.
