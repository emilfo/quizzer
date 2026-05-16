# Auth Error

## Purpose

Document the current auth-error page and its recovery role.

## Route

- Page: `/auth/error`
- Source: `app/auth/error/page.tsx`

## Core role

- This page is a small recovery detour.
- It exists only to explain that sign-in failed.
- It should give the user one clear next step.

## Content rules

- Keep the message short.
- State that login failed.
- Point the user to check auth settings or credentials.
- Provide a single return-home action.
- Avoid extra navigation, branching, or dense troubleshooting detail.

## Behavior rules

- The page should feel temporary, not like a destination.
- Recovery should be obvious immediately.
- The only important action is returning home and trying again.

## Scope boundary

This file documents the current auth-error page, not a future proposal lane.
