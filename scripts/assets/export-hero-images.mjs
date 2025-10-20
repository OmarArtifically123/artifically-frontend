import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(dirname(__dirname));

const source = join(projectRoot, 'design/hero/hero-source.svg');
const outputDir = join(projectRoot, 'public/images');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const targets = [
  { width: 1920, filename: 'hero-desktop.jpg' },
  { width: 1200, filename: 'hero-tablet.jpg' },
  { width: 800, filename: 'hero-mobile.jpg' }
];

const require = createRequire(import.meta.url);

let sharpCliEntry;

try {
  const sharpCliPackage = require('sharp-cli/package.json');
  const binField = sharpCliPackage?.bin;
  const relativeCliPath =
    typeof binField === 'string'
      ? binField
      : typeof binField === 'object' && binField !== null
        ? binField.sharp
        : null;

  if (!relativeCliPath) {
    throw new Error('sharp-cli bin entry not found');
  }

  sharpCliEntry = require.resolve(`sharp-cli/${relativeCliPath}`);
} catch (error) {
  console.error(
    'Unable to locate sharp-cli. Ensure dependencies are installed with `npm install` before running this script.'
  );
  throw error;
}

function runSharpTask({ width, filename }) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        sharpCliEntry,
        '--input',
        source,
        '--output',
        join(outputDir, filename),
        'resize',
        String(width),
        '--withoutEnlargement',
        '--format',
        'jpeg',
        '--quality',
        '82',
        '--progressive'
      ],
      {
        cwd: projectRoot,
        stdio: 'inherit'
      }
    );

    child.on('error', (error) => {
      reject(error);
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`sharp exited with code ${code}`));
      }
    });
  });
}

(async () => {
  for (const target of targets) {
    await runSharpTask(target);
  }
  console.log('Hero images exported to', outputDir);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});