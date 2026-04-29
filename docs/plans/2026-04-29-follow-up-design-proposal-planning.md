# Follow-up Plan — Design Proposal Planning

## 1. objective

Create a clear, repeatable plan for auditing the shipped MVP, identifying all key user-facing frames, and drafting five distinct design proposals that stay consistent across host, player, and projector experiences.

## 2. scope

Includes these deliverables:

- a codebase-backed inventory of keyframes and shared UI states
- a per-frame intent and user-action map
- a proposal template for five distinct design directions
- a comparison rubric for selecting a direction to move into wireframes or high-fidelity UI

In scope keyframes:

- `app/page.tsx` — home, host auth, and player join entry
- `app/host/page.tsx` — host dashboard
- `app/host/[quizId]/page.tsx` — quiz editor
- `app/host/session/[sessionId]/page.tsx` — host live session controls
- `app/play/[joinCode]/page.tsx` — player join and gameplay
- `app/projector/[joinCode]/page.tsx` — projector and audience display
- `components/live-session-panel.tsx` — shared lobby and status patterns
- `components/live-session-refresh.tsx` — sync-driven live state updates

Out of scope:

- implementing the chosen visual direction
- shipping new UI components or layout refactors
- creating the five final design proposals themselves
- changing gameplay rules, data model, or live-session mechanics

## 3. constraints

- the plan must reflect the current shipped MVP and not invent unsupported product flows
- host, player, and projector views should feel recognizably related while respecting different attention needs
- design exploration should optimize for modern, lean UI with strong readability under live-use conditions
- projector views must prioritize glanceability and distance readability over density
- player views must prioritize low-friction joining and high-confidence answer submission on mobile
- host views must prioritize operational clarity, validation feedback, and control confidence
- proposal work should account for current product states such as lobby, in-progress round, round results, finished session, invalid join code, validation errors, and reconnect/rejoin paths
- concepts should be broad enough to compare, but concrete enough that another designer or agent can turn them into frames without guessing

## 4. steps

1. Confirm the current product surface from the codebase and list all user-facing frames, shared panels, and critical state variants.
2. For each keyframe, document:
   - route and source file
   - primary persona
   - frame intent
   - what the user must understand within a few seconds
   - primary and secondary actions
   - critical edge, error, and waiting states
3. Build a cross-frame matrix covering host, player, projector, and shared live-session states so every later proposal solves the full flow instead of isolated screens.
4. Define app-wide design principles that every proposal must satisfy, including clarity, speed of comprehension, consistency, hierarchy, responsiveness, and live-state feedback.
5. Define five intentionally different proposal lanes before any visual drafting begins. Each lane should differ in tone, typography, color behavior, spacing/density, shape language, and motion posture.
6. Create a standard proposal template so all five directions are drafted in the same format. Each template should require:
   - proposal name
   - design thesis
   - style keywords
   - visual system notes
   - interaction principles
   - treatment of every keyframe
   - strengths, risks, and implementation complexity
7. Define how each proposal must express consistency across the app, including shared navigation patterns, status language, CTA emphasis, panel styling, and live-state cues.
8. Define an evaluation rubric to compare the five proposals against product needs such as host control clarity, player conversion and confidence, projector readability, visual distinctiveness, and implementation fit.
9. Review the five drafted proposals against the rubric, shortlist the strongest direction, and note which traits from other proposals are worth merging.
10. Convert the selected direction into the next design phase plan: low-fidelity keyframes, component system rules, and high-fidelity execution order.

## 5. acceptance criteria

- every current keyframe and shared live-session surface is listed with its intent and major actions
- the plan explicitly covers host, player, projector, and shared state experiences
- the plan identifies important system states that must be designed, not only happy-path screens
- the plan defines how five different proposals will be created without pre-choosing a visual direction
- each proposal is required to cover all keyframes and remain consistent across the app
- the plan includes a repeatable format for proposal drafting and comparison
- another agent, designer, or developer can use the plan to produce the five proposals without needing additional product discovery

## 6. verification

- verify the listed keyframes map to real files in `app/` and `components/`
- verify the plan matches the shipped MVP behavior described in the current routes and shared live-session helpers
- verify proposal requirements cover the known session states: lobby, question open, round results, and finished
- verify the plan distinguishes persona needs across host, player, and projector surfaces
- verify the document stays planning-focused and does not drift into actual proposal drafting or implementation

## 7. follow-ups

- after approval, draft the keyframe matrix as a separate working artifact if comparison across states becomes too dense for this plan alone
- consider attaching lightweight wireframe checkpoints before high-fidelity design to reduce rework
- consider documenting a reusable design token strategy once a direction is selected
- if the chosen direction introduces structural UI changes, update `docs/architecture.md` and `docs/status.md` when implementation begins
