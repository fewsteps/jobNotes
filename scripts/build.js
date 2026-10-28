#!/usr/bin/env node
// Build script: copies knowledge-base.html -> dist/index.html
// Run automatically via: npm run build (or npm run deploy)

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC  = path.join(ROOT, 'knowledge-base.html');
const DIST = path.join(ROOT, 'dist');
const DEST = path.join(DIST, 'index.html');

if (!fs.existsSync(SRC)) {
  console.error('ERROR: knowledge-base.html not found at', SRC);
  process.exit(1);
}

fs.mkdirSync(DIST, { recursive: true });
fs.copyFileSync(SRC, DEST);

const sizeKB = (fs.statSync(DEST).size / 1024).toFixed(1);
console.log('Build complete:');
console.log('  knowledge-base.html  ->  dist/index.html  (' + sizeKB + ' KB)');
console.log('');
console.log('Ready to deploy to Cloudflare Pages.');
