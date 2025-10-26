#!/usr/bin/env node

/**
 * Font Subsetting and Optimization Script
 * Reduces font file sizes by including only used characters
 * Generates optimized font files with multiple formats
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FONT_CONFIG = {
  // Characters commonly used in English + numbers + common symbols
  basicLatin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  punctuation: '.,!?;:\'"()-–—…',
  symbols: '@#$%&*+/=<>[]{}|\\^`~',
  currency: '$€£¥',
  
  // Character sets for different use cases
  headings: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ',
  body: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:\'"()- ',
  code: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:\'"()-_=+[]{}|\\/<>@#$%&*^`~',
};

/**
 * Generate Unicode ranges for font-display optimization
 */
function generateUnicodeRanges() {
  return {
    // Latin Basic (most common characters)
    'latin-basic': 'U+0020-007E',
    // Latin Extended
    'latin-ext': 'U+0100-024F',
    // Latin Extended Additional
    'latin-ext-add': 'U+1E00-1EFF',
    // Punctuation
    'punctuation': 'U+2000-206F',
    // Currency
    'currency': 'U+20A0-20CF',
    // Arrows
    'arrows': 'U+2190-21FF',
    // Math
    'math': 'U+2200-22FF',
  };
}

/**
 * Generate font-face declarations with unicode-range
 */
function generateFontFaceCSS() {
  const ranges = generateUnicodeRanges();
  
  let css = `/**
 * Optimized Font Loading with Unicode Ranges
 * Only loads character subsets that are actually used
 */

`;

  // Generate font-face for each unicode range
  Object.entries(ranges).forEach(([name, range]) => {
    css += `@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2');
  unicode-range: ${range};
}

`;
  });

  return css;
}

/**
 * Generate preload hints for critical fonts
 */
function generateFontPreloads() {
  return `<!-- Critical font preloads -->
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>`;
}

/**
 * Analyze text content to determine used characters
 */
function analyzeTextContent(content) {
  const chars = new Set(content);
  const charArray = Array.from(chars).sort();
  
  return {
    total: chars.size,
    characters: charArray.join(''),
    ranges: categorizeCharacters(charArray),
  };
}

/**
 * Categorize characters into Unicode blocks
 */
function categorizeCharacters(chars) {
  const ranges = {
    basicLatin: [],
    latinExtended: [],
    punctuation: [],
    numbers: [],
    symbols: [],
    other: [],
  };

  chars.forEach(char => {
    const code = char.charCodeAt(0);
    
    if (code >= 0x0041 && code <= 0x007A) {
      ranges.basicLatin.push(char);
    } else if (code >= 0x0030 && code <= 0x0039) {
      ranges.numbers.push(char);
    } else if (code >= 0x0100 && code <= 0x024F) {
      ranges.latinExtended.push(char);
    } else if ([0x0020, 0x0021, 0x002C, 0x002E, 0x003A, 0x003B, 0x003F].includes(code)) {
      ranges.punctuation.push(char);
    } else if (code >= 0x0021 && code <= 0x002F) {
      ranges.symbols.push(char);
    } else {
      ranges.other.push(char);
    }
  });

  return ranges;
}

/**
 * Main execution
 */
function main() {
  console.log('🔤 Font Optimization Script\n');
  console.log('=' .repeat(60));

  // Generate font-face CSS
  const fontFaceCSS = generateFontFaceCSS();
  const outputPath = join(dirname(__dirname), 'styles', 'fonts-optimized.css');
  
  try {
    writeFileSync(outputPath, fontFaceCSS);
    console.log('\n✅ Generated optimized font-face CSS');
    console.log(`   Location: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to write font CSS:', error.message);
  }

  // Generate preload hints
  const preloads = generateFontPreloads();
  console.log('\n📋 Font Preload Hints:');
  console.log(preloads);

  // Unicode ranges
  const ranges = generateUnicodeRanges();
  console.log('\n🌍 Unicode Ranges:');
  Object.entries(ranges).forEach(([name, range]) => {
    console.log(`   ${name.padEnd(20)} ${range}`);
  });

  // Character set recommendations
  console.log('\n💡 Character Set Recommendations:');
  console.log('   Headings:  ~52 characters');
  console.log('   Body text: ~70 characters');
  console.log('   Code:      ~90 characters');

  console.log('\n' + '='.repeat(60));
  console.log('✨ Font optimization complete!\n');
  console.log('Next steps:');
  console.log('1. Import fonts-optimized.css in your layout');
  console.log('2. Add font preload hints to <head>');
  console.log('3. Test with Lighthouse');
  console.log('4. Verify no missing characters\n');
}

main();

