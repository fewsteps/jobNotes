#!/usr/bin/env node
// Build script: copies index.html -> dist/index.html for Cloudflare Pages deployment
// Run automatically via: npm run deploy (or npm run build)

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC  = path.join(ROOT, 'index.html');
const DIST = path.join(ROOT, 'dist');
const DEST = path.join(DIST, 'index.html');

if (!fs.existsSync(SRC)) {
  console.error('ERROR: index.html not found at', SRC);
  process.exit(1);
}

fs.mkdirSync(DIST, { recursive: true });
fs.copyFileSync(SRC, DEST);

const sizeKB = (fs.statSync(DEST).size / 1024).toFixed(1);
console.log('Build complete:');
console.log('  index.html  ->  dist/index.html  (' + sizeKB + ' KB)');
console.log('');
console.log('Ready to deploy to Cloudflare Pages.');
