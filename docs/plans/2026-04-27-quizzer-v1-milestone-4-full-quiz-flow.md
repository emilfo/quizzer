# Quizzer v1 — Milestone 4: Full quiz flow

## 1. objective

Extend the single-round loop into a complete multi-question quiz with a clean ending and final leaderboard.

## 2. scope

Includes these atomic deliverables:

- D18 — multi-question progression
- D19 — final leaderboard

Out of scope:

- reconnect handling
- operational hardening
- broader analytics/admin features

## 3. constraints

- questions must run in saved quiz order
- host remains in manual control of progression
- final leaderboard must use accumulated session score
- session must transition to a stable `finished` state
- the host advances from the last round reveal into final results with an explicit action
- projector final results show top 3 standings
- player finished view shows personal final placement and total score only

## 4. steps

1. Track current question index in session state.
2. Add host action to advance from round results to next question.
3. Detect when the final question has completed.
4. Transition the session into final results.
5. Render final leaderboard on projector and player devices.
6. Prevent further gameplay mutations after session finish.

## 5. acceptance criteria

- host can run all questions in order
- each round transitions cleanly into the next
- final question transitions to final results automatically or by host action as designed
- final rankings match accumulated scores
- finished sessions no longer accept answers

## 6. verification

- verify progression works from first question through final results
- verify end-of-quiz edge case when quiz has only one question
- verify no further round actions are accepted after finish
- verify final leaderboard matches stored answer scores

## 8. implementation checklist

- [x] add host action to advance from round reveal to the next question
- [x] finish the session when the host advances past the last saved question
- [x] render final leaderboard state on the projector
- [x] render personal final result on player devices while blocking new finished-session joins
- [x] keep finished sessions readable but non-mutable
- [x] upgrade `scripts/check-m4` to run the local quality loop

## 7. follow-ups

- decide whether hosts can restart a finished session
- decide whether session history needs export/download in a later version
