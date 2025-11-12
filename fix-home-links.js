#!/usr/bin/env node

/**
 * Script to fix home links
 * Converts /index/ and /index to just /
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Find all HTML files
console.log('Finding all HTML files...');
const files = execSync('find public -name "*.html" -type f')
  .toString()
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`Found ${files.length} HTML files\n`);

let totalChanges = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix home links
  content = content.replace(/href="\/index\/"/g, 'href="/"');
  content = content.replace(/href="\/index"/g, 'href="/"');

  // Also fix index.html references
  content = content.replace(/href="\/index\.html"/g, 'href="/"');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalChanges++;
    console.log(`✓ Fixed: ${filePath}`);
  }
});

console.log(`\n✅ Done! Fixed ${totalChanges} files out of ${files.length} total files.`);
