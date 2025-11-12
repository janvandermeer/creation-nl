#!/usr/bin/env node

/**
 * Script to fix relative paths in HTML files
 * Converts all relative paths to absolute paths from web root
 */

const fs = require('fs');
const path = require('path');
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

  // Fix CSS paths
  content = content.replace(/href="\.\.\/css\//g, 'href="/css/');
  content = content.replace(/href="\.\/css\//g, 'href="/css/');
  content = content.replace(/href="\.\.\/\.\.\/css\//g, 'href="/css/');

  // Fix JS paths
  content = content.replace(/src="\.\.\/js\//g, 'src="/js/');
  content = content.replace(/src="\.\/js\//g, 'src="/js/');
  content = content.replace(/src="\.\.\/\.\.\/js\//g, 'src="/js/');

  // Fix image paths
  content = content.replace(/src="\.\.\/images\//g, 'src="/images/');
  content = content.replace(/src="\.\/images\//g, 'src="/images/');
  content = content.replace(/src="\.\.\/\.\.\/images\//g, 'src="/images/');

  // Fix image paths in href attributes
  content = content.replace(/href="\.\.\/images\//g, 'href="/images/');
  content = content.replace(/href="\.\/images\//g, 'href="/images/');
  content = content.replace(/href="\.\.\/\.\.\/images\//g, 'href="/images/');

  // Fix video paths
  content = content.replace(/src="\.\.\/videos\//g, 'src="/videos/');
  content = content.replace(/src="\.\/videos\//g, 'src="/videos/');
  content = content.replace(/src="\.\.\/\.\.\/videos\//g, 'src="/videos/');

  // Fix data-src attributes for lazy loading
  content = content.replace(/data-src="\.\.\/images\//g, 'data-src="/images/');
  content = content.replace(/data-src="\.\/images\//g, 'data-src="/images/');
  content = content.replace(/data-src="\.\.\/\.\.\/images\//g, 'data-src="/images/');

  content = content.replace(/data-src="\.\.\/videos\//g, 'data-src="/videos/');
  content = content.replace(/data-src="\.\/videos\//g, 'data-src="/videos/');
  content = content.replace(/data-src="\.\.\/\.\.\/videos\//g, 'data-src="/videos/');

  // Fix background-image URLs in style attributes
  content = content.replace(/url\(&quot;\.\.\/images\//g, 'url(&quot;/images/');
  content = content.replace(/url\(&quot;\.\/images\//g, 'url(&quot;/images/');
  content = content.replace(/url\(&quot;\.\.\/\.\.\/images\//g, 'url(&quot;/images/');

  content = content.replace(/url\(&quot;\.\.\/videos\//g, 'url(&quot;/videos/');
  content = content.replace(/url\(&quot;\.\/videos\//g, 'url(&quot;/videos/');
  content = content.replace(/url\(&quot;\.\.\/\.\.\/videos\//g, 'url(&quot;/videos/');

  // Fix srcset attributes (multiple sources)
  content = content.replace(/srcset="\.\.\/images\//g, 'srcset="/images/');
  content = content.replace(/srcset="\.\/images\//g, 'srcset="/images/');
  content = content.replace(/srcset="\.\.\/\.\.\/images\//g, 'srcset="/images/');

  // Fix data-poster-url attributes for video posters
  content = content.replace(/data-poster-url="\.\.\/images\//g, 'data-poster-url="/images/');
  content = content.replace(/data-poster-url="\.\/images\//g, 'data-poster-url="/images/');
  content = content.replace(/data-poster-url="\.\.\/\.\.\/images\//g, 'data-poster-url="/images/');

  // Fix data-video-urls attributes
  content = content.replace(/data-video-urls="\.\.\/videos\//g, 'data-video-urls="/videos/');
  content = content.replace(/data-video-urls="\.\/videos\//g, 'data-video-urls="/videos/');
  content = content.replace(/data-video-urls="\.\.\/\.\.\/videos\//g, 'data-video-urls="/videos/');

  // Fix internal page links - be more careful with these
  // Only fix links that start with /../ (going up and then to a page)
  content = content.replace(/href="\/\.\.\//g, 'href="/');
  content = content.replace(/href="\.\.\/\.\.\//g, 'href="/');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalChanges++;
    console.log(`✓ Fixed: ${filePath}`);
  }
});

console.log(`\n✅ Done! Fixed ${totalChanges} files out of ${files.length} total files.`);
