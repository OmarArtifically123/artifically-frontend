#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveRepoPath = (...segments) => path.resolve(__dirname, '..', '..', ...segments);

const ensureDir = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const getLatestSummary = async (rootDir, fileName) => {
  try {
    const entries = await readdir(rootDir, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    if (!directories.length) {
      return null;
    }
    directories.sort();
    const latest = directories[directories.length - 1];
    const summaryPath = path.join(rootDir, latest, fileName);
    const contents = await readFile(summaryPath, 'utf-8');
    return { summary: JSON.parse(contents), directory: latest };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const buildDashboard = async () => {
  const lighthouseRoot = resolveRepoPath('reports', 'frontend');
  const wptRoot = resolveRepoPath('reports', 'webpagetest');
  const outputDir = resolveRepoPath('data', 'performance');
  await ensureDir(outputDir);

  const lighthouseData = await getLatestSummary(lighthouseRoot, 'summary.json');
  if (!lighthouseData) {
    throw new Error('No Lighthouse summary found. Run npm run report:lighthouse first.');
  }

  const lighthouseSummary = Array.isArray(lighthouseData.summary) ? lighthouseData.summary : [];
  const lighthouse = lighthouseSummary.reduce((acc, item) => {
    if (!item?.preset) {
      return acc;
    }
    const entry = {
      requestedUrl: item.requestedUrl || null,
      finalUrl: item.finalUrl || null,
      performanceScore: item.performanceScore ?? null,
      largestContentfulPaintMs: item.lcpMs ?? null,
      firstContentfulPaintMs: item.fcpMs ?? null,
      cumulativeLayoutShift: item.cls ?? null,
      timeToInteractiveMs: item.ttiMs ?? null,
      source: lighthouseData.directory,
    };
    acc[item.preset] = entry;
    return acc;
  }, {});

  const wptData = await getLatestSummary(wptRoot, 'summary.json');
  const webpagetest = wptData
    ? {
        targetUrl: wptData.summary.targetUrl || null,
        source: wptData.directory,
        runs: Array.isArray(wptData.summary.summaries) ? wptData.summary.summaries : [],
      }
    : null;

  const dashboard = {
    generatedAt: new Date().toISOString(),
    targets: {
      largestContentfulPaintMs: 3000,
      cumulativeLayoutShift: 0.1,
      accessibilityScore: 95,
    },
    lighthouse,
    webpagetest,
  };

  const outputPath = path.join(outputDir, 'dashboard.json');
  await writeFile(outputPath, JSON.stringify(dashboard, null, 2));
  console.log(`Dashboard written to ${path.relative(process.cwd(), outputPath)}`);
};

buildDashboard().catch((error) => {
  console.error('Failed to build performance dashboard:', error);
  process.exitCode = 1;
});