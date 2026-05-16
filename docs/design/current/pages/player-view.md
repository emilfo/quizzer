# Player View

## Purpose

Document the intended current player-facing page and its room-play rules.

## Route

- Page: `/play/[joinCode]`
- Source: `app/play/[joinCode]/page.tsx`
- Main styling: `app/globals.css`

## Device and frame rules

- Optimize for mobile-first use.
- Treat the player page as a fullscreen surface.
- Do not rely on page scrolling.
- Keep the player focused on the single action for the current state.

## State flow

1. join
2. lobby
3. question
4. answer registered
5. result
6. finished

## State rules

### Join

- The join state is primarily about creating a nickname.
- The nickname field should be the clear center of attention.
- Secondary room information should stay minimal.

### Lobby

- Show only minimal waiting-state information.
- The core message is that the player is waiting for the quiz to start.

### Question

- Do not show the question text on the player page.
- Do not show the answer text on the player page.
- Do not show the answer buttons for the first 2 seconds.
- After that delay, show the answer buttons in a fixed 2-by-2 grid.
- The grid must match the projector layout.
- The button colors must match the projector answer colors.
- The player answers by pressing a button.

### Answer registered

- After answering, do not reveal whether the answer is correct.
- Show a small confirmation message: answer registered.
- Keep the follow-up state focused on waiting for the result.

### Result

- Show whether the answer was correct or incorrect.
- Show how many points the player got for the round.
- Show how many points the player is behind the person immediately ahead.

### Finished

- Show the player’s final personal outcome.
- Keep the finished state compact and mobile-friendly.

## Cross-surface rule

- The player answer layout must stay aligned with the projector answer layout in both position and color so players can answer by matching the projector grid.

## Scope boundary

This file documents the intended current player page behavior and rules for the shipped app flow, not a future proposal lane.
