// shots.js — staged states for screenshots, driven by the page's query
// string (the same pattern the kit's starter uses). The game itself is
// untouched: these presets only set up a real, playable state and then let
// the normal rendering draw it, so every screenshot is a genuine render of
// the game's own code in a browser.
//
//   ?shot=start   title screen over scene 1
//   ?shot=play    mid-game, scene 1, three differences already found
//   ?shot=play2   mid-game, scene 2, two differences already found
//   ?shot=end     scene 1 cleared, level-complete screen up
//
// ?level=N (1-3) picks which scene the play shots use. ?time=S sets the
// clock for the play shots. All values are clamped to sane ranges.

import { stampFound } from './draw.js';

function readParams() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot') || '';
  const level = Math.min(2, Math.max(0, (Number(params.get('level')) || 1) - 1));
  const time = Math.min(120, Math.max(5, Number(params.get('time')) || 87));
  return { shot, level, time };
}

// Mark the first `count` differences of the current scene as found,
// stamping their markers on both panels exactly as a real click would.
function stageFinds(game, count) {
  for (const difference of game.scene.differences.slice(0, count)) {
    game.found.add(difference.id);
    stampFound(game.leftMarkers, difference);
    stampFound(game.rightMarkers, difference);
  }
  game.renderFoundList();
}

// Apply a shot preset after the game has booted. Returns true when a
// preset was applied.
export function applyShot(game) {
  const { shot, level, time } = readParams();
  if (!shot) return false;

  if (shot === 'start') {
    game.loadScene(0);
    game.status = 'title';
    game.showOverlay('title');
    return true;
  }

  if (shot === 'play' || shot === 'play2') {
    const sceneIndex = shot === 'play2' ? Math.min(2, level + 1) : level;
    game.status = 'playing';
    game.loadScene(sceneIndex);
    game.timeLeft = shot === 'play2' ? 64 : time;
    game.score = shot === 'play2' ? 620 : 350;
    stageFinds(game, shot === 'play2' ? 2 : 3);
    game.showOverlay(null);
    game.setMessage(
      shot === 'play2'
        ? 'Scene 2 of 3: Koi Garden Pond — 2 found, 5 still hidden!'
        : 'Scene 1 of 3: Lantern Night Market — 3 found, 4 still hidden!',
    );
    game.updateHud();
    return true;
  }

  if (shot === 'end') {
    game.status = 'playing';
    game.loadScene(0);
    game.timeLeft = 42;
    game.score = 760;
    stageFinds(game, game.scene.differences.length);
    game.completeLevel();
    return true;
  }

  return false;
}
