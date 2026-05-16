# Lane 4 Proposal — Modular Lab

Derived from `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` and aligned to `docs/design/2026-04-29-parallel-design-lanes-and-rubric.md`.

Inventory revision/date used: `docs/design/2026-04-29-keyframe-inventory-and-matrix.md` (2026-04-29).

## 1. lane name

Modular Lab

## 2. one-sentence thesis

Quizzer should feel like a carefully organized product lab: structured, adaptable, and visually clear across dense host work and high-speed live play.

## 3. target mood words

Structured, intelligent, flexible, precise, systematic, calm, technical.

## 4. primary audience emphasis

- **Hosts:** make quiz setup and live control feel dependable, legible, and easy to scan under pressure.
- **Players:** translate the modular system into a simple, confident mobile flow that never feels heavy.
- **Projector audience:** preserve the same system language, but collapse it into a few large, readable modules.

## 5. design thesis

This lane frames Quizzer as a product built from repeatable units: panels, cards, status strips, chips, and clear section boundaries. The visual system should suggest order and control without feeling corporate or cold. Each surface should look like it belongs to the same toolkit, even when the content shifts from authoring to joining to live play.

The core rule: the interface is visibly modular, but never so segmented that it feels fragmented.

Modular Lab should differentiate itself from the other calm lanes by making repeatable blocks, explicit panel logic, and systemized layout rules visibly central instead of hiding structure behind restraint or typography.

## 6. shared-state treatment

Shared states should use the same modular grammar everywhere:

- **Waiting** reads as an empty-but-structured holding state, not a blank screen.
- **Active** reads through a strong primary panel plus secondary supporting modules.
- **Error** appears in a contained alert block with unmistakable hierarchy.
- **Finished** resolves into a summary stack, not a dramatic departure from the system.

Realtime refresh and player restoration should feel like the lab has updated itself in place. The user should see stable modules repopulate, not jumpy rewrites or full-screen resets. Returning players should land back inside the same modular structure they left, with progress restored as a normal state of the system.

## 6.5 canonical state coverage

Use these exact state names when turning this lane into frames:

- **lobby** — structured holding state, clear join/readiness modules
- **question open** — primary action module with supporting live panels
- **round results** — same system, reconfigured for reveal and rank comparison
- **finished** — summary stack, stable end-state modules
- **invalid join code / session not found** — contained recovery module
- **validation** — inline module-level correction states
- **reconnect / rejoin** — restored modules, no full-layout disruption

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

This surface should act like a clean entry panel with two distinct paths.

- The host and player choices should sit inside clearly separated modules with equal visual weight.
- The join-code input should be the simplest, most emphasized unit on the page.
- Auth entry should feel like a protected system access point, not a marketing page.
- Invalid join code feedback should stay inside the join module, so the page never feels broken.

**Frame intent:** show the product’s two entry modes with immediate clarity and no visual ambiguity.

### `/auth/error` — sign-in recovery

This should read like a contained system warning, not a dead end.

- Keep the layout compact and centered so the failure is easy to understand and easy to escape.
- Use one clear recovery panel with a single dominant action back home.
- The tone should be neutral and operational, matching the rest of the lab-like system.

**Frame intent:** make auth failure feel isolated, legible, and quickly recoverable.

### `/host` — dashboard

The dashboard is the lane’s strongest fit: it can lean into repeated cards, status chips, and comparison-friendly structure.

- Quiz items should read as modular records with stable metadata zones.
- Published, draft, and active states should use consistent tags that are easy to compare vertically.
- The active session card should be visually distinct, but still built from the same panel language as the rest of the dashboard.
- Keep primary actions inside the top-right or top-of-card action cluster so scanning feels mechanical and efficient.

**Frame intent:** make inventory management feel orderly, efficient, and trustworthy.

### `/host/[quizId]` — quiz editor

The editor should feel like a structured workspace made of repeatable question blocks.

- Title, validation, and publish readiness should live in a strong top summary panel.
- Each question should be a self-contained module with obvious internal sections for prompt, answers, and correctness.
- Reordering controls should visually belong to the block, not float as generic icons.
- Validation states should be shown inline at the module level so the host can fix problems without hunting.

**Frame intent:** support dense authoring by making structure visible at every step.

### `/host/session/[sessionId]` — live session controls

This surface should feel like an operations console assembled from predictable live panels.

- The current question and next action should dominate the layout as the main control module.
- Participant roster, answer counts, and status rows should sit in supporting columns or stacked panels with clear separation.
- Lobby, question open, round results, and finished should feel like explicit states of the same control system, not unrelated screens.
- Controls should have a strong “active now” hierarchy so the host never confuses readout with action.

**Frame intent:** make live hosting feel precise, monitored, and under control.

### `/play/[joinCode]` — player join and gameplay

On mobile, the modular language should be simplified to a few bold, touch-safe units.

- Join flow should compress into a single clear panel with nickname entry and one primary action.
- Answer options should be large, evenly separated cards that feel consistent in shape and behavior.
- Locked, submitted, and results states should be distinguishable by module state, not by decorative change.
- Restoration should feel like the player re-entered the same card stack, with state already in place.

**Frame intent:** keep the player experience lightweight, direct, and confidence-building.

### `/projector/[joinCode]` — projector and audience display

The projector should preserve the modular rhythm, but strip the layout down for distance reading.

- Lobby should center the join code and QR in one large hero module, with minimal supporting chrome.
- Question view should use a single dominant prompt block and large answer regions with generous separation.
- Results should pivot into leaderboard modules that are easy to compare at a glance.
- Finished state should feel like a clean summary board, not a decorative celebration screen.

**Frame intent:** retain the system’s modular identity while making the room-facing state readable from across the space.

## 8. what stays constant across the app

- Same route coverage as the canonical inventory.
- Same flow: home → join/auth → dashboard/editor → lobby → question → results → finished.
- Same live-session state boundaries and read-only projector behavior.
- Same join-code validation, publish validation, duplicate nickname handling, duplicate answer handling, and rejoin/recovery behavior.
- Same realtime refresh and cookie/session-token-based player restoration.

## 9. what changes most visibly

- Stronger use of panels, dividers, stacks, and repeated card patterns.
- Clearer separation between primary action zones and supporting information.
- More visible system metadata on host surfaces.
- Less decorative motion, more state-based layout change.
- A calmer, more engineered atmosphere across waiting and error states.

## 10. key risks

- Over-segmenting the UI so it feels busy or boxed in.
- Making the player flow feel too technical for mobile use.
- Letting the projector become a shrunken dashboard instead of a distance-first display.
- Turning modular structure into visual repetition without enough hierarchy.

## 11. implementation difficulty

Moderate. The lane is conceptually disciplined and easy to extend across surfaces, but it requires careful hierarchy control so the modular system stays clear in both dense host views and simple public screens.

## 12. why this lane matters

This direction is the safest bridge between product complexity and visual coherence. It gives Quizzer a design language that can handle authoring, live operations, mobile play, and projector display without losing consistency, making it especially strong for teams that want clarity, scalability, and easy comparison between states.

## 13. proposal summary

Modular Lab should be evaluated as a structured, adaptable system: precise enough for host operations, simplified enough for players, and restrained enough for projector readability while preserving one coherent visual family.

## 14. visual artifacts

- Keyframe folder: `docs/design/proposals/2026-04-29-lane-4-modular-lab/keyframes/`
- Main board: `docs/design/proposals/2026-04-29-lane-4-modular-lab/keyframes/index.html`
