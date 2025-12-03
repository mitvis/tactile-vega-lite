#!/usr/bin/env node

/**
 * Rename .js files in dist/esm to .mjs for ESM module format
 */

const fs = require('fs');
const path = require('path');

const ESM_DIR = path.join(__dirname, '../dist/esm');

function renameJsToMjs(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`ESM directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      renameJsToMjs(filePath);
    } else if (file.endsWith('.js')) {
      const newPath = filePath.replace(/\.js$/, '.mjs');
      fs.renameSync(filePath, newPath);
      console.log(`Renamed: ${file} -> ${path.basename(newPath)}`);
    }
  });
}

console.log('Renaming .js files to .mjs in ESM output...');
renameJsToMjs(ESM_DIR);

// Move index.mjs to dist root
const indexMjsPath = path.join(ESM_DIR, 'index.mjs');
const targetPath = path.join(__dirname, '../dist/index.mjs');

if (fs.existsSync(indexMjsPath)) {
  fs.copyFileSync(indexMjsPath, targetPath);
  console.log(`Copied index.mjs to dist root`);
}

console.log('✓ ESM files renamed successfully');
