const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.creation.nl';
const PUBLIC_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public';

// Bedankpagina's die we moeten downloaden
const THANK_YOU_PAGES = [
  '/contact-bedankt',
  '/banners/offerte-bedankt'
];

// Functie om HTML te fetchen
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode} voor ${url}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Functie om pagina te downloaden
async function downloadPage(pagePath) {
  const url = BASE_URL + pagePath;
  console.log(`\n📥 Downloading: ${url}`);

  try {
    const html = await fetchHTML(url);

    // Bepaal output pad
    let outputPath;
    if (pagePath === '/contact-bedankt') {
      outputPath = path.join(PUBLIC_DIR, 'contact-bedankt.html');
    } else if (pagePath === '/banners/offerte-bedankt') {
      // Zorg dat de banners directory bestaat
      const bannersDir = path.join(PUBLIC_DIR, 'banners');
      if (!fs.existsSync(bannersDir)) {
        fs.mkdirSync(bannersDir, { recursive: true });
      }
      outputPath = path.join(PUBLIC_DIR, 'banners', 'offerte-bedankt.html');
    }

    // Schrijf HTML bestand
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Saved: ${outputPath}`);

    return { success: true, path: outputPath };
  } catch (error) {
    console.error(`❌ Error downloading ${url}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main functie
async function main() {
  console.log('🚀 Downloading bedankpagina\'s...\n');
  console.log(`📊 Pages to download: ${THANK_YOU_PAGES.length}`);

  let success = 0;
  let failed = 0;

  for (const pagePath of THANK_YOU_PAGES) {
    const result = await downloadPage(pagePath);
    if (result.success) {
      success++;
    } else {
      failed++;
    }

    // Kleine pauze tussen requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n✅ Download complete!');
  console.log(`📊 Statistics:`);
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n📁 Saved to: ${PUBLIC_DIR}`);
  console.log('\n⚠️  Run fix-html-links.js to convert external URLs to local paths!');
}

main().catch(console.error);
