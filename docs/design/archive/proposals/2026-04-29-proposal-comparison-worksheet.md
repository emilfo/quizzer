# Proposal Comparison Worksheet — 2026-04-29

Use this worksheet to review the five parallel design lanes and choose one primary direction, plus any traits worth merging forward.

Assumption: the lane proposals live in this same folder.

## 1. purpose

Compare the five lane proposals against the same product-flow guardrails, score them with a shared rubric, and capture a clear selection plus merge notes for the next design phase.

## 2. review instructions

1. Read all lane docs first.
2. Run the pre-score coverage gate before scoring any lane.
3. Score each lane independently before comparing notes.
4. Keep the review grounded in the shipped flow and route/state inventory.
5. Favor clarity, confidence, and consistency over novelty.
6. Select one primary lane, optionally note one fallback lane, and treat all remaining ideas as merge candidates only.

## 3. pre-score coverage gate

Do not score a lane until these pass/fail checks are reviewed.

| Coverage check | Pass/Fail | Notes |
| --- | --- | --- |
| Covers `/`, `/auth/error`, `/host`, `/host/[quizId]`, `/host/session/[sessionId]`, `/play/[joinCode]`, `/projector/[joinCode]` | Pass | All five lane docs cover the canonical route set. |
| Explicitly accounts for **lobby** | Pass | Present in each lane's canonical state coverage and required low-fi frame list. |
| Explicitly accounts for **question open** | Pass | Present in each lane's canonical state coverage and required low-fi frame list. |
| Explicitly accounts for **round results** | Pass | Present in each lane's canonical state coverage and required low-fi frame list. |
| Explicitly accounts for **finished** | Pass | Present in each lane's canonical state coverage and required low-fi frame list. |
| Explicitly accounts for **invalid join code / session not found** | Pass | Covered in route treatment and low-fi frames for player/projector flows. |
| Explicitly accounts for **validation** | Pass | Covered in host/editor and canonical state sections. |
| Explicitly accounts for **reconnect / rejoin** | Pass | Covered explicitly in all lane docs. |
| Includes enough frame guidance for low-fi drafting | Pass | Good enough to proceed, though lanes 1/3/4 rely on selection-time merge guidance for sharper differentiation. |

**Low-fi readiness blockers:** none blocking selection.

## 4. weighted rubric

Score each category 1–5, then multiply by the weight.

| Category | Weight | Score (1-5) | Weighted | Notes |
| --- | ---: | ---: | ---: | --- |
| Flow fidelity | 20% |  |  |  |
| Host clarity | 20% |  |  |  |
| Player confidence | 20% |  |  |  |
| Projector readability | 20% |  |  |  |
| Distinctiveness | 10% |  |  |  |
| Cross-surface coherence | 10% |  |  |  |
| **Total** | **100%** |  |  |  |

Scoring guide:

- **5** = excellent fit, immediately usable
- **3** = workable with notable revision
- **1** = weak fit or unclear direction

## 5. lane scoring

### Quiet Control Room

**Thesis:** calm, precise, and high-trust.

**Best fit for:** host confidence, operational clarity, restrained live-state treatment.

**Risks:** may feel too quiet or underpowered for player excitement.

| Category | Score | Notes |
| --- | ---: | --- |
| Flow fidelity | 5 | Preserves the shipped MVP flow and state handling exactly. |
| Host clarity | 5 | Strongest operational trust and clearest control posture. |
| Player confidence | 4 | Simple and safe, but not especially energizing. |
| Projector readability | 5 | Sparse, distance-readable, and highly legible. |
| Distinctiveness | 3 | Clear direction, but overlaps with the other restrained lanes. |
| Cross-surface coherence | 5 | Consistent treatment across host, player, and projector. |

**Overall notes:** strongest low-risk clarity lane; best backup if the team wants maximum operational trust and minimal design risk.

**Low-fi readiness blockers:** may need extra player warmth and stronger projector reveal moments if selected as the primary lane.

### Broadcast Night

**Thesis:** energetic, theatrical, and show-forward.

**Best fit for:** projector spectacle, live-room energy, memorable transitions.

**Risks:** can overplay drama and distract from answer confidence.

| Category | Score | Notes |
| --- | ---: | --- |
| Flow fidelity | 5 | Stays within the real shipped flow and route/state set. |
| Host clarity | 4 | Good, but theatrical emphasis adds some control-surface risk. |
| Player confidence | 4 | Exciting, but could tip toward spectacle over restraint. |
| Projector readability | 4 | Strong hero moments, but must be carefully controlled for distance reading. |
| Distinctiveness | 5 | Most visibly different and event-like. |
| Cross-surface coherence | 4 | Coherent, but some moments push projector-first energy harder than the other surfaces. |

**Overall notes:** best source of event energy and reveal posture; strongest borrow lane for projector moments rather than the full system base.

**Low-fi readiness blockers:** needs restraint rules to keep projector spectacle and host clarity from colliding.

### Editorial Precision

**Thesis:** premium, type-led, and composed.

**Best fit for:** strong hierarchy, polished information design, disciplined composition.

**Risks:** may read as too restrained or formal if not warmed up carefully.

| Category | Score | Notes |
| --- | ---: | --- |
| Flow fidelity | 5 | Tracks canonical routes and state families cleanly. |
| Host clarity | 4 | Clear and premium, but less structurally explicit for dense host views than Modular Lab or Quiet Control Room. |
| Player confidence | 4 | Elegant and calm, though slightly formal. |
| Projector readability | 5 | Excellent large-type and hierarchy potential. |
| Distinctiveness | 3 | Too close to Quiet Control Room in practice. |
| Cross-surface coherence | 5 | Strong shared language and premium consistency. |

**Overall notes:** strongest typographic/hierarchy borrow lane and the closest alternate candidate to the selected direction.

**Low-fi readiness blockers:** needs warmer player posture and more explicit structural rhythm for dense host flows if used as the base lane.

### Modular Lab

**Thesis:** systematized, flexible, and visibly structured.

**Best fit for:** dense host surfaces, repeatable panels, scalable layout logic.

**Risks:** can feel mechanical if the modular language is not softened on player/projector surfaces.

| Category | Score | Notes |
| --- | ---: | --- |
| Flow fidelity | 5 | Preserves the real MVP flow and handles all canonical states cleanly. |
| Host clarity | 5 | Strongest structural fit for dashboard, editor, and live controls. |
| Player confidence | 4 | Good mobile simplification, though it needs warmth from another lane. |
| Projector readability | 4 | Solid, but benefits from stronger hero moments. |
| Distinctiveness | 4 | More systemized and explicit than the restrained lanes without becoming theatrical. |
| Cross-surface coherence | 5 | Best reusable system logic across all surfaces. |

**Overall notes:** selected primary lane because it translates most cleanly into low-fi structure while staying faithful to the MVP.

**Low-fi readiness blockers:** must borrow editorial hierarchy, warmer player tone, and stronger reveal moments so the system does not feel too mechanical.

### Playful Signal

**Thesis:** expressive, friendly, and memorable.

**Best fit for:** welcoming entry, encouraging player actions, approachable motion.

**Risks:** can lose authority if the playful tone overrides control and legibility.

| Category | Score | Notes |
| --- | ---: | --- |
| Flow fidelity | 4 | Mostly aligned, but personality pressure creates slightly more drift risk than the other lanes. |
| Host clarity | 4 | Friendly, but less authoritative for dense or live host states. |
| Player confidence | 5 | Best onboarding warmth and low-pressure player feel. |
| Projector readability | 4 | Good if restrained, but decorative drift is a real risk. |
| Distinctiveness | 5 | Highly memorable and clearly separate from the calmer lanes. |
| Cross-surface coherence | 4 | Coherent, but easiest lane to over-soften in host/projector contexts. |

**Overall notes:** best source of player warmth, friendlier copy, and approachable mobile posture rather than the full structural base.

**Low-fi readiness blockers:** needs stronger guardrails for host authority and projector restraint if used beyond selective borrowing.

## 6. comparison summary

| Lane | Strengths | Weaknesses | Total score | Recommendation |
| --- | --- | --- | ---: | --- |
| Quiet Control Room | Best operational calm, state clarity, and projector restraint | Less distinctive, less energizing for player and reveal moments | 92 | Fallback lane; borrow control calm and recovery posture |
| Broadcast Night | Strongest event energy and projector hero moments | Highest risk of overdramatizing states | 86 | Borrow reveal and projector emphasis selectively |
| Editorial Precision | Best typographic hierarchy and premium composition | Too close to Quiet Control Room; less structural for dense host flows | 88 | Borrow hierarchy, spacing, and projector typography |
| Modular Lab | Best structural logic, host fit, and low-fi translation path | Can feel mechanical without warmth and stronger reveal moments | 90 | **Primary selection** |
| Playful Signal | Best onboarding warmth and player friendliness | Can soften host authority and projector discipline | 86 | Borrow join tone and player reassurance |

## 7. final selection / merge notes

**Primary selection:**

- Selected lane: **Modular Lab**
- Why this lane wins: it is the cleanest bridge from proposal work to low-fi execution. It preserves the shipped route/state inventory, handles dense host/editor/live-control surfaces best, and gives the next phase a repeatable panel and layout system instead of only a visual mood.

**Fallback selection:**

- Fallback lane: **Quiet Control Room**
- Why it is the fallback: it is the safest low-risk alternative if Modular Lab feels too engineered during low-fi, with especially strong operational trust and projector legibility.

**Traits to merge from other lanes:**

- From Quiet Control Room: restrained status treatment, calm state gating, and precise recovery/validation posture.
- From Broadcast Night: stronger projector hero moments and clearer live-event emphasis for reveal states.
- From Editorial Precision: typography-led hierarchy, composed spacing rhythm, and premium projector composition.
- From Modular Lab: repeatable panels, systemized host/editor structure, and consistent state blocks.
- From Playful Signal: warmer join-entry tone, friendlier player copy, and more reassuring mobile feedback.

**Constraints for the next phase:**

- Keep the shipped route/state inventory intact.
- Do not expand product scope while merging traits.
- Preserve readability for host, player, and projector at all times.

**Open questions:**

- How much Broadcast Night emphasis can be added to projector and results states before it starts to compete with Modular Lab clarity?
- How much Editorial Precision hierarchy should be absorbed before the base lane stops reading as Modular Lab?

## 8. picture-based review outcome

This section supersedes the text-only selection pass when the exported PNG sheets are available.

### review result

- **Decision:** keep **Modular Lab** as the winner after reviewing the actual exported keyframe pictures.
- **Fallback:** keep **Quiet Control Room** as the fallback.
- **Important nuance:** **Editorial Precision** presented the strongest pure visual polish and hierarchy in the images, but Modular Lab remained the best fit once the review weighted shipped-MVP fidelity, structural clarity, and low-fi execution readiness together.

### picture-based score adjustment

| Lane | Prior score | Picture-based score | Change | Picture-based note |
| --- | ---: | ---: | ---: | --- |
| Quiet Control Room | 92 | 90 | -2 | Still clear and restrained, but visually underpowered beside the stronger systems. |
| Broadcast Night | 86 | 84 | -2 | Great event energy, but louder and less faithful in a few visible moments. |
| Editorial Precision | 88 | 87 | -1 | Best pure hierarchy and polish, but some visible drift in live/result details. |
| Modular Lab | 90 | 92 | +2 | The exported sheets proved it is the clearest full-system bridge into low-fi. |
| Playful Signal | 86 | 80 | -6 | Warm and inviting, but the images showed the most drift from shipped public/result behavior. |

### visible evidence driving the call

- **Modular Lab**
  - strongest host structure in `2026-04-29-lane-4-modular-lab/keyframes/exports/04-host-live-sheet.png`
  - strongest player-state continuity in `2026-04-29-lane-4-modular-lab/keyframes/exports/06-player-live-sheet.png`
  - strongest projector discipline in `2026-04-29-lane-4-modular-lab/keyframes/exports/07-projector-lobby.png` and `10-projector-finished.png`
  - strongest all-in-one player join/error/validation coverage in `05-player-join-sheet.png`

- **Quiet Control Room**
  - still the best pure fallback for distance readability and operational calm
  - public screens read cleanly, but the total set feels more severe and less compelling than Modular Lab

- **Editorial Precision**
  - strongest typographic hierarchy and most polished overall compositions
  - would be the winner on visual elegance alone
  - lost the final call because the exported sheets introduced more visible drift from the shipped MVP than Modular Lab

### concrete drift seen in pictures

- `2026-04-29-lane-5-playful-signal/keyframes/exports/09-projector-results.png` shows public per-option/count-style reveal detail that the shipped projector flow avoids.
- `2026-04-29-lane-5-playful-signal/keyframes/exports/10-projector-finished.png` introduces a projector CTA that breaks the read-only projector model.
- `2026-04-29-lane-2-broadcast-night/keyframes/exports/06-player-live-sheet.png` shows player result score-delta framing that goes beyond the shipped reveal posture.
- `2026-04-29-lane-3-editorial-precision/keyframes/exports/06-player-live-sheet.png` and `09-projector-results.png` add visible result metadata beyond the canonical public/result read.
- A shared cleanup for later low-fi work: remove player round-result score deltas and any extra public reveal metrics that are not in the shipped MVP.

### low-fi implication

Proceed with **Modular Lab** as the base system, but strengthen it with:

- **Editorial Precision** for hierarchy and compositional polish
- **Quiet Control Room** for validation, recovery, and public restraint
- **Broadcast Night** for selective projector reveal emphasis only
- **Playful Signal** for join warmth and player reassurance only

## 9. corrected styled-export review

After regenerating the PNGs with the actual CSS and a fixed 16:9 export pipeline, the selection still holds:

- **Winner:** Modular Lab
- **Fallback:** Quiet Control Room
- **Strongest visual-polish reference:** Editorial Precision

### styled-export score adjustment

| Lane | Prior picture score | Styled-export score | Change | Styled-export note |
| --- | ---: | ---: | ---: | --- |
| Quiet Control Room | 90 | 91 | +1 | Stronger than before with correct styling; still the safest public-room fallback. |
| Broadcast Night | 84 | 84 | 0 | The event energy reads clearly, but the reveal posture still pushes too theatrical. |
| Editorial Precision | 87 | 88 | +1 | The corrected styling proved it has the strongest hierarchy and polish, but not the cleanest MVP fidelity. |
| Modular Lab | 92 | 93 | +1 | The styled exports made the structural-system advantage even clearer. |
| Playful Signal | 80 | 82 | +2 | Styling helped the warmth land better, but the public/result drift remains. |

### corrected styled-export conclusion

- **Editorial Precision** is the strongest lane on pure visual elegance and composition.
- **Modular Lab** remains the best lane once the review prioritizes shipped-behavior fidelity, complete state coverage, host/player/projector consistency, and low-fi execution readiness together.
- Proceed with **Modular Lab** as the low-fi base while borrowing **Editorial Precision** more aggressively for typographic hierarchy and presentation polish.

## 10. later promotion note

After the original lane review, two feedback-driven future-direction lanes were added:

- `2026-04-29-lane-6-classroom-rally`
- `2026-04-29-lane-7-playful-rally`

User preference overrode the earlier selection:

- **Promoted direction:** `2026-04-29-lane-7-playful-rally`
- **Why:** it better matches the desired combination of Lane 5’s visual character and Lane 6’s projector-led, color-first classroom form factor.

This means the comparison notes above remain useful as historical review context, but the active low-fi direction now follows **Lane 7**, not Modular Lab.
