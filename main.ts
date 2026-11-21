// main.ts — Twin Lanterns' hand-in program (Node 22, standard library only).
//
// It gathers the entry's deliverables into /output (or MAKEFUN_OUTPUT_DIR
// outside the grader): the static game under game/, the screenshots under
// screenshots/, and the dossier.json the judge reads, written with the
// kit's vendored buildDossier. The run is deterministic: the same
// repository always writes the same bytes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO_ROOT = fileURLToPath(new URL('.', import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's caps for this bounty: game/ at most 993 entries and 48 MiB,
// screenshots at most 4 files of 256 KiB, dossier text at most 160 KiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function fail(message) {
  throw new Error(`main.ts: ${message}`);
}

function countEntries(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    total += 1;
    if (statSync(path).isDirectory()) total += countEntries(path);
  }
  return total;
}

function checkGameTree(gameDir) {
  if (!existsSync(join(gameDir, 'index.html'))) fail('game/index.html is missing');
  if (countEntries(gameDir) > CAPS.game_max_files) fail('game/ holds too many files');
}

function checkShots(shotsDir) {
  if (!existsSync(shotsDir)) fail('screenshots/ is missing');
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) fail(`screenshots/ holds ${shots.length} images, need 3 or 4`);
  for (const name of shots) {
    if (statSync(join(shotsDir, name)).size > CAPS.screenshots.max_bytes) {
      fail(`screenshots/${name} is over 256 KiB`);
    }
  }
}

const gameDir = join(REPO_ROOT, 'game');
const shotsDir = join(REPO_ROOT, 'screenshots');
checkGameTree(gameDir);
checkShots(shotsDir);

mkdirSync(OUTPUT_DIR, { recursive: true });
cpSync(gameDir, join(OUTPUT_DIR, 'game'), { recursive: true });
mkdirSync(join(OUTPUT_DIR, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(OUTPUT_DIR, 'screenshots'), { recursive: true });

writeFileSync(join(OUTPUT_DIR, 'dossier.json'), buildDossier(OUTPUT_DIR, CAPS));
console.log(`Twin Lanterns handed in: ${OUTPUT_DIR}`);
