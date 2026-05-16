# Projector View

## Purpose

Document the current shipped projector-facing page and the layout rules it should follow.

This is the only live room page in the current design model.

## Route

- Page: `/projector/[joinCode]`
- Source: `app/projector/[joinCode]/page.tsx`
- Main stage component: `components/live-session-stage.tsx`
- Main styling: `app/globals.css`

## Current states

The current projector view has six public states:

1. invalid join code
2. session not found
3. lobby
4. question open
5. round results
6. finished

## Current behavior

When the signed-in host is using the projector route, the projector view is also the live control surface.

### Invalid join code

- Shows a projector-specific error card.
- Tells the room to use the 6-character join code shown by the host.

### Session not found

- Shows a session-not-found error card.
- Tells the room to check the join code and try again.

### Lobby

- Shows quiz title, join code, join QR, and join link.
- Shows participant count in a secondary panel.
- Communicates that the lobby is open and ready.
- For the signed-in host, shows a start control in the bottom-right corner.
- For the signed-in host, shows an end-quiz control in the bottom-left corner.

### Question open

- Shows the active question prompt.
- Shows all four answer options in the projector answer grid.
- Uses the same option/color order the player answer surface is expected to follow.
- For the signed-in host, shows a reveal/close-round control in the bottom-right corner.
- For the signed-in host, keeps the end-quiz control visible in the bottom-left corner.

### Round results

- Keeps the question prompt visible.
- Shows per-option counts and percentages.
- Highlights the correct option.
- Shows the live top-3 leaderboard after the room-response reveal.
- For the signed-in host, shows the next/continue control in the bottom-right corner.
- For the signed-in host, keeps the end-quiz control visible in the bottom-left corner.

### Finished

- Shows final-results framing.
- Shows the final top-3 leaderboard.
- No further advance control is needed after the quiz is finished.

## Projector rules

- Optimize for a 16:9 presentation surface.
- Always fill the available frame.
- Do not rely on page scrolling.
- Do not show header chrome or app-shell navigation.
- Keep question and answer content as the visual priority.
- Preserve fast room readability over secondary detail.
- Host controls should overlay the projector frame rather than moving the main content.
- The primary forward action belongs in the bottom-right corner.
- The explicit end-quiz action belongs in the bottom-left corner and stays available until the session is finished.

## Layout notes for implementation

- The current projector question and reveal states use `.projector-stage`.
- Answer options render in `.projector-answer-grid` as a two-column grid.
- Answer tiles render through `.projector-answer-tile` and `.projector-answer-text`.
- Lobby currently uses `.page-grid--projector` with a primary hero card plus a secondary participant-count panel.
- Live projector updates are driven by `LiveSessionRefresh` in public mode.
- Host overlay controls currently use `.host-control-strip`, with a left-anchored variant for the end-quiz action.

## Scope boundary

This file documents the current shipped projector page, not a future proposal lane.

`/host/session/[sessionId]` may still exist in implementation, but the intended product flow is for the signed-in host to control the room directly from the projector page.
