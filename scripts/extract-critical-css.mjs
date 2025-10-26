#!/usr/bin/env node

/**
 * Critical CSS Extraction Script
 * Extracts and inlines critical CSS for above-the-fold content
 * Significantly improves First Contentful Paint (FCP)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Critical CSS for immediate rendering
 * This should be inlined in <head> for fastest FCP
 */
const CRITICAL_CSS = `
/* === CRITICAL CSS: Above-the-fold styles === */

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Hero Section - Critical for LCP */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: #cbd5e1;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* CTA Buttons - Above the fold */
.cta-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.cta-button {
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-button-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.cta-button-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

/* Header - Above the fold */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

/* Navigation - Minimal critical styles */
.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  align-items: center;
}

.nav-link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

/* Loading States - Prevent CLS */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Utility Classes */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 1rem;
  }
  
  .cta-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .nav-menu {
    gap: 1rem;
  }
}

/* === END CRITICAL CSS === */
`;

/**
 * Generate critical CSS file
 */
function generateCriticalCSS() {
  const outputPath = join(dirname(__dirname), 'styles', 'critical.css');
  
  try {
    writeFileSync(outputPath, CRITICAL_CSS.trim());
    console.log('✅ Generated critical.css');
    console.log(`   Location: ${outputPath}`);
    console.log(`   Size: ${(CRITICAL_CSS.length / 1024).toFixed(2)}KB`);
    return true;
  } catch (error) {
    console.error('❌ Failed to write critical CSS:', error.message);
    return false;
  }
}

/**
 * Generate inline critical CSS for direct <head> injection
 */
function generateInlineCriticalCSS() {
  // Minify CSS for inlining
  const minified = CRITICAL_CSS
    .replace(/\s+/g, ' ')
    .replace(/\/\*.*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();

  const outputPath = join(dirname(__dirname), 'lib', 'styles', 'critical-inline.ts');
  
  const content = `/**
 * Critical CSS for inline injection
 * Auto-generated by extract-critical-css.mjs
 * DO NOT EDIT MANUALLY
 */

export const criticalCSS = \`${minified}\`;

export function getCriticalCSS(): string {
  return criticalCSS;
}
`;

  try {
    writeFileSync(outputPath, content);
    console.log('✅ Generated critical-inline.ts');
    console.log(`   Location: ${outputPath}`);
    console.log(`   Minified size: ${(minified.length / 1024).toFixed(2)}KB`);
    return true;
  } catch (error) {
    console.error('❌ Failed to write inline critical CSS:', error.message);
    return false;
  }
}

/**
 * Calculate CSS metrics
 */
function analyzeCriticalCSS() {
  const lines = CRITICAL_CSS.split('\n').length;
  const selectors = (CRITICAL_CSS.match(/[^{}]+(?=\{)/g) || []).length;
  const properties = (CRITICAL_CSS.match(/[^:;]+:[^:;]+;/g) || []).length;
  
  return {
    lines,
    selectors,
    properties,
    size: CRITICAL_CSS.length,
    sizeKB: (CRITICAL_CSS.length / 1024).toFixed(2),
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Critical CSS Extraction\n');
  console.log('=' .repeat(60));

  // Generate files
  const cssGenerated = generateCriticalCSS();
  const inlineGenerated = generateInlineCriticalCSS();

  if (!cssGenerated || !inlineGenerated) {
    console.error('\n❌ Failed to generate critical CSS files');
    process.exit(1);
  }

  // Analyze
  const metrics = analyzeCriticalCSS();
  console.log('\n📊 CSS Metrics:');
  console.log(`   Lines:      ${metrics.lines}`);
  console.log(`   Selectors:  ${metrics.selectors}`);
  console.log(`   Properties: ${metrics.properties}`);
  console.log(`   Size:       ${metrics.sizeKB}KB`);

  console.log('\n💡 Usage Instructions:');
  console.log('   1. Import getCriticalCSS() in your layout');
  console.log('   2. Inject in <style> tag within <head>');
  console.log('   3. Mark with data-critical="true"');
  console.log('   4. Load full CSS asynchronously');

  console.log('\n📝 Example:');
  console.log(`
  import { getCriticalCSS } from '@/lib/styles/critical-inline';
  
  const criticalCSS = getCriticalCSS();
  
  <head>
    <style 
      data-critical="true" 
      dangerouslySetInnerHTML={{ __html: criticalCSS }}
    />
  </head>
  `);

  console.log('\n' + '='.repeat(60));
  console.log('✨ Critical CSS extraction complete!\n');
}

main();

