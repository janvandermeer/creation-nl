#!/usr/bin/env node

/**
 * Script to remove "Online meet" section from footer
 * Removes the heading and the mail link
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

  // Remove the entire "Online meet" section
  // Pattern: <h5 class="foot-heading">Online meet</h5><div class="w-embed"><a href="mailto:hello@creation.nl" class="foot-link">Mail voor afspraak</a></div>
  content = content.replace(
    /<h5 class="foot-heading">Online meet<\/h5><div class="w-embed"><a href="mailto:hello@creation\.nl" class="foot-link">Mail voor afspraak<\/a><\/div>/g,
    ''
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalChanges++;
    console.log(`✓ Fixed: ${filePath}`);
  }
});

console.log(`\n✅ Done! Fixed ${totalChanges} files out of ${files.length} total files.`);
