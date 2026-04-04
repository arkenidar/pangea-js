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

### 2026-04-04 (times chaining fix)

Summary

- Fixed regression where nested `times` expressions behaved inconsistently after infix left-to-right changes.
- Restricted runtime infix left-fold chaining to explicitly chainable operators only.
- Kept `times` as infix but non-chainable, preserving loop/block semantics.
- Aligned editor parse/chain hints with runtime so non-chainable operators are not shown as arithmetic chains.

Implementation notes

- In `main.js`, introduced `chainable` metadata for infix operators.
- Set binary math/comparison operators and selected infix operators (for example `+`, `-`, `*`, `%`, `==`, `<`, `<=`, `>`, `**`) as chainable.
- Updated infix folding in `wordExec` to continue only when current and next infix operators are chainable.
- Restored `times` block execution to full phrase mode to avoid eager truncation of nested loop bodies.
- In `main.html`, chain highlighting and left-to-right chain hinting now require `entry.chainable === true`.

Validation cases

- `2 times 2 times print times_count 1` -> output `1 2 1 2`
- `2 times ( 2 times print times_count 1 )` -> output `1 2 1 2`
- `3 times ( 2 times print times_count 2 )` -> output `1 1 2 2 3 3`

Files touched in this entry

- main.js
- main.html

### 2026-04-04 (atomicArgs for times_count)

Summary

- Fixed `times_count N + times_count M` incorrectly parsing as `times_count(N + times_count M)`.
- Added `atomicArgs` flag to `times_count` so its argument is a single atomic token, not a full phrase.

Implementation notes

- In `main.js`, added `atomicArgs = true` to `times_count`; body evaluates arg with `skipOperator=true`.
- Updated `phraseLength` and `wordExec` to respect `atomicArgs` when scanning arguments.
- In `main.html`, `editorWordArity` / `editorPhraseLength` also respect `atomicArgs`.

Validation cases

- `3 times 2 times print times_count 2 + times_count 1` -> output `1,1 1,2 2,1 2,2 3,1 3,2`

Files touched in this entry

- main.js
- main.html

### 2026-04-04 (chain decoration phrase-awareness)

Summary

- Fixed chain step decoration: `tok-chain-step-N` was stuck at step-1 for all operators in chains containing function-call operands.
- Rebuilt chain detection algorithm to use `editorPhraseLength` when advancing over right operands.

Implementation notes

- In `main.html`, chain decoration loop now calls `editorPhraseLength` to compute operand span for function calls.
- Each infix operator in the chain correctly gets `tok-chain-step-1`, `tok-chain-step-2`, `tok-chain-step-3`, etc.

Validation cases

- `"" + times-count 2 + "," + times-count 1` shows step-1/step-2/step-3 on the three `+` operators.

Files touched in this entry

- main.html

### 2026-04-04 (dash-to-underscore normalization)

Summary

- Source identifiers written with dashes (e.g. `times-count`) now auto-resolve to their snake_case equivalents (`times_count`).
- Source text is preserved as typed; normalization happens at parse time and in editor namespace lookups.

Implementation notes

- In `main.js`, added `normalizeWordToken(word)` called inside `parseCode`; skips JSON strings, standalone `-`, and non-identifier patterns.
- In `main.html`, added `normalizeLookupWord(word)` bridging to the runtime helper; all namespace lookups in editor go through it.
- Parse hints display the normalized form (e.g. `times_count`) even when source uses `times-count`.

Validation cases

- Source `times-count 1` resolves identically to `times_count 1`.
- Parse hint shows `times_count(1)` when source reads `times-count 1`.

Files touched in this entry

- main.js
- main.html
- documentation/progression.md
