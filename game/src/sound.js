// sound.js — tiny synthesized sounds, no audio files: a soft chime when a
// difference is found, a dull thud for a miss, a little arpeggio on a win.
// Everything is generated with the Web Audio API, so the game stays offline.

let audio = null;
let muted = false;

function ensureAudio() {
  if (audio) return audio;
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audio = new Ctor();
  } catch {
    audio = null;
  }
  return audio;
}

function tone(freq, startAt, length, type, volume) {
  const ctx = ensureAudio();
  if (!ctx || muted) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + length);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + length + 0.05);
}

export const sound = {
  found() {
    tone(660, 0, 0.16, 'sine', 0.16);
    tone(990, 0.09, 0.22, 'sine', 0.14);
  },
  miss() {
    tone(140, 0, 0.18, 'triangle', 0.12);
  },
  hint() {
    tone(520, 0, 0.12, 'sine', 0.1);
  },
  levelDone() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.2, 'sine', 0.14));
  },
  win() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.26, 'sine', 0.14));
  },
  tick() {
    tone(880, 0, 0.06, 'sine', 0.05);
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  isMuted() {
    return muted;
  },
};
