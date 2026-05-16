# Follow-up Plan — Proposal Keyframe Drafts

## 1. objective

Produce a keyframe draft for every design proposal so each lane exists as both a written description and a visual artifact set with finished HTML/CSS plus exported pictures of the keyframes.

## 2. scope

Includes these deliverables:

- one `keyframes/` artifact set for each of the five proposal lanes
- finished static HTML/CSS for each proposal's keyframe draft
- exported pictures for each proposal's keyframe set
- proposal-doc updates that point to the visual artifacts
- status updates that point the next step at review rather than draft creation

Artifact layout per proposal:

```txt
docs/design/proposals/
  2026-04-29-lane-N-name.md
  2026-04-29-lane-N-name/
    keyframes/
      index.html
      styles.css
      tokens.css
      manifest.json
      README.md
      exports/
        01-entry-sheet.png
        02-host-dashboard-sheet.png
        03-host-editor-sheet.png
        04-host-live-sheet.png
        05-player-join-sheet.png
        06-player-live-sheet.png
        07-projector-lobby.png
        08-projector-question.png
        09-projector-results.png
        10-projector-finished.png
```

Minimum visual coverage per proposal:

- entry sheet: `/`, `/auth/error`, invalid join code
- host dashboard sheet: no active session, active session
- host editor sheet: publishable, blocked by validation
- host live sheet: lobby, question open, round results, finished
- player join sheet: invalid/not-found, join-open, join-closed, validation
- player live sheet: question-open unanswered, question-open answered, round-results, finished-restored-player, reconnect/rejoin
- projector lobby
- projector question
- projector results
- projector finished

Inputs that remain authoritative:

- `docs/design/archived/2026-04-29-keyframe-inventory-and-matrix.md`
- `docs/design/archived/2026-04-29-parallel-design-lanes-and-rubric.md`
- the five lane proposal docs under `docs/design/proposals/`

Out of scope:

- implementation inside the product app
- new product flows or state additions
- high-fidelity production polish beyond proposal-grade keyframe drafts

## 3. constraints

- every proposal must preserve the canonical route/state inventory exactly
- every proposal must ship as both prose and visual artifacts
- visual differentiation should come from each lane's thesis, not from changing product behavior
- screenshots must be generated from the delivered HTML/CSS rather than mocked separately
- the same filename and export structure should be used across all five proposals so review is comparable
- keep scope bounded by using contact sheets for multi-state host/player surfaces

## 4. steps

1. Create a sibling folder for each lane doc to hold its `keyframes/` artifacts.
2. Build a finished static HTML/CSS prototype for each proposal lane using the same canonical coverage and export names.
3. Include manifest/readme metadata so another reviewer can understand what each sheet covers.
4. Export picture files from each finished prototype.
5. Update proposal docs with links to their keyframe artifacts.
6. Update `docs/status.md` so the active pointer reflects keyframe drafting/review.
7. Verify the full artifact set exists and is structurally consistent across all five lanes.

## 5. acceptance criteria

- each proposal has both a written lane doc and a sibling `keyframes/` folder
- each `keyframes/` folder contains finished HTML/CSS plus exported images
- each proposal covers the same canonical surface/state set
- all export filenames are consistent across lanes for easy comparison
- the artifacts are polished enough to review visually without guessing the intended frame content
- no proposal invents unsupported product flows or states

## 6. verification

- verify all five proposal folders exist alongside their lane docs
- verify each folder contains `index.html`, `styles.css`, `tokens.css`, `manifest.json`, `README.md`, and `exports/`
- verify all ten expected exports exist for every lane
- verify the proposal docs point to their visual artifacts
- verify the HTML/CSS keyframes match the lane theses and canonical inventory

## 7. follow-ups

- compare the five finished keyframe sets side by side
- decide whether proposal review still favors the current selected lane after visual execution
- if the preferred direction changes, update the low-fi plan and status pointer before implementation work begins
