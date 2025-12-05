#!/usr/bin/env node

/**
 * Build script to bundle the worker file and all required liblouis files.
 * Copies worker.js and liblouis runtime/tables to the dist directory.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../src/worker.js');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'worker.min.js');
const LIB_OUTPUT_DIR = path.join(OUTPUT_DIR, 'lib');

console.log('Building worker bundle...');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(LIB_OUTPUT_DIR)) {
  fs.mkdirSync(LIB_OUTPUT_DIR, { recursive: true });
}

// Copy worker file
console.log('Copying worker file...');
fs.copyFileSync(SOURCE_FILE, OUTPUT_FILE);
const workerStats = fs.statSync(OUTPUT_FILE);
console.log(`✓ Worker file copied: ${OUTPUT_FILE} (${(workerStats.size / 1024).toFixed(2)} KB)`);

// Copy liblouis build files
const liblouisBuildFiles = [
  'build-no-tables-utf32.js',
  'build-no-tables-utf16.js'
];

console.log('Copying liblouis build files...');
liblouisBuildFiles.forEach(file => {
  const sourcePath = path.join(__dirname, '../node_modules/liblouis-build', file);
  const destPath = path.join(LIB_OUTPUT_DIR, file);
  fs.copyFileSync(sourcePath, destPath);
  const stats = fs.statSync(destPath);
  console.log(`✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
});

// Copy liblouis easy-api.js
console.log('Copying liblouis API...');
const easyApiSource = path.join(__dirname, '../node_modules/liblouis/easy-api.js');
const easyApiDest = path.join(LIB_OUTPUT_DIR, 'easy-api.js');
fs.copyFileSync(easyApiSource, easyApiDest);
const easyApiStats = fs.statSync(easyApiDest);
console.log(`✓ easy-api.js (${(easyApiStats.size / 1024).toFixed(2)} KB)`);

// Copy only the required liblouis table files for en-ueb-g2
// This includes en-ueb-g2.ctb and all its dependencies
console.log('Copying required liblouis table files...');
const tablesSourceDir = path.join(__dirname, '../node_modules/liblouis-build/tables');
const tablesDestDir = path.join(LIB_OUTPUT_DIR, 'tables');

if (!fs.existsSync(tablesDestDir)) {
  fs.mkdirSync(tablesDestDir, { recursive: true });
}

// List of required table files (en-ueb-g2.ctb and all dependencies)
const requiredTableFiles = [
  'en-ueb-g2.ctb',           // Main table
  'en-ueb-g1.ctb',           // Included by en-ueb-g2
  'en-ueb-chardefs.uti',     // Included by en-ueb-g1
  'en-ueb-math.ctb',         // Included by en-ueb-g1
  'braille-patterns.cti',    // Included by en-ueb-g1
  'latinLetterDef8Dots.uti'  // Included by en-ueb-chardefs
];

let totalSize = 0;
requiredTableFiles.forEach(file => {
  const sourcePath = path.join(tablesSourceDir, file);
  const destPath = path.join(tablesDestDir, file);
  fs.copyFileSync(sourcePath, destPath);
  const stats = fs.statSync(destPath);
  totalSize += stats.size;
  console.log(`✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
});

console.log(`✓ Copied ${requiredTableFiles.length} table files (${(totalSize / 1024).toFixed(2)} KB total)`);

console.log('✓ Build complete!');
