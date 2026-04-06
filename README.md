# Pangea JS

Pangea is a toy language project for learning, experimentation, and language design.

It explores a compact, polish-notation-inspired syntax, a small browser-based runtime, and the longer-term idea of a more graphical programming experience.

## Why this project exists

The project began with a simple ambition: make programming structure easier to see.

The longer-term goal is a graphical program editor where:

- Source code and graphical structure can both be first-class.
- Programs can move in both directions between text and visual form.
- Intermediate program structures can be represented clearly during execution.

For now, source code is still central, but the project keeps moving toward a stronger visual model.

## Current state

- Runtime and editor prototype in JavaScript and HTML.
- Live browser-based code editing and execution.
- Experimental visual hints for parsing and infix associativity.
- Early structural ideas influenced by list-of-lists intermediate representations.

## Project files

- `src/browser/main.html`: browser UI/editor.
- `src/browser/app.js`: browser adapter/editor logic.
- `src/browser/tests.manifest.json`: browser test-library manifest.
- `src/browser/code/show-source.js`: in-page source viewer helper.
- `src/core/runtime.js`: shared language runtime and operators.
- `src/cli/pangea.js`: minimal Node CLI entrypoint.
- `tests/core/*.sp`: core browser/CLI sample programs.
- `examples/`: extra samples.
- `documentation/`: historical project notes.

## Quick start

Serve this folder with a static web server, then open `src/browser/main.html`.

Hosted version (GitHub Pages):

- https://arkenidar.github.io/pangea-js/src/browser/main.html
- https://github.arkenidar.com/pangea-js/src/browser/main.html

Example using VS Code Live Server:

1. Open the project folder.
2. Start Live Server on `src/browser/main.html`.
3. Type code in the editor and click `execute`.

CLI usage:

1. `npm run cli -- factorial.sp`
2. `npm run cli -- -e 'print "hello cli"'`

## Browser test library

The browser page at `src/browser/main.html` includes a Test Library panel.

- Tests are loaded from `src/browser/tests.manifest.json`.
- Changing the test dropdown auto-loads the selected file into the editor.
- `load` also loads the currently selected test into the editor.
- Loading a test does not execute it automatically.
- Use `execute` (or `Ctrl+Enter` / `Cmd+Enter`) to run editor content.

Manifest format:

```json
[{ "label": "core: factorial", "path": "../../tests/core/factorial.sp" }]
```

Each item needs:

- `label`: text shown in the test dropdown.
- `path`: file path resolved from `src/browser/main.html`.

If the manifest cannot be loaded, the app falls back to an internal default list.

## Browser controls

- `clear output`: clears only the output panel.
- `clear output, then execute`: clears output and then runs the current editor content.
- `advanced` -> `load runtime into editor`: optional helper to load runtime source into the editor.
- Source-view panels (`main.html`, `app.js`, `../core/runtime.js`) are available at the bottom and start collapsed.

## Browser editor shortcuts

- `Ctrl+Enter` (or `Cmd+Enter`): run current editor code.

## Argument shorthand

Function arguments support both explicit and shorthand forms:

- Explicit: `arg 1`, `arg 2`, ...
- Shorthand: `$1`, `$2`, ...

The shorthand is lowered early during parsing to keep interpretation stable in infix expressions:

- Surface: `$1`
- Internal word-code: `( arg 1 )`

In the browser editor, loading code back from runtime preserves surface shorthand by rendering
`( arg N )` as `$N` when possible.

## Design principles

- Keep it playful: this is a toy language, not a product.
- Prefer readability and learning value over feature count.
- Explore structural ideas even when they are still incomplete.

## Background

This repository followed an evolution path:

- LuaPang -> TypescriptPang -> TypescriptStructure

TypescriptStructure was aimed at representing intermediate programs as list-of-lists derived from polish-notation source code. The full program-tree graphical editor is still an open design problem rather than a finished feature.

## Contributing

This is a single-author project for now, but ideas, critiques, and experiments are welcome.

If you use it for learning, feel free to fork it and adapt it.

## Editor sync regression check

When changing editor CSS or token decorations, quickly verify overlay and caret alignment:

1. Load this snippet in the editor:
   `def factorial#1\nif ( arg 1 ) == 0 1 ( arg 1 ) * factorial ( arg 1 ) - 1\n\nprint factorial 5`
2. Place caret just after `(` in `factorial ( arg 1 ) - 1` and press `Backspace`.
3. Confirm both parentheses are removed.
4. Confirm visible text matches typed text at the caret position (no 1-char visual offset).
5. Confirm status remains `balanced` when delimiters are balanced.
