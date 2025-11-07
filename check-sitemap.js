const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = '/Users/janvandermeer/Local Sites/creation-nl/sitemap.xml';
const PUBLIC_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public';

// Lees sitemap
const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Extract alle URLs
const urlRegex = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/g;
const urls = [];
let match;

while ((match = urlRegex.exec(sitemap)) !== null) {
  urls.push(match[1].trim());
}

console.log(`📊 Gevonden in sitemap: ${urls.length} URLs\n`);

// Converteer URL naar lokaal bestand pad
function urlToLocalPath(url) {
  const urlObj = new URL(url);
  let pathname = urlObj.pathname;

  // Root URL
  if (pathname === '/' || pathname === '') {
    return 'index.html';
  }

  // Verwijder leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }

  // Voeg .html toe als het geen extensie heeft
  if (!pathname.endsWith('.html') && !pathname.includes('.')) {
    pathname = pathname + '.html';
  }

  return pathname;
}

// Check welke bestanden we hebben
const found = [];
const missing = [];
const stats = {
  total: urls.length,
  found: 0,
  missing: 0
};

console.log('🔍 Controleren welke pagina\'s we hebben...\n');

urls.forEach(url => {
  const localPath = urlToLocalPath(url);
  const fullPath = path.join(PUBLIC_DIR, localPath);

  if (fs.existsSync(fullPath)) {
    found.push({ url, localPath, exists: true });
    stats.found++;
  } else {
    missing.push({ url, localPath, exists: false });
    stats.missing++;
  }
});

// Rapportage
console.log('✅ GEVONDEN PAGINA\'S (' + stats.found + '/' + stats.total + '):\n');
found.forEach(item => {
  console.log(`   ✓ ${item.localPath}`);
});

console.log('\n❌ MISSENDE PAGINA\'S (' + stats.missing + '/' + stats.total + '):\n');
missing.forEach(item => {
  console.log(`   ✗ ${item.url}`);
  console.log(`     → Verwacht: ${item.localPath}`);
});

console.log('\n📈 SAMENVATTING:');
console.log(`   Totaal URLs in sitemap: ${stats.total}`);
console.log(`   ✅ Gevonden: ${stats.found} (${Math.round(stats.found/stats.total*100)}%)`);
console.log(`   ❌ Missend: ${stats.missing} (${Math.round(stats.missing/stats.total*100)}%)`);

// Groepeer missende pagina's per categorie
console.log('\n📋 MISSENDE PAGINA\'S PER CATEGORIE:\n');

const categories = {};
missing.forEach(item => {
  const urlObj = new URL(item.url);
  const pathParts = urlObj.pathname.split('/').filter(p => p);
  const category = pathParts.length > 0 ? pathParts[0] : 'root';

  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(item);
});

Object.keys(categories).sort().forEach(category => {
  console.log(`   ${category.toUpperCase()} (${categories[category].length}):`);
  categories[category].forEach(item => {
    const urlObj = new URL(item.url);
    console.log(`      - ${urlObj.pathname}`);
  });
  console.log('');
});

// Test localhost URLs
console.log('🌐 TEST URLS (localhost:3033):\n');
console.log('   Gevonden pagina\'s zijn toegankelijk op:');
found.slice(0, 5).forEach(item => {
  console.log(`   http://localhost:3033/${item.localPath}`);
});
if (found.length > 5) {
  console.log(`   ... en nog ${found.length - 5} andere pagina\'s`);
}
