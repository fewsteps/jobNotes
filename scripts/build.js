#!/usr/bin/env node
// Build script:
// 1. Recursively scans notes/ and bundles MAPPED_NOTES into index.html
// 2. Copies index.html -> dist/index.html
// 3. Copies notes/ -> dist/notes/ (and creates dist/notes/manifest.json for Cloudflare)

const fs   = require('fs');
const path = require('path');

const ROOT       = path.join(__dirname, '..');
const SRC        = path.join(ROOT, 'index.html');
const DIST       = path.join(ROOT, 'dist');
const DEST       = path.join(DIST, 'index.html');
const NOTES_SRC  = path.join(ROOT, 'notes');
const NOTES_DIST = path.join(DIST, 'notes');

if (!fs.existsSync(SRC)) {
  console.error('ERROR: index.html not found at', SRC);
  process.exit(1);
}

// 1. Scan notes/ recursively
function scanNotes(dir, base = '') {
  let res = {};
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    if (item.startsWith('.') || item === 'manifest.json') continue;
    const full = path.join(dir, item);
    const rel = base ? base + '/' + item : item;
    if (fs.statSync(full).isDirectory()) {
      Object.assign(res, scanNotes(full, rel));
    } else {
      res[rel] = fs.readFileSync(full, 'utf8');
    }
  }
  return res;
}

const mappedNotes = scanNotes(NOTES_SRC);
const mappedNotesJson = JSON.stringify(mappedNotes, null, 2);

// Write root notes/manifest.json (for GitHub Pages serving from root)
if (fs.existsSync(NOTES_SRC)) {
  fs.writeFileSync(
    path.join(NOTES_SRC, 'manifest.json'),
    JSON.stringify(Object.keys(mappedNotes), null, 2),
    'utf8'
  );
}

// 2. Inject MAPPED_NOTES into index.html
let html = fs.readFileSync(SRC, 'utf8');
const markerStart = '/* __MAPPED_NOTES_START__ */';
const markerEnd   = '/* __MAPPED_NOTES_END__ */';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

if (html.includes(markerStart) && html.includes(markerEnd)) {
  const replacement = markerStart + '\nvar MAPPED_NOTES = ' + mappedNotesJson + ';\n' + markerEnd;
  const regex = new RegExp(escapeRegExp(markerStart) + '[\\s\\S]*?' + escapeRegExp(markerEnd));
  html = html.replace(regex, replacement);
  fs.writeFileSync(SRC, html, 'utf8');
}

// 3. Ensure dist directory exists
fs.mkdirSync(DIST, { recursive: true });

// 4. Write dist/index.html
fs.writeFileSync(DEST, html, 'utf8');

// 5. Copy notes/ directory to dist/notes/
if (fs.existsSync(NOTES_SRC)) {
  fs.mkdirSync(NOTES_DIST, { recursive: true });
  fs.cpSync(NOTES_SRC, NOTES_DIST, { recursive: true });
  fs.writeFileSync(
    path.join(NOTES_DIST, 'manifest.json'),
    JSON.stringify(Object.keys(mappedNotes), null, 2),
    'utf8'
  );
}

const sizeKB = (fs.statSync(DEST).size / 1024).toFixed(1);
const count = Object.keys(mappedNotes).length;
console.log('Build complete:');
console.log('  index.html       ->  dist/index.html (' + sizeKB + ' KB)');
console.log('  notes/ (' + count + ' files) ->  dist/notes/ (Cloudflare Pages copy)');
console.log('');
console.log('Ready to deploy to Cloudflare Pages & GitHub Pages.');
