# Host Dashboard

## Purpose

Document the current host dashboard and its role in quiz setup and launch.

## Route

- Page: `/host`
- Source: `app/host/page.tsx`
- Main styling: `app/globals.css`

## Core role

- This is the host’s main operational page.
- It is where quizzes are created, reviewed, and launched.
- It should make the current live status easy to understand at a glance.

## Main sections

1. create quiz
2. active session summary
3. quiz library

## Content rules

### Create quiz

- Show a simple title field and create action.
- Keep quiz creation fast and low-friction.

### Active session summary

- If a live session exists, show the quiz title, join code, and session state.
- Show quick links to the projector and player join surfaces.
- The current route may still link to `/host/session/[sessionId]`, but that page is deprecated and should be removed from the product flow.

### Quiz library

- Show the host’s quizzes with clear status.
- Make it obvious which quiz can be edited.
- Make it obvious which published quiz can start a live session.

## Behavior rules

- The dashboard should feel calm and operational.
- It should prioritize clarity over visual complexity.
- It should help the host answer three questions quickly: what exists, what is ready, and what is live.

## Scope boundary

This file documents the current host dashboard, not a future proposal lane.
