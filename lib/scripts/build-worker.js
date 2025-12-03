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

// Copy liblouis tables directory
console.log('Copying liblouis tables...');
const tablesSource = path.join(__dirname, '../node_modules/liblouis-build/tables');
const tablesDest = path.join(LIB_OUTPUT_DIR, 'tables');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }

  return fileCount;
}

const tableFileCount = copyDirectory(tablesSource, tablesDest);
console.log(`✓ Copied ${tableFileCount} table files`);

console.log('✓ Build complete!');
