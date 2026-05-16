# Quiz Editor

## Purpose

Document the current quiz-editor page and its editing/publish rules.

## Route

- Page: `/host/[quizId]`
- Source: `app/host/[quizId]/page.tsx`
- Main styling: `app/globals.css`

## Core role

- This page is for building and validating a quiz before it goes live.
- It should help the host edit quickly and publish only when the quiz is valid.

## Main sections

1. quiz title and publish controls
2. publish validation summary
3. modular question list

## Content rules

### Title and publish controls

- Show the quiz title clearly.
- Show the current quiz status.
- Keep save-title and publish actions obvious.

### Validation summary

- Show whether the quiz is ready to publish.
- If not ready, show clear publish-blocking errors.
- Validation should explain what to fix without extra interpretation.

### Question list

- Questions should stay modular and easy to scan.
- Each question should support prompt editing, option editing, correct-answer selection, saving, deleting, and reordering.
- Reordering controls should remain simple and local to each question.

## Behavior rules

- The page should support fast editing between rounds of preparation.
- Validation should be direct and actionable.
- Publishing should depend on passing the question and answer constraints.

## Scope boundary

This file documents the current quiz-editor page, not a future proposal lane.
