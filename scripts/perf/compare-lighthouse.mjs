#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (key && value) {
    args.set(key.replace(/^--/, ''), value);
  }
}

const baseDir = args.get('base');
const prDir = args.get('pr');
const summaryPath = args.get('summary') || 'reports/lighthouse/summary.json';
const commentPath = args.get('comment') || 'reports/lighthouse/comment.md';

if (!baseDir || !prDir) {
  console.error('compare-lighthouse: --base and --pr directories are required.');
  process.exit(1);
}

function loadReports(directory) {
  const dirPath = resolve(directory);
  const files = readdirSync(dirPath).filter((file) => file.startsWith('lhr-') && file.endsWith('.json'));
  return files.map((file) => JSON.parse(readFileSync(join(dirPath, file), 'utf8')));
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function summarizeReports(reports) {
  return {
    fcp: median(reports.map((report) => report.audits['first-contentful-paint'].numericValue || 0)),
    lcp: median(reports.map((report) => report.audits['largest-contentful-paint'].numericValue || 0)),
    cls: median(reports.map((report) => report.audits['cumulative-layout-shift'].numericValue || 0)),
    tbt: median(reports.map((report) => report.audits['total-blocking-time'].numericValue || 0)),
  };
}

function formatDuration(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return `${Math.round(value)}ms`;
}

function formatMetric(metric, value) {
  if (metric === 'cls') {
    return value.toFixed(3);
  }
  return formatDuration(value);
}

const baseReports = loadReports(baseDir);
const prReports = loadReports(prDir);

if (!baseReports.length || !prReports.length) {
  console.error('compare-lighthouse: unable to find Lighthouse JSON results for base or PR.');
  process.exit(1);
}

const baseSummary = summarizeReports(baseReports);
const prSummary = summarizeReports(prReports);

const metrics = [
  { key: 'fcp', label: 'First Contentful Paint' },
  { key: 'lcp', label: 'Largest Contentful Paint' },
  { key: 'cls', label: 'Cumulative Layout Shift' },
  { key: 'tbt', label: 'Total Blocking Time' },
];

const summary = { base: baseSummary, pr: prSummary, metrics: {} };
const rows = [];
const regressions = [];

metrics.forEach(({ key, label }) => {
  const baseValue = baseSummary[key];
  const prValue = prSummary[key];
  const baseForRatio = Math.max(baseValue, key === 'cls' ? 0.001 : 1);
  const diff = prValue - baseValue;
  const ratio = diff / baseForRatio;
  const percent = ratio * 100;
  const isRegression = diff > 0 && ratio > 0.1;
  if (isRegression) {
    regressions.push({ key, label, percent });
  }
  summary.metrics[key] = {
    base: baseValue,
    pr: prValue,
    diff,
    percent,
    regression: isRegression,
  };
  const statusEmoji = isRegression ? '❌' : '✅';
  const formattedDiff = key === 'cls' ? diff.toFixed(3) : formatDuration(Math.abs(diff));
  const diffLabel = diff === 0 ? '0%' : `${percent > 0 ? '+' : ''}${percent.toFixed(1)}% (${diff >= 0 ? '+' : '-'}${formattedDiff})`;
  rows.push(`| ${label} | ${formatMetric(key, baseValue)} | ${formatMetric(key, prValue)} | ${diffLabel} | ${statusEmoji} |`);
});

writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

const commentLines = [
  '# Lighthouse performance summary',
  '',
  '| Metric | Base | PR | Δ | Status |',
  '| --- | --- | --- | --- | --- |',
  ...rows,
];

if (regressions.length) {
  commentLines.push('', '> ⚠️ Performance regressions detected greater than 10%.');
}

writeFileSync(commentPath, commentLines.join('\n'));

if (regressions.length) {
  console.error(
    'compare-lighthouse: performance regression detected for metrics:',
    regressions.map((item) => item.label).join(', '),
  );
  process.exit(1);
}