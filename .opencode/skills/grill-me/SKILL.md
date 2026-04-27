---
name: grill-me
description: Interview the user one question at a time until the plan or design is specific enough to execute.
compatibility: opencode
---

Interview the user about a plan, design, or feature until the requirements are concrete enough to implement.

Rules:

- Ask exactly one question per turn.
- Use opencode `question` prompts for every user-facing question.
- For each question, provide concise multiple-choice options with the recommended answer first.
- Set `multiple: false` unless the question truly needs multiple selections.
- Wait for the user's answer before asking the next question.
- Do not batch several questions together.
- If the answer can be inferred from the repo, plan docs, or current context, inspect those first and avoid asking unnecessarily.
- Stop once the remaining gaps are non-critical and summarize the clarified decisions.
