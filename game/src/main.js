// main.js — boot the game: create it, paint the first scene behind the
// title screen, then hand over to a screenshot preset when ?shot= is set.

import { Game } from './game.js';
import { applyShot } from './shots.js';

const game = new Game(document);
game.loadScene(0);
game.showOverlay('title');
applyShot(game);
