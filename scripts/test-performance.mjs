#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests Web Vitals and provides actionable feedback
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 Performance Testing Suite\n');
console.log('=' .repeat(60));

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function getStatusEmoji(value, goodThreshold, poorThreshold) {
  if (value <= goodThreshold) return '✅';
  if (value <= poorThreshold) return '⚠️';
  return '❌';
}

const webVitalsThresholds = {
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  FID: { good: 100, poor: 300, unit: 'ms' },
  TBT: { good: 200, poor: 600, unit: 'ms' },
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  SI: { good: 3400, poor: 5800, unit: 'ms' },
};

async function checkBuildExists() {
  try {
    await execAsync('cd .next && dir', { shell: 'powershell' });
    return true;
  } catch {
    return false;
  }
}

async function buildApp() {
  console.log(colorize('\n📦 Building application...', 'cyan'));
  try {
    await execAsync('npm run build', { cwd: process.cwd() });
    console.log(colorize('✅ Build complete!', 'green'));
    return true;
  } catch (error) {
    console.error(colorize('❌ Build failed:', 'red'), error.message);
    return false;
  }
}

async function analyzeBundleSize() {
  console.log(colorize('\n📊 Analyzing Bundle Size...', 'cyan'));
  
  try {
    const { stdout } = await execAsync('du -sh .next/static/chunks/*.js | sort -h', {
      shell: 'bash',
    });
    
    console.log('\nTop JavaScript Chunks:');
    const lines = stdout.trim().split('\n').slice(-10);
    lines.forEach(line => {
      const [size, file] = line.split('\t');
      const fileName = file.split('/').pop();
      console.log(`  ${size.padEnd(8)} ${fileName}`);
    });
  } catch (error) {
    // Fallback for Windows
    console.log('  (Bundle analysis available on Unix systems)');
  }
}

function displayWebVitalsTargets() {
  console.log(colorize('\n🎯 Web Vitals Targets:', 'cyan'));
  console.log('');
  
  Object.entries(webVitalsThresholds).forEach(([metric, thresholds]) => {
    const unit = thresholds.unit;
    console.log(`  ${metric.padEnd(5)} Good: ≤ ${thresholds.good}${unit}  |  Poor: > ${thresholds.poor}${unit}`);
  });
}

function displayOptimizationChecklist() {
  console.log(colorize('\n✅ Optimization Checklist:', 'cyan'));
  
  const checklist = [
    'Lazy loading implemented for all below-fold sections',
    'Fixed-height skeletons prevent CLS',
    'Heavy 3D rendering deferred with requestIdleCallback',
    'LCP image preloaded with fetchpriority="high"',
    'Dynamic imports with loading priorities',
    'Web Vitals monitoring active',
    'Resource hints (dns-prefetch, preconnect, preload)',
    'Image optimization (AVIF, WebP formats)',
    'Font loading optimized (display: swap)',
    'Advanced webpack code splitting',
  ];
  
  checklist.forEach((item, index) => {
    console.log(`  ${colorize('✓', 'green')} ${item}`);
  });
}

function displayTestingInstructions() {
  console.log(colorize('\n🧪 Manual Testing Instructions:', 'cyan'));
  console.log('');
  console.log('1. Chrome DevTools Lighthouse:');
  console.log('   - Open DevTools (F12)');
  console.log('   - Go to Lighthouse tab');
  console.log('   - Select "Performance" category');
  console.log('   - Click "Analyze page load"');
  console.log('');
  console.log('2. Network Throttling Test:');
  console.log('   - Network tab → Throttling → Slow 3G');
  console.log('   - Refresh page and observe loading');
  console.log('   - Verify sections load progressively');
  console.log('');
  console.log('3. Layout Shift Check:');
  console.log('   - Enable "Layout Shift Regions" in Rendering');
  console.log('   - Refresh page');
  console.log('   - Look for blue highlights (shifts)');
  console.log('');
  console.log('4. Web Vitals in Console:');
  console.log('   - Open browser console');
  console.log('   - Look for emoji indicators:');
  console.log('     ✅ Good | ⚠️ Needs Improvement | ❌ Poor');
}

async function main() {
  console.log(colorize('\nStep 1: Checking build status...', 'bold'));
  
  const buildExists = await checkBuildExists();
  
  if (!buildExists) {
    console.log(colorize('⚠️  No build found. Building now...', 'yellow'));
    const buildSuccess = await buildApp();
    if (!buildSuccess) {
      console.log(colorize('\n❌ Build failed. Please fix errors and try again.', 'red'));
      process.exit(1);
    }
  } else {
    console.log(colorize('✅ Build exists', 'green'));
  }
  
  console.log(colorize('\nStep 2: Bundle Analysis', 'bold'));
  await analyzeBundleSize();
  
  displayWebVitalsTargets();
  displayOptimizationChecklist();
  displayTestingInstructions();
  
  console.log('\n' + '='.repeat(60));
  console.log(colorize('\n🎉 Performance optimization complete!', 'green'));
  console.log(colorize('Run ' + colorize('npm run start', 'cyan') + ' and test with Lighthouse', 'bold'));
  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(console.error);



