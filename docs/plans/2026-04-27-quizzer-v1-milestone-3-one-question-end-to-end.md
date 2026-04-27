# Quizzer v1 — Milestone 3: One question end-to-end

## 1. objective

Deliver a complete single-round gameplay loop: host opens a question, participants answer once on phone, host closes the round, and results are shown.

## 2. scope

Includes these atomic deliverables:

- D13 — question presentation
- D14 — player answer submission
- D15 — manual round close
- D16 — scoring engine
- D17 — round results screen

Out of scope:

- full multi-question quiz progression
- reconnect recovery
- long-term hardening

## 3. constraints

- host advances manually
- answer options must keep stable colors across projector and phone
- one answer per participant per question
- scoring is correctness + speed bonus
- result screen must show top 3 leaderboard and movement

## 4. steps

1. Add `answers` schema with timestamps, correctness, and awarded score.
2. Render current question on projector and player screens.
3. Sync question state to all connected clients.
4. Build player answer actions and persistence.
5. Prevent duplicate submissions for the same participant/question.
6. Add host action to close a question manually.
7. Prevent submissions after the round is closed.
8. Implement scoring logic for correct answers and speed bonus.
9. Build round reveal state with correct answer display.
10. Build leaderboard view for top 3 and ranking changes.

## 5. acceptance criteria

- host can open a question and all clients receive it
- participants can submit exactly one answer
- closed questions reject new submissions
- scoring is computed consistently and stored
- projector shows correct answer plus top 3 results
- players can see that their answer was submitted

## 6. verification

- verify option color mapping matches across screens
- verify duplicate submissions are blocked at UI and data layer
- verify late answers after close are rejected
- verify speed bonus behaves consistently for same input data
- verify leaderboard movement compares against the previous state correctly

## 7. follow-ups

- decide whether the projector should show answer counts per option in v1
- decide whether players should see their exact score delta each round
