#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value.startsWith('http') ? value : `https://${value}`;
}

function getTimestampedDir(root) {
  const now = new Date();
  const safe = now.toISOString().replace(/[:.]/g, '-');
  return path.resolve(root, safe);
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function runLighthouse(url, preset, port) {
  const runnerResult = await lighthouse(url, {
    port,
    output: ['json', 'html'],
    logLevel: 'info',
    preset,
  });

  const [jsonReport, htmlReport] = Array.isArray(runnerResult.report) ? runnerResult.report : [runnerResult.report];

  const metrics = {
    preset,
    requestedUrl: runnerResult.lhr.requestedUrl,
    finalUrl: runnerResult.lhr.finalUrl,
    performanceScore: runnerResult.lhr.categories.performance?.score ?? null,
    fcpMs: runnerResult.lhr.audits['first-contentful-paint']?.numericValue ?? null,
    lcpMs: runnerResult.lhr.audits['largest-contentful-paint']?.numericValue ?? null,
    cls: runnerResult.lhr.audits['cumulative-layout-shift']?.numericValue ?? null,
    ttiMs: runnerResult.lhr.audits['interactive']?.numericValue ?? null,
  };

  return { jsonReport, htmlReport, metrics };
}

async function run() {
  const vercelUrl = getRequiredEnv('VERCEL_URL');
  const reportsRoot = path.resolve(__dirname, '..', '..', 'reports', 'frontend');
  const reportDir = getTimestampedDir(reportsRoot);
  await ensureDir(reportDir);

  console.log(`Running Lighthouse against ${vercelUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const endpoint = new URL(browser.wsEndpoint());
    const port = Number(endpoint.port);
    const presets = ['mobile', 'desktop'];
    const summary = [];

    for (const preset of presets) {
      console.log(`\nCollecting ${preset} report...`);
      const { jsonReport, htmlReport, metrics } = await runLighthouse(vercelUrl, preset, port);
      const baseName = `${preset}-lighthouse`;
      await writeFile(path.join(reportDir, `${baseName}.json`), typeof jsonReport === 'string' ? jsonReport : JSON.stringify(jsonReport, null, 2));
      await writeFile(path.join(reportDir, `${baseName}.html`), htmlReport, 'utf-8');
      summary.push(metrics);
      console.log(`${preset} results:`, metrics);
    }

    await writeFile(path.join(reportDir, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log(`\nLighthouse reports saved to ${path.relative(process.cwd(), reportDir)}`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('Failed to run Lighthouse:', error);
  process.exitCode = 1;
});