# Lane 3 Proposal — Editorial Precision

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Editorial Precision

## 2. one-sentence thesis

Quizzer should feel like a premium editorial system: type-led, composed, and exact, with every state framed as intentional rather than functional.

## 3. target mood words

Refined, composed, sharp, measured, premium, quiet, exact, confident.

## 4. primary audience emphasis

- **Hosts:** make authoring and live operation feel trustworthy, orderly, and high-signal.
- **Players:** reduce friction to the absolute essentials so joining and answering feel elegant and obvious.
- **Projector audience:** maximize scan speed with big type, sparse hierarchy, and minimal decorative noise.

## 5. design thesis

This lane treats Quizzer as a carefully edited publication rather than a generic app shell. The visual system should rely on strong typography, disciplined spacing, and a limited but deliberate color vocabulary. Instead of “more UI,” the composition should use fewer, more meaningful elements arranged with editorial rhythm.

The result should feel composed under pressure: host controls look authoritative, player actions feel obvious, and projector screens read like large-format headlines with supporting detail beneath.

Editorial Precision should differentiate itself from the other restrained lanes by leaning hardest into typography-led composition, narrative pacing, and premium page-like structure rather than operational minimalism or panel-driven modularity.

## 6. shared-state treatment

Editorial Precision should keep the same flow and state vocabulary across all surfaces, but frame those states like a well-designed article structure:

- **Waiting** feels like a deliberate pause with clear next-step guidance.
- **Live / synced** feels calm and dependable, not animated for its own sake.
- **Errors** are precise, concise, and visually separated from success states.
- **Finished** feels conclusive and polished, like a closing spread.

Realtime refresh and player restoration must feel seamless and dignified. A restored player should appear to resume mid-story, not to recover from a technical problem. Refresh-driven updates should be visually subtle so the layout always feels stable, even as the data changes.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — composed onboarding, clear invitation to join or wait
- **question open** — headline hierarchy, deliberate answer focus
- **round results** — precise reveal, composed score movement
- **finished** — polished closing spread, stable final hierarchy
- **invalid join code / session not found** — restrained recovery with exact copy
- **validation** — precise editorial markup for what blocks progress
- **reconnect / rejoin** — quiet continuity, never technical drama

## 6.6 required low-fi frames

- `/` — unauthenticated host entry, authenticated host entry, invalid join code
- `/auth/error` — sign-in failure recovery
- `/host` — no active session, active session present
- `/host/[quizId]` — publishable, blocked by validation
- `/host/session/[sessionId]` — lobby, question open, round results, finished
- `/play/[joinCode]` — invalid/not-found, join-open, join-closed, question-open unanswered, question-open answered, round-results, finished-restored-player, rejoin-required
- `/projector/[joinCode]` — invalid/not-found, lobby, question-open, round-results, finished

## 7. route-by-route treatment

### `/` — home / host auth / player join

This surface should be the clearest example of editorial hierarchy in the app.

- Split host and player paths with strong typographic contrast rather than loud boxes.
- Let the join-code entry read like a featured input, with one dominant field and minimal distraction.
- Host auth should feel precise and trustworthy, with recovery language kept short and composed.
- Error feedback for invalid join codes should sit close to the input and feel editorially “caption-like,” not alarmist.

**Frame intent:** make the first decision feel instant, premium, and unambiguous.

### `/auth/error` — sign-in recovery

This should be a restrained recovery page, not a branded failure screen.

- Use a narrow, centered composition with a clear headline and one recovery action.
- Keep explanatory text short and exact; avoid emotional language.
- The page should feel like a controlled detour, with no competing actions or decorative clutter.

**Frame intent:** acknowledge the failure cleanly and return the host to the main flow without visual noise.

### `/host` — dashboard

The dashboard should feel like a curated index of active work.

- Quizzes can be presented as editorial cards or rows with strong title hierarchy and restrained metadata.
- Published, draft, and active states should read as structured labels, not badge-heavy decoration.
- The active session should feel like the lead story: the most prominent item, but still calm and orderly.
- Keep actions visible through hierarchy, not density.

**Frame intent:** make the host feel in control of a compact, high-trust workspace.

### `/host/[quizId]` — quiz editor

This is the most structurally important host surface and should feel like a disciplined layout system.

- Use clear sectioning for title, validation, and questions, with strong headings and consistent rhythm.
- Question blocks should read like editorial modules: distinct, repeatable, and easy to scan.
- Validation must be visually assertive but not noisy; the host should know exactly what blocks publishing.
- The arrangement should suggest precision editing, not form-filling.

**Frame intent:** help the host see the quiz as an ordered manuscript that is ready to publish.

### `/host/session/[sessionId]` — live session controls

This surface should feel like a live newsroom control page: dense enough to inform, composed enough to remain readable.

- The current question should dominate the page with the strongest hierarchy.
- Supporting facts—answer count, participant roster, session state—should sit in clearly separated columns or panels.
- Controls should be unmissable but visually restrained, as if they were the editorial tools for moving the story forward.
- Lobby, question, results, and finished states should each be distinct while preserving the same grid logic.

**Frame intent:** give the host a serious live control room that stays calm under state changes.

### `/play/[joinCode]` — player join and gameplay

The player experience should feel like a polished mobile reading-and-response flow.

- Joining should be almost minimal: one headline, one supporting line, one input, one action.
- Nickname and answer states should use strong contrast and generous spacing so touch targets feel exact.
- Answer options should look deliberate and premium, not playful or noisy.
- Result and restoration states should keep the same layout language so returning players feel continuity, not reset.

**Frame intent:** make the player feel like the app is guiding them through a focused sequence, not a form maze.

### `/projector/[joinCode]` — projector and audience display

The projector should be the most reductive expression of the lane.

- Lobby screens should foreground the join code and QR with almost magazine-cover simplicity.
- Question screens should use oversized type, sparse supporting elements, and a very clear reading order.
- Leaderboard and round results should feel like a clean sports-page spread: bold rank, bold score, little else.
- Finished state should close the experience with composure and minimal ornament.

**Frame intent:** make the room-facing surface instantly legible from a distance and unmistakably premium.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same shipped flow: home → join/auth → dashboard/editor → lobby → question → results → finished.
- Same live-session state boundaries and read-only projector behavior.
- Same join-code validation, publish validation, and recovery states.
- Same restoration behavior for returning players and refresh-driven state updates.

## 9. what changes most visibly

- Typography leads the visual system, with more decisive hierarchy and fewer ornamental distractions.
- Layouts feel more editorial: clearer columns, stronger rhythm, and purposeful negative space.
- Color should be sparse and selective, used to emphasize state and action rather than decorate every surface.
- Status, validation, and live-state cues should feel precise and composed.
- Projector screens should look especially large, quiet, and confident.

## 10. key risks

- Becoming too austere and losing warmth for players.
- Overusing typography hierarchy so the interface feels heavy instead of clear.
- Making host controls too “designy” and not obviously actionable.
- Letting the projector become beautiful but too sparse to support live comprehension.

## 11. implementation difficulty

Moderate. The lane depends more on disciplined layout and typographic judgment than on heavy visual effects, but it requires strong consistency across many states to avoid feeling dry.

## 12. why this lane matters

Editorial Precision gives Quizzer a premium, confident identity that can support both serious host workflows and fast live play. It is the best lane for showing that the product can feel composed, intelligent, and memorable without needing spectacle.

## 13. proposal summary

Editorial Precision should be evaluated as the most restrained premium direction: highly legible, carefully arranged, and precise across host, player, and projector surfaces while preserving every real state in the shipped flow.

## 14. visual artifacts

- Keyframes folder: [`2026-04-29-lane-3-editorial-precision/keyframes/`](./2026-04-29-lane-3-editorial-precision/keyframes/)
- Preview entrypoint: [`index.html`](./2026-04-29-lane-3-editorial-precision/keyframes/index.html)
