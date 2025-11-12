#!/usr/bin/env node

/**
 * Script to fix remaining relative paths in srcset attributes
 * Handles multiple paths within one srcset attribute
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

  // Fix srcset attributes that contain relative paths in the middle
  // Match patterns like "srcset="/images/file1.png 500w, ../images/file2.png 534w""
  content = content.replace(/srcset="([^"]*)"/g, (match, srcsetValue) => {
    // Replace any remaining relative paths within the srcset value
    const fixed = srcsetValue
      .replace(/\.\.\/.\.\/images\//g, '/images/')
      .replace(/\.\.\/images\//g, '/images/')
      .replace(/\.\/images\//g, '/images/');
    return `srcset="${fixed}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalChanges++;
    console.log(`✓ Fixed: ${filePath}`);
  }
});

console.log(`\n✅ Done! Fixed ${totalChanges} files out of ${files.length} total files.`);
