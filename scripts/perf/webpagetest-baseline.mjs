#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveRepoPath = (...segments) => path.resolve(__dirname, '..', '..', ...segments);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getTimestampedDir = (root) => {
  const now = new Date();
  const safe = now.toISOString().replace(/[:.]/g, '-');
  return path.resolve(root, safe);
};

const ensureDir = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const getEnv = (name, fallback) => {
  const value = process.env[name];
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  if (!value) {
    return fallback;
  }
  return value;
};

const fetchJson = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request to ${url} failed with ${response.status}: ${text}`);
  }
  return response.json();
};

const pollTestStatus = async (server, testId) => {
  const statusUrl = new URL('/testStatus.php', server);
  statusUrl.searchParams.set('test', testId);
  statusUrl.searchParams.set('f', 'json');

  while (true) {
    const status = await fetchJson(statusUrl);
    const code = Number(status.statusCode || status.status_code || 0);
    const text = status.statusText || status.status_text || '';
    if (code === 200) {
      return;
    }
    if (code >= 400) {
      throw new Error(`WebPageTest returned status ${code}: ${text || 'unknown error'}`);
    }
    console.log(`WebPageTest status [${code}]: ${text || 'processing'}...`);
    await sleep(5000);
  }
};

const runWebPageTest = async ({
  server,
  apiKey,
  targetUrl,
  label,
  location,
  connectivity,
  emulateMobile,
  runs,
}) => {
  const runUrl = new URL('/runtest.php', server);
  runUrl.searchParams.set('url', targetUrl);
  runUrl.searchParams.set('k', apiKey);
  runUrl.searchParams.set('f', 'json');
  runUrl.searchParams.set('location', location);
  runUrl.searchParams.set('label', label);
  runUrl.searchParams.set('runs', String(runs));
  runUrl.searchParams.set('video', '0');
  runUrl.searchParams.set('firstViewOnly', '1');
  runUrl.searchParams.set('connectivity', connectivity);
  if (emulateMobile) {
    runUrl.searchParams.set('mobile', '1');
  }

  console.log(`Triggering WebPageTest run (${label}) via ${runUrl.href}`);
  const initial = await fetchJson(runUrl);
  const statusCode = Number(initial.statusCode || initial.status_code || 0);
  if (statusCode !== 200) {
    const statusText = initial.statusText || initial.status_text || 'Unable to start test';
    throw new Error(`Failed to start WebPageTest (${label}): ${statusText}`);
  }

  const testId = initial.data?.testId || initial.data?.testId || initial.data?.testid;
  const jsonUrl = initial.data?.jsonUrl || initial.data?.jsonResult;
  if (!testId || !jsonUrl) {
    throw new Error(`WebPageTest response missing identifiers for ${label}`);
  }

  await pollTestStatus(server, testId);

  const result = await fetchJson(jsonUrl);
  const view = result.data?.median?.firstView;
  if (!view) {
    throw new Error(`WebPageTest result for ${label} missing median firstView payload`);
  }

  const metrics = {
    label,
    testId,
    summaryUrl: result.data?.summary || null,
    finalUrl: view.URL || null,
    loadTimeMs: view.loadTime ?? null,
    firstContentfulPaintMs: view.firstContentfulPaint || view['first_contentful_paint'] || null,
    largestContentfulPaintMs: view['largest_contentful_paint'] ?? null,
    timeToFirstByteMs: view.TTFB ?? null,
    speedIndex: view.SpeedIndex ?? null,
    cumulativeLayoutShift: view['cumulative_layout_shift'] ?? null,
  };

  return { raw: result, metrics };
};

const main = async () => {
  const server = getEnv('WPT_SERVER', 'https://www.webpagetest.org');
  const apiKey = getEnv('WPT_API_KEY', 'A');
  const targetUrl = getEnv('BASELINE_URL', process.env.VERCEL_URL);
  if (!targetUrl) {
    throw new Error('Set BASELINE_URL or VERCEL_URL to the URL you want to test');
  }

  const runs = Number(getEnv('WPT_RUNS', '1'));
  const connectivity = getEnv('WPT_CONNECTIVITY', 'Cable');
  const label = getEnv('WPT_BASELINE_LABEL', 'baseline');
  const desktopLocation = getEnv('WPT_LOCATION_DESKTOP', 'Dulles:Chrome');
  const mobileLocation = getEnv('WPT_LOCATION_MOBILE', 'Dulles_MotoG7');

  const reportsRoot = resolveRepoPath('reports', 'webpagetest');
  const reportDir = getTimestampedDir(reportsRoot);
  await ensureDir(reportDir);

  const summaries = [];

  const desktop = await runWebPageTest({
    server,
    apiKey,
    targetUrl,
    label: `${label}-desktop`,
    location: desktopLocation,
    connectivity,
    runs,
    emulateMobile: false,
  });
  await writeFile(path.join(reportDir, 'desktop.json'), JSON.stringify(desktop.raw, null, 2));
  summaries.push(desktop.metrics);
  console.log(`Desktop WebPageTest complete (testId=${desktop.metrics.testId}).`);

  const mobile = await runWebPageTest({
    server,
    apiKey,
    targetUrl,
    label: `${label}-mobile`,
    location: mobileLocation,
    connectivity,
    runs,
    emulateMobile: true,
  });
  await writeFile(path.join(reportDir, 'mobile.json'), JSON.stringify(mobile.raw, null, 2));
  summaries.push(mobile.metrics);
  console.log(`Mobile WebPageTest complete (testId=${mobile.metrics.testId}).`);

  await writeFile(path.join(reportDir, 'summary.json'), JSON.stringify({ targetUrl, summaries }, null, 2));
  console.log(`WebPageTest reports saved to ${path.relative(process.cwd(), reportDir)}`);
};

main().catch((error) => {
  console.error('WebPageTest baseline run failed:', error);
  process.exitCode = 1;
});