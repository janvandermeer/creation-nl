const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public';

// Recursief alle HTML bestanden vinden
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Verwijder Calendly code uit HTML bestand
function removeCalendly(filePath) {
  console.log(`\n🔧 Processing: ${path.basename(filePath)}`);

  let html = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // 1. Verwijder Calendly widget.js script uit head
  const widgetScriptRegex = /<script src="[^"]*\/widget\.js"[^>]*><\/script>/g;
  if (html.match(widgetScriptRegex)) {
    html = html.replace(widgetScriptRegex, '<!-- Calendly widget removed -->');
    changes++;
    console.log('   ✓ Removed Calendly widget.js script');
  }

  // 2. Verwijder Calendly onclick handler uit footer links
  const onclickRegex = /onclick="Calendly\.initPopupWidget\(\{url: 'https:\/\/calendly\.com\/[^']*'\}\);return false;"/g;
  if (html.match(onclickRegex)) {
    html = html.replace(onclickRegex, '');
    changes++;
    console.log('   ✓ Removed Calendly onclick handlers');
  }

  // 3. Verwijder href="" van "Afspraak maken" links en maak ze mailto links
  // Zoek naar de "Afspraak maken" link en vervang met contact link
  const afspraakLinkRegex = /<a href="" onclick=""[^>]*class="foot-link">Afspraak maken<\/a>/g;
  if (html.match(afspraakLinkRegex)) {
    html = html.replace(afspraakLinkRegex, '<a href="mailto:hello@creation.nl" class="foot-link">Mail voor afspraak</a>');
    changes++;
    console.log('   ✓ Replaced "Afspraak maken" with email link');
  }

  // Ook zonder onclick al removed
  const emptyAfspraakRegex = /<a href=""[^>]*class="foot-link">Afspraak maken<\/a>/g;
  if (html.match(emptyAfspraakRegex)) {
    html = html.replace(emptyAfspraakRegex, '<a href="mailto:hello@creation.nl" class="foot-link">Mail voor afspraak</a>');
    changes++;
    console.log('   ✓ Replaced empty "Afspraak maken" with email link');
  }

  // Schrijf terug
  if (changes > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Removed Calendly code (${changes} changes) from ${path.basename(filePath)}`);
  } else {
    console.log(`⚪ No Calendly code found in ${path.basename(filePath)}`);
  }

  return changes;
}

// Main functie
async function main() {
  console.log('🚀 Starting Calendly removal...\n');

  // Vind alle HTML bestanden
  const files = findHtmlFiles(PUBLIC_DIR);
  console.log(`📄 Found ${files.length} HTML files\n`);

  let totalChanges = 0;
  let filesModified = 0;

  // Process elk HTML bestand
  for (const file of files) {
    const changes = removeCalendly(file);
    if (changes > 0) {
      filesModified++;
      totalChanges += changes;
    }
  }

  console.log('\n\n✅ Processing complete!');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Total changes: ${totalChanges}`);
  console.log(`\n📁 Output directory: ${PUBLIC_DIR}`);
  console.log('\n✅ Calendly widget has been removed from all pages!');
}

main().catch(console.error);
