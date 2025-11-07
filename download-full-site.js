const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Basis configuratie
const BASE_URL = 'https://www.creation.nl';
const OUTPUT_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public/creation-nl-complete';

// Alle pagina's die we moeten downloaden
const PAGES = [
  '/',
  '/portfolio',
  '/online-marketing-bureau',
  '/contact',
  '/internet-marketing/zoekmachine-optimalisatie',
  '/internet-marketing/google-ads',
  '/internet-marketing/conversie-optimalisatie',
  '/banners/html5-banners',
  '/banners/google-ads-banners',
  '/bannerset',
  '/online-marketing-coaching',
  '/voorwaarden',
  '/cookie',
  '/privacy',
  '/kennisbank'
];

// Tracking voor gedownloade resources
const downloadedResources = new Set();
const resourceMap = new Map(); // URL -> lokaal pad

// Maak directories aan
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download een bestand
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    // Skip als al gedownload
    if (downloadedResources.has(url)) {
      console.log(`⏭️  Skipped (already downloaded): ${url}`);
      resolve();
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    ensureDir(path.dirname(outputPath));

    console.log(`⬇️  Downloading: ${url}`);

    protocol.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, outputPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        console.log(`❌ Failed: ${url} (${response.statusCode})`);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        downloadedResources.add(url);
        console.log(`✅ Saved: ${outputPath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download HTML pagina
async function downloadPage(pagePath) {
  const url = BASE_URL + pagePath;

  try {
    const html = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => resolve(data));
      }).on('error', reject);
    });

    // Sla HTML op
    const htmlPath = pagePath === '/' ? '/index' : pagePath;
    const outputPath = path.join(OUTPUT_DIR, htmlPath + '.html');
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, html);
    console.log(`📄 Saved HTML: ${outputPath}`);

    // Extracteer alle resource URLs uit HTML
    return extractResources(html);
  } catch (error) {
    console.error(`❌ Error downloading ${url}:`, error.message);
    return { css: [], js: [], images: [], videos: [] };
  }
}

// Extracteer resources uit HTML
function extractResources(html) {
  const resources = {
    css: new Set(),
    js: new Set(),
    images: new Set(),
    videos: new Set()
  };

  // CSS files
  const cssRegex = /<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi;
  let match;
  while ((match = cssRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.css.add(match[1]);
    }
  }

  // JavaScript files
  const jsRegex = /<script[^>]+src=["']([^"']+\.js[^"']*)["']/gi;
  while ((match = jsRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.js.add(match[1]);
    }
  }

  // Images (img tags)
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // Images (background images in style attributes)
  const bgImgRegex = /url\(['"]?([^'"()]+)['"]?\)/gi;
  while ((match = bgImgRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // Videos
  const videoRegex = /<(?:source|video)[^>]+src=["']([^"']+)["']/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.videos.add(match[1]);
    }
  }

  // data-poster-url for videos
  const posterRegex = /data-poster-url=["']([^"']+)["']/gi;
  while ((match = posterRegex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      resources.images.add(match[1]);
    }
  }

  // data-video-urls
  const dataVideoRegex = /data-video-urls=["']([^"']+)["']/gi;
  while ((match = dataVideoRegex.exec(html)) !== null) {
    const urls = match[1].split(',');
    urls.forEach(url => {
      if (url.startsWith('http')) {
        resources.videos.add(url);
      }
    });
  }

  return {
    css: Array.from(resources.css),
    js: Array.from(resources.js),
    images: Array.from(resources.images),
    videos: Array.from(resources.videos)
  };
}

// Bepaal lokaal pad voor resource
function getLocalPath(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Bepaal type
    let subdir = 'assets';
    if (pathname.match(/\.css$/i)) subdir = 'css';
    else if (pathname.match(/\.js$/i)) subdir = 'js';
    else if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) subdir = 'images';
    else if (pathname.match(/\.(mp4|webm|ogg)$/i)) subdir = 'videos';
    else if (pathname.match(/\.(woff|woff2|ttf|eot|otf)$/i)) subdir = 'fonts';

    // Gebruik filename uit URL
    const filename = path.basename(pathname) || 'index.html';
    return path.join(OUTPUT_DIR, subdir, filename);
  } catch (e) {
    console.error('Error parsing URL:', url, e.message);
    return null;
  }
}

// Main functie
async function main() {
  console.log('🚀 Starting full site download...\n');

  // Maak basis directories
  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, 'css'));
  ensureDir(path.join(OUTPUT_DIR, 'js'));
  ensureDir(path.join(OUTPUT_DIR, 'images'));
  ensureDir(path.join(OUTPUT_DIR, 'videos'));
  ensureDir(path.join(OUTPUT_DIR, 'fonts'));
  ensureDir(path.join(OUTPUT_DIR, 'assets'));

  const allResources = {
    css: new Set(),
    js: new Set(),
    images: new Set(),
    videos: new Set()
  };

  // Download alle pagina's
  console.log('📥 Downloading all pages...\n');
  for (const pagePath of PAGES) {
    console.log(`\n📄 Processing page: ${pagePath}`);
    const resources = await downloadPage(pagePath);

    resources.css.forEach(url => allResources.css.add(url));
    resources.js.forEach(url => allResources.js.add(url));
    resources.images.forEach(url => allResources.images.add(url));
    resources.videos.forEach(url => allResources.videos.add(url));

    // Kleine pauze tussen requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Download alle CSS
  console.log('\n\n🎨 Downloading CSS files...');
  for (const url of allResources.css) {
    const localPath = getLocalPath(url);
    if (localPath) {
      try {
        await downloadFile(url, localPath);
        resourceMap.set(url, localPath);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }
  }

  // Download alle JavaScript
  console.log('\n\n📜 Downloading JavaScript files...');
  for (const url of allResources.js) {
    const localPath = getLocalPath(url);
    if (localPath) {
      try {
        await downloadFile(url, localPath);
        resourceMap.set(url, localPath);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }
  }

  // Download alle afbeeldingen
  console.log('\n\n🖼️  Downloading images...');
  const images = Array.from(allResources.images);
  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const localPath = getLocalPath(url);
    if (localPath) {
      try {
        await downloadFile(url, localPath);
        resourceMap.set(url, localPath);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }

    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${images.length} images downloaded`);
    }
  }

  // Download alle video's
  console.log('\n\n🎥 Downloading videos...');
  for (const url of allResources.videos) {
    const localPath = getLocalPath(url);
    if (localPath) {
      try {
        await downloadFile(url, localPath);
        resourceMap.set(url, localPath);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
      }
    }
  }

  // Statistieken
  console.log('\n\n✅ Download complete!\n');
  console.log('📊 Statistics:');
  console.log(`   Pages: ${PAGES.length}`);
  console.log(`   CSS files: ${allResources.css.size}`);
  console.log(`   JavaScript files: ${allResources.js.size}`);
  console.log(`   Images: ${allResources.images.size}`);
  console.log(`   Videos: ${allResources.videos.size}`);
  console.log(`   Total resources: ${downloadedResources.size}`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
}

// Start
main().catch(console.error);
