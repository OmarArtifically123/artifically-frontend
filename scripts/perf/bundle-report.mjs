#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, loadConfigFromFile, mergeConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

function getTimestampedDir(root) {
  const now = new Date();
  const safe = now.toISOString().replace(/[:.]/g, '-');
  return path.resolve(root, safe);
}

async function run() {
  const reportsRoot = path.resolve(__dirname, '..', '..', 'reports', 'bundle');
  const reportDir = getTimestampedDir(reportsRoot);
  await ensureDir(reportDir);

  const configFile = path.resolve(process.cwd(), 'vite.config.js');
  const { config: existingConfig } = await loadConfigFromFile({ command: 'build', mode: process.env.NODE_ENV || 'production' }, configFile);

  const configWithVisualizer = mergeConfig(existingConfig ?? {}, {
    plugins: [
      visualizer({
        filename: path.join(reportDir, 'stats.html'),
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      // Ensure we analyze the production bundle exactly as built for deploys.
      reportCompressedSize: true,
    },
  });

  await build(configWithVisualizer);

  console.log(`Bundle visualizer report written to ${path.relative(process.cwd(), path.join(reportDir, 'stats.html'))}`);
}

run().catch((error) => {
  console.error('Failed to generate bundle report:', error);
  process.exitCode = 1;
});