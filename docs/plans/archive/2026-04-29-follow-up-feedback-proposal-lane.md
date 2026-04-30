# Follow-up Plan — Feedback-Driven Proposal Lane

## 1. objective

Create additional feedback-driven proposal lanes before low-fi execution begins, including a merged lane that becomes the preferred direction if approved.

## 2. scope

Includes these deliverables:

- new proposal docs under `docs/design/proposals/`
- new `keyframes/` artifact sets with finished HTML/CSS and exported PNG sheets
- explicit notes that these lanes intentionally change some interaction/display assumptions from the current shipped MVP

Deliverables created from this plan:

- `docs/design/proposals/2026-04-29-lane-6-classroom-rally.md`
- `docs/design/proposals/2026-04-29-lane-6-classroom-rally/keyframes/`
- `docs/design/proposals/2026-04-29-lane-7-playful-rally.md`
- `docs/design/proposals/2026-04-29-lane-7-playful-rally/keyframes/`

Feedback to absorb:

- projector-only question/answer text
- strong distinct answer colors on projector
- player devices show only large colored tap targets in the same order/colors as the projector
- mobile and iPad-first answer-device design
- projector results include per-option answer graph
- top 3 reveal includes visible movement shifts
- playful, inviting, classroom-friendly tone for kids and youths

Out of scope:

- implementation in the product app
- replacing the currently selected lane without a follow-up review

## 3. constraints

- the lane must clearly state where it departs from the currently shipped MVP
- visuals should stay proposal-grade but polished and reviewable
- the artifact structure should match the other proposal lanes for easy comparison
- the lane should prioritize fun and fast player comprehension over host/admin density

## 4. steps

1. Draft the written proposal lane from the new feedback.
2. Build the matching keyframe board and export structure.
3. Export the proposal PNG sheets.
4. Draft a merged lane that combines the preferred visual character and preferred form factor.
5. Update status so the next step is review/promotion of the merged lane.

## 5. acceptance criteria

- the new lane exists as both prose and visual artifacts
- the visual artifacts clearly express the new projector-led answer model
- player answer-device frames emphasize large colored tap targets rather than answer text
- projector results visibly include answer distribution and top-3 movement

## 6. verification

- verify the lane doc and keyframes folder exist
- verify the lane exports follow the same 10-sheet convention as the other lanes
- verify the lane doc explicitly notes its future-direction behavior changes

## 7. follow-ups

- review Lane 6 and the merged Lane 7 against the current selected direction before starting low-fi production
- if Lane 7 becomes the preferred direction, update the low-fi plan accordingly
