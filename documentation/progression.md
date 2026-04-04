# Pangea Progression Log

This file records the project evolution and recent implementation milestones.

Use it as an append-only journal: add a new dated entry instead of rewriting history.

## Origin And Evolution

- Graphical interface idea started in DHTML.
- LuaPang was translated into TypescriptPang.
- TypescriptPang was rewritten as TypescriptStructure.
- TypescriptStructure focused on list-of-lists intermediate program structures derived from polish-notation source code.
- Full program-tree graphical editing and reliable two-way text <-> graphics transformation remain open research/design challenges.

## Current Direction

- Keep source code central while improving graphical readability.
- Use live visual cues in the editor to expose parse/evaluation behavior.
- Preserve toy-language goals: learning, experimentation, and fun.

## Recent Milestones (This Session)

1. Runtime associativity change

- Infix chaining moved from right-associative behavior to left-to-right folding for binary infix operators.
- Chained expressions such as 1 + 2 + 3 now evaluate as ((1 + 2) + 3).

2. Runtime/operator consistency

- Infix operator right operands are evaluated in immediate phrase mode where needed.
- Special arity behavior is preserved so non-binary patterns are not incorrectly chained.

3. Editor overhaul in main.html

- Replaced basic contenteditable input with a textarea + overlay editor.
- Added token-aware coloring and active-token highlighting.
- Added parse hints and left-to-right chain hints.
- Added visual grouping overlays for infix chains.

4. Visual iteration and fixes

- Introduced progressive chain styling and grouping layers.
- Fixed spacing/painting glitches from invasive box styling.
- Adjusted grouping to respect parenthesis depth boundaries.
- Tuned final styling to a cleaner balance (subtle fill + thin outline + lighter underline emphasis).

5. Runtime/editor synchronization

- Added optional onPangeaStateChange hook so UI can refresh when runtime state changes.

6. Documentation updates

- Added a friendly root README.
- Added docs landing page at docs/index.html with detailed project context and roadmap.

## Current Open Challenges

- Program-tree graphical editor design.
- Stable two-way mapping between textual source and graphical structures.
- Formal intermediate representation suitable for both execution and visualization.
- Better automated tests for associativity, chain rendering, and nested expression edge cases.

## Suggested Next Steps

- Define a minimal IR schema and invariants.
- Add a test matrix for expression parsing/evaluation and visual grouping parity.
- Split large inlined editor script/style into dedicated files for maintainability.

## Journal Entries

### 2026-04-04

Summary

- Runtime infix evaluation moved to left-to-right chaining for binary infix operators.
- Editor evolved into a structured overlay-based UI with parse and associativity hints.
- Chain readability features were iterated and refined (grouping overlays, subtle outlines, and tuned underline emphasis).
- Runtime/editor synchronization hook was added.
- New project docs were added: README and detailed docs page.

Files touched in this phase

- main.js
- main.html
- README.md
- docs/index.html
- documentation/progression.md

Notes

- Graphical program-tree editing and robust two-way text/graphics transformation are still open design goals.
- Next journal entries should be appended below with a new date header.
