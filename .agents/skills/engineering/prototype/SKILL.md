---
name: prototype
description: Build a disposable prototype to validate UX, flow, or feasibility before formal planning. Use when requirements are still fuzzy, the user wants to explore an idea in code, compare interaction patterns, test a throwaway route, or prototype before writing a PRD.
---

# Prototype

This skill exists to reduce uncertainty cheaply.

Build a throwaway prototype in an isolated location. Optimize for learning, not polish. Validate the idea, capture what you learned, then either delete it or carry only the findings forward.

## Workflow

1. Confirm the uncertainty.

Use this skill when the main question is still "would this work?" or "does this feel right?", not "how do we implement this for production?"

If the idea is already clear, skip prototyping and move to PRD or implementation planning.

2. Pick an isolated prototype surface.

Prefer a throwaway route, prototype page, playground, or clearly named temporary module.

Mark it obviously with names like `prototype.*`, `playground.*`, or `experimental.*`.

Do not hide prototype code inside production modules unless there is no other reasonable seam.

3. Keep the prototype narrow.

Prototype one uncertainty at a time:

- UX and flow
- interaction behavior
- information density
- feasibility of an integration
- trade-offs between two directions

If you are trying to answer three big questions at once, the prototype is too large.

4. Cheat aggressively.

Use fake data, mocked responses, hardcoded values, simplified state, and thin wiring whenever they help answer the question faster.

Do not prematurely extract abstractions, write production-grade tests, or design production-ready architecture.

5. Make it runnable.

A prototype should be inspectable in the real app or local environment whenever possible. Prefer visible feedback over abstract notes.

The user should be able to look at it and say "yes, that direction works" or "no, kill it".

6. Evaluate the result.

Write down:

- what was validated
- what felt wrong
- what surprised you
- what should carry into the PRD or implementation plan
- what should be discarded

Do not let the prototype become the documentation. Convert the learning into decisions.

7. Cleanly end the prototype.

Either:

- delete the throwaway code, or
- keep it in a clearly marked prototype location until decisions are captured elsewhere

Never present prototype code as production-ready implementation.

If the prototype looks promising, carry the findings forward — not the mess.

## Guardrails

- Do not turn prototype code into production code by default
- Do not over-test disposable code unless the test itself helps exploration
- Do not spend time on naming, architecture, or refactors that do not improve learning
- Do not mix multiple big questions into one prototype
- Do not mistake a convincing demo for a complete design

## Output

When finishing, summarize the prototype in this format:

- Goal: what uncertainty the prototype was meant to reduce
- Surface: where the prototype lives
- Findings: what the prototype demonstrated
- Decision: what should happen next
- Cleanup: whether the prototype was deleted, kept temporarily, or needs follow-up cleanup
