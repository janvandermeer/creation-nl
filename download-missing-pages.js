const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.creation.nl';
const OUTPUT_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public';

// Alle missende URLs uit sitemap
const MISSING_URLS = [
  // Banners (4)
  '/banners/offerte-banners',
  '/banners/tarieven',
  '/banners/voorbeelden',
  '/banners/werkwijze',

  // Internet Marketing (1)
  '/internet-marketing/websites',

  // Portfolio details (8)
  '/portfolio/treinrondreis',
  '/portfolio/dhs-projecten',
  '/portfolio/hero',
  '/portfolio/bnr',
  '/portfolio/kanzi',
  '/portfolio/rtl',
  '/portfolio/besured',
  '/portfolio/ahoy',

  // Kennisbank artikelen (14)
  '/kennisbank/banner-formaten-in-nederland',
  '/kennisbank/display-campagne',
  '/kennisbank/google-ad-grants',
  '/kennisbank/google-ads-checklist',
  '/kennisbank/google-ads-uitbesteden-vs-google-ads-zelf-beheren',
  '/kennisbank/google-analytics-gebruiker-toevoegen',
  '/kennisbank/ranking-factors',
  '/kennisbank/serp',
  '/kennisbank/uit-hoeveel-computers-bestaat-google',
  '/kennisbank/wat-is-een-clicktag',
  '/kennisbank/wat-is-een-homepage-takeover',
  '/kennisbank/wat-is-het-google-ads-doorklik-percentage',
  '/kennisbank/wat-zijn-flash-banners',
  '/kennisbank/wat-zijn-webvitals',

  // Onderwerp pagina's (4)
  '/onderwerp/banners',
  '/onderwerp/google',
  '/onderwerp/google-ads',
  '/onderwerp/seo',

  // Online Marketing (1)
  '/online-marketing'
];

// Tracking
const downloadedResources = new Set();
const stats = {
  pages: { success: 0, failed: 0 },
  resources: { success: 0, failed: 0, skipped: 0 }
};

// Maak directories aan
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download een bestand
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    if (downloadedResources.has(url)) {
      stats.resources.skipped++;
      resolve();
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    ensureDir(path.dirname(outputPath));

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        stats.resources.failed++;
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        downloadedResources.add(url);
        stats.resources.success++;
        resolve();
      });

      fileStream.on('error', (err) => {
        stats.resources.failed++;
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      stats.resources.failed++;
      reject(err);
    });
  });
}

// Download HTML pagina
async function downloadPage(pagePath) {
  const url = BASE_URL + pagePath;

  console.log(`\n📄 Downloading: ${pagePath}`);

  try {
    const html = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => resolve(data));
      }).on('error', reject);
    });

    // Bepaal output pad
    const outputPath = path.join(OUTPUT_DIR, pagePath + '.html');
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, html);

    console.log(`   ✅ Saved: ${pagePath}.html`);
    stats.pages.success++;

    // Extract nieuwe resources
    const resources = extractNewResources(html);

    // Download nieuwe afbeeldingen (max 5 per pagina om tijd te besparen)
    if (resources.images.length > 0) {
      console.log(`   📸 Found ${resources.images.length} new images, downloading...`);
      const imagesToDownload = resources.images.slice(0, 5);

      for (const imageUrl of imagesToDownload) {
        const filename = path.basename(new URL(imageUrl).pathname);
        const localPath = path.join(OUTPUT_DIR, 'images', filename);

        if (!fs.existsSync(localPath)) {
          try {
            await downloadFile(imageUrl, localPath);
          } catch (err) {
            // Silent fail voor afbeeldingen
          }
        }
      }
    }

    return { success: true, resources };
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    stats.pages.failed++;
    return { success: false, error: error.message };
  }
}

// Extract nieuwe resources
function extractNewResources(html) {
  const resources = {
    images: new Set()
  };

  // Images (img tags)
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // Background images
  const bgImgRegex = /url\(['"]?([^'"()]+)['"]?\)/gi;
  while ((match = bgImgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  return {
    images: Array.from(resources.images)
  };
}

// Main functie
async function main() {
  console.log('🚀 Downloading missing pages from sitemap...\n');
  console.log(`📊 Total pages to download: ${MISSING_URLS.length}\n`);

  const startTime = Date.now();

  // Download alle pagina's
  for (let i = 0; i < MISSING_URLS.length; i++) {
    const pagePath = MISSING_URLS[i];
    console.log(`\n[${i + 1}/${MISSING_URLS.length}]`);

    await downloadPage(pagePath);

    // Kleine pauze tussen requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Statistieken
  console.log('\n\n✅ Download complete!\n');
  console.log('📊 STATISTICS:');
  console.log(`   ⏱️  Duration: ${duration}s`);
  console.log(`\n   📄 Pages:`);
  console.log(`      ✅ Success: ${stats.pages.success}`);
  console.log(`      ❌ Failed: ${stats.pages.failed}`);
  console.log(`\n   🖼️  Resources:`);
  console.log(`      ✅ Downloaded: ${stats.resources.success}`);
  console.log(`      ⏭️  Skipped: ${stats.resources.skipped}`);
  console.log(`      ❌ Failed: ${stats.resources.failed}`);

  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n🔧 Next step: Run fix-html-links.js to update local paths');
}

main().catch(console.error);
