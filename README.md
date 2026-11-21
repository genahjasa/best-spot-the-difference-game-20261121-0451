# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/genahjasa/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/genahjasa/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Lanterns** — a spot-the-difference game drawn entirely in code. Two
near-identical pictures sit side by side; seven small lies hide in the right
one. Click a difference on either picture to mark it on both, beat the
two-minute clock, and clear all three hand-drawn scenes: a lantern night
market, a koi garden pond, and a harbour at dusk.

Every scene is original art built from SVG shapes in `game/src/scenes.js` —
no copied images, no copied game. The hunt stays fair but not obvious:
a missing lantern, a koi that turned white, a sun that sank a little lower.
Wrong clicks cost 5 seconds, finds earn 100 points plus a time bonus, hints
pulse a hidden spot, and each cleared scene pays a time bonus before the
next, harder scene opens.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser and play with mouse and
keyboard (`H` hint, `R` restart scene, `N` next scene, `Enter` start).

To hand the entry in (what `main.ts` does — it copies `game/` and
`screenshots/` to the output directory and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots live in `screenshots/` (cover first): the title screen, a
mid-hunt market scene with 3 of 7 found, a mid-hunt pond scene with 2 of 7
found, and a cleared scene. They were taken from the running game with
`?shot=start`, `?shot=play`, `?shot=play2` and `?shot=end` (see `shots.json`).

## Layout

- `game/index.html` — page shell, HUD, boards and overlays
- `game/styles.css` — night-market styling and marker animations
- `game/src/scenes.js` — the three scenes: SVG element lists + 7 differences each
- `game/src/draw.js` — paints scenes into SVG, stamps found/missed/hint markers
- `game/src/game.js` — rules: timer, score, hints, levels, found-list
- `game/src/sound.js` — synthesized WebAudio chimes (no audio files)
- `game/src/shots.js` — `?shot=` presets that stage real game states for screenshots
- `game/src/main.js` — boot
- `main.ts` — hand-in program (Node 22, standard library only)
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

---

<sub>Entered on [make.fun](https://make.fun/?ref=maqpwds7&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
