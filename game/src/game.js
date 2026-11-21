// game.js — the rules of Twin Lanterns: three scenes, seven differences
// each, a countdown, a score, hints, and the found-list that tells the
// player exactly what is left to hunt.
//
// State machine: 'title' -> 'playing' -> 'levelDone' -> 'playing' ...
// -> 'win' (all three scenes cleared) or 'gameOver' (the clock ran out).
// A click on either panel is checked against the same difference spots;
// a hit marks both panels, a miss costs five seconds.

import { SCENES } from './scenes.js';
import { paintScene, stampFound, stampMiss, stampHint, eventToViewBox } from './draw.js';
import { sound } from './sound.js';

export const LEVEL_TIME = 120;
export const POINTS_PER_FIND = 100;
export const MISS_TIME_COST = 5;
export const HINTS_PER_LEVEL = 3;

export class Game {
  constructor(root) {
    this.root = root;
    this.leftSvg = root.querySelector('#panel-left');
    this.rightSvg = root.querySelector('#panel-right');
    this.hud = {
      level: root.querySelector('#hud-level'),
      found: root.querySelector('#hud-found'),
      time: root.querySelector('#hud-time'),
      timeBar: root.querySelector('#time-bar-fill'),
      score: root.querySelector('#hud-score'),
      hints: root.querySelector('#hud-hints'),
      message: root.querySelector('#hud-message'),
    };
    this.overlays = {
      title: root.querySelector('#overlay-title'),
      levelDone: root.querySelector('#overlay-level'),
      gameOver: root.querySelector('#overlay-over'),
      win: root.querySelector('#overlay-win'),
    };
    this.foundList = root.querySelector('#found-list');
    this.level = 0;
    this.scene = null;
    this.found = new Set();
    this.score = 0;
    this.timeLeft = LEVEL_TIME;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.status = 'title';
    this.timer = null;
    this.leftMarkers = null;
    this.rightMarkers = null;
    this.wireControls(root);
  }

  wireControls(root) {
    const onPanelClick = (svg) => (event) => this.onPanelClick(svg, event);
    this.leftSvg.addEventListener('click', onPanelClick(this.leftSvg));
    this.rightSvg.addEventListener('click', onPanelClick(this.rightSvg));

    root.querySelector('#btn-start').addEventListener('click', () => this.startGame());
    root.querySelector('#btn-hint').addEventListener('click', () => this.useHint());
    root.querySelector('#btn-restart').addEventListener('click', () => this.startLevel(this.level));
    root.querySelector('#btn-next').addEventListener('click', () => this.nextLevel());
    root.querySelector('#btn-again').addEventListener('click', () => this.startGame());
    root.querySelector('#btn-retry').addEventListener('click', () => this.startLevel(this.level));
    root.querySelector('#btn-mute').addEventListener('click', (event) => {
      const muted = sound.toggleMute();
      event.currentTarget.textContent = muted ? 'Sound: off' : 'Sound: on';
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.status === 'title') this.startGame();
      else if (event.key === 'h' || event.key === 'H') this.useHint();
      else if (event.key === 'r' || event.key === 'R') this.startLevel(this.level);
      else if (event.key === 'n' || event.key === 'N') {
        if (this.status === 'levelDone') this.nextLevel();
      }
    });
  }

  showOverlay(name) {
    for (const [key, el] of Object.entries(this.overlays)) {
      el.classList.toggle('hidden', key !== name);
    }
  }

  loadScene(index) {
    this.level = index;
    this.scene = SCENES[index]();
    this.found = new Set();
    this.timeLeft = LEVEL_TIME;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.leftMarkers = paintScene(this.leftSvg, this.scene, 'left');
    this.rightMarkers = paintScene(this.rightSvg, this.scene, 'right');
    this.renderFoundList();
    this.updateHud();
  }

  startGame() {
    this.score = 0;
    this.status = 'playing';
    this.loadScene(0);
    this.showOverlay(null);
    this.startTimer();
    this.setMessage('Find all 7 differences — click on either picture!');
  }

  startLevel(index) {
    this.status = 'playing';
    this.loadScene(index);
    this.showOverlay(null);
    this.startTimer();
    this.setMessage(`Scene ${index + 1} of 3: ${this.scene.name}`);
  }

  nextLevel() {
    if (this.level + 1 >= SCENES.length) {
      this.finishGame();
      return;
    }
    this.startLevel(this.level + 1);
  }

  finishGame() {
    this.status = 'win';
    this.stopTimer();
    const bonus = this.timeLeft * 5;
    this.score += bonus;
    this.root.querySelector('#win-score').textContent = this.score;
    this.root.querySelector('#win-bonus').textContent = bonus;
    this.updateHud();
    sound.win();
    this.showOverlay('win');
  }

  startTimer() {
    this.stopTimer();
    this.timer = window.setInterval(() => {
      if (this.status !== 'playing') return;
      this.timeLeft -= 1;
      if (this.timeLeft <= 10 && this.timeLeft > 0) sound.tick();
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateHud();
        this.runOutOfTime();
        return;
      }
      this.updateHud();
    }, 1000);
  }

  stopTimer() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  runOutOfTime() {
    this.status = 'gameOver';
    this.stopTimer();
    sound.miss();
    this.root.querySelector('#over-score').textContent = this.score;
    this.root.querySelector('#over-found').textContent =
      `${this.found.size} of ${this.scene.differences.length}`;
    this.showOverlay('gameOver');
  }

  onPanelClick(svg, event) {
    if (this.status !== 'playing') return;
    const point = eventToViewBox(svg, event);
    const hit = this.scene.differences.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = point.x - d.x;
      const dy = point.y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (hit) this.registerFind(hit);
    else this.registerMiss(svg, point);
  }

  registerFind(difference) {
    this.found.add(difference.id);
    stampFound(this.leftMarkers, difference);
    stampFound(this.rightMarkers, difference);
    const timeBonus = Math.max(0, this.timeLeft);
    this.score += POINTS_PER_FIND + Math.floor(timeBonus / 10);
    sound.found();
    this.renderFoundList();
    this.updateHud();
    if (this.found.size === this.scene.differences.length) this.completeLevel();
    else this.setMessage(`Found it — ${difference.label}. ${this.remaining()} to go!`);
  }

  registerMiss(svg, point) {
    const markers = svg === this.leftSvg ? this.leftMarkers : this.rightMarkers;
    stampMiss(markers, point.x, point.y);
    this.timeLeft = Math.max(0, this.timeLeft - MISS_TIME_COST);
    this.score = Math.max(0, this.score - 10);
    sound.miss();
    this.updateHud();
    this.setMessage(`Nothing there — minus ${MISS_TIME_COST} seconds. Look closer!`);
    if (this.timeLeft <= 0) this.runOutOfTime();
  }

  completeLevel() {
    this.status = 'levelDone';
    this.stopTimer();
    const bonus = this.timeLeft * 2;
    this.score += bonus;
    this.root.querySelector('#level-name').textContent = this.scene.name;
    this.root.querySelector('#level-bonus').textContent = bonus;
    this.root.querySelector('#level-score').textContent = this.score;
    this.root.querySelector('#level-next-label').textContent =
      this.level + 1 >= SCENES.length ? 'See your final score' : `Next scene: ${SCENES[this.level + 1]().name}`;
    this.updateHud();
    sound.levelDone();
    this.showOverlay('levelDone');
  }

  useHint() {
    if (this.status !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.setMessage('No hints left — trust your eyes!');
      return;
    }
    const remaining = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    stampHint(this.leftMarkers, pick);
    stampHint(this.rightMarkers, pick);
    sound.hint();
    this.updateHud();
    this.setMessage(`Hint: something changed near “${pick.label}”…`);
  }

  remaining() {
    return this.scene.differences.length - this.found.size;
  }

  renderFoundList() {
    this.foundList.replaceChildren();
    for (const difference of this.scene.differences) {
      const item = document.createElement('li');
      const done = this.found.has(difference.id);
      item.className = done ? 'found' : 'pending';
      // Pending items keep their secret: only found ones name themselves.
      item.textContent = done ? `✓ ${difference.label}` : '· ??? — still hidden';
      this.foundList.appendChild(item);
    }
  }

  updateHud() {
    const total = this.scene ? this.scene.differences.length : 7;
    this.hud.level.textContent = this.scene
      ? `Scene ${this.level + 1}/3 · ${this.scene.name}`
      : 'Twin Lanterns';
    this.hud.found.textContent = `${this.found.size} / ${total} found`;
    this.hud.time.textContent = `${Math.floor(this.timeLeft / 60)}:${String(this.timeLeft % 60).padStart(2, '0')}`;
    this.hud.timeBar.style.width = `${(this.timeLeft / LEVEL_TIME) * 100}%`;
    this.hud.timeBar.classList.toggle('low', this.timeLeft <= 20);
    this.hud.score.textContent = `${this.score} pts`;
    this.hud.hints.textContent = `Hints: ${this.hintsLeft}`;
  }

  setMessage(text) {
    this.hud.message.textContent = text;
  }
}
