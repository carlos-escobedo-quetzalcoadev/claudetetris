# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Classic Tetris implemented in vanilla JavaScript, HTML5 Canvas, and CSS. No dependencies, no build step, no package.json.

## Running

Open `index.html` directly, or serve statically:

```bash
python3 -m http.server 8000
# or
npx serve .
```

No test suite, linter, or build/watch command exists in this repo.

## Architecture

Three files, no modules:

- `index.html` — DOM shell: `<canvas id="board">` (300×600, the play field) and `<canvas id="next-canvas">` (120×120, next-piece preview), plus HUD elements (`score`, `lines`, `level`) and the pause/game-over `#overlay`.
- `style.css` — dark/retro arcade visuals.
- `game.js` — all logic, single global scope, no classes.

### Core model

- `board`: `ROWS × COLS` matrix, each cell is `0` (empty) or a piece-color index `1–7`.
- `PIECES`: the 7 tetrominoes as square matrices; `COLORS` maps color index → hex.
- `current` / `next`: `{ type, shape, x, y }` piece state, advanced by `spawn()`.
- Rotation is matrix transpose+reverse (`rotateCW`), not lookup tables.

### Key functions (game.js)

- `collide(shape, ox, oy)` — bounds/overlap check against `board`; used before every move, rotate, and drop.
- `tryRotate()` — rotates then attempts wall kicks at offsets `[0, -1, 1, -2, 2]` columns.
- `lockPiece()` → `merge()` writes the piece into `board`, `clearLines()` removes full rows top-down with `board.splice`/`unshift`, then `spawn()` pulls in the next piece.
- `clearLines()` also owns scoring/leveling: `LINE_SCORES = [0,100,300,500,800]` × `level`; `level = floor(lines/10)+1`; `dropInterval = max(100, 1000 - (level-1)*90)` ms.
- `ghostY()` — projects `current` straight down for the ghost-piece preview (drawn at `globalAlpha = 0.2`).
- `loop(ts)` — the single `requestAnimationFrame` game loop; accumulates `dt` into `dropAccum` and drops the piece one row (or locks it) once `dropAccum >= dropInterval`.
- `init()` — resets all game state and (re)starts `loop`; wired to the restart button.

Input is one `keydown` listener switching on `e.code` (arrows, `Space` for hard drop, `KeyX` for rotate, `KeyP` for pause).

### Tunable constants (top of game.js)

`COLS`, `ROWS`, `BLOCK` (cell px), `COLORS`, `LINE_SCORES`, initial `dropInterval`. If `COLS`/`ROWS`/`BLOCK` change, update `<canvas id="board">` width/height in `index.html` to match (`COLS×BLOCK` by `ROWS×BLOCK`).
