const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/janvandermeer/Local Sites/creation-nl/public';

// Mapping van externe URLs naar lokale paden
const urlMappings = {
  // CSS
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/css/creation-2022.webflow.shared.dfed5f82c.min.css': 'css/creation-2022.webflow.shared.dfed5f82c.min.css',
  'https://assets.calendly.com/assets/external/widget.css': 'css/widget.css',

  // JavaScript
  'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js': 'js/webfont.js',
  'https://www.google.com/recaptcha/api.js': 'js/api.js',
  'https://assets.calendly.com/assets/external/widget.js': 'js/widget.js',
  'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=61128f85e096f2adf5793d8b': 'js/jquery-3.5.1.min.dc5e7f18c8.js',

  // Images - veel voorkomende
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/6460ffbda2dbd7cf98404796_logo-webiste-wit.png': 'images/6460ffbda2dbd7cf98404796_logo-webiste-wit.png',
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a688531f4b560f88d33609_icon-32.png': 'images/63a688531f4b560f88d33609_icon-32.png',
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a68881f1c7f64666c6fbb2_icon-256.png': 'images/icon-256.png',

  // Videos
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63b145483fcbb03eab598ffd_creation-online-marketing-transcode.mp4': 'videos/63b145483fcbb03eab598ffd_creation-online-marketing-transcode.mp4',
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63b145483fcbb03eab598ffd_creation-online-marketing-transcode.webm': 'videos/63b145483fcbb03eab598ffd_creation-online-marketing-transcode.webm',
  'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63b145483fcbb03eab598ffd_creation-online-marketing-poster-00001.jpg': 'images/63b145483fcbb03eab598ffd_creation-online-marketing-poster-00001.jpg',
};

// Functie om alle afbeeldingen te mappen
function buildImageMappings() {
  const imagesDir = path.join(BASE_DIR, 'images');
  const imageFiles = fs.readdirSync(imagesDir);

  imageFiles.forEach(file => {
    const localPath = `images/${file}`;
    // Probeer verschillende URL patronen
    const cdnUrl = `https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/${file}`;
    urlMappings[cdnUrl] = localPath;
  });
}

// Functie om alle JS bestanden te mappen
function buildJsMappings() {
  const jsDir = path.join(BASE_DIR, 'js');
  const jsFiles = fs.readdirSync(jsDir);

  jsFiles.forEach(file => {
    const localPath = `js/${file}`;
    const cdnUrl = `https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/js/${file}`;
    urlMappings[cdnUrl] = localPath;
  });
}

// Fix HTML bestand
function fixHtmlFile(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);

  let html = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Bepaal de relatieve diepte van het bestand
  const relativePath = path.relative(BASE_DIR, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  // Vervang alle gemapte URLs
  Object.keys(urlMappings).forEach(externalUrl => {
    const localPath = urlMappings[externalUrl];
    const relativeLocalPath = prefix + localPath;

    if (html.includes(externalUrl)) {
      const regex = new RegExp(externalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = html.match(regex);
      if (matches) {
        html = html.replace(regex, relativeLocalPath);
        changes += matches.length;
      }
    }
  });

  // Generieke vervangingen voor cdn.prod.website-files.com URLs
  const cdnRegex = /https:\/\/cdn\.prod\.website-files\.com\/61128f85e096f2adf5793d8b\/([^"'\s)]+\.(png|jpg|jpeg|gif|svg|webp))/gi;
  html = html.replace(cdnRegex, (match, filename) => {
    changes++;
    return `${prefix}images/${filename}`;
  });

  // Vervang JavaScript URLs
  const jsRegex = /https:\/\/cdn\.prod\.website-files\.com\/61128f85e096f2adf5793d8b\/js\/([^"'\s)]+\.js[^"'\s]*)/gi;
  html = html.replace(jsRegex, (match, filename) => {
    changes++;
    return `${prefix}js/${filename}`;
  });

  // Fix interne links (maak ze relatief)
  html = html.replace(/href=["'](\/[^"']*?)["']/g, (match, link) => {
    // Skip mailto en tel links
    if (link.startsWith('tel:') || link.startsWith('mailto:')) {
      return match;
    }

    // Converteer absolute pad naar relatieve HTML bestandsnaam
    let targetPath = link === '/' ? 'index.html' : link.substring(1) + '.html';

    // Bereken relatief pad
    const currentDir = path.dirname(relativePath);
    const targetFile = targetPath;

    let relativeLinkPath;
    if (currentDir === '.') {
      relativeLinkPath = targetFile;
    } else {
      // Ga terug naar root en dan naar target
      const upLevels = currentDir.split(path.sep).length;
      relativeLinkPath = '../'.repeat(upLevels) + targetFile;
    }

    return `href="${relativeLinkPath}"`;
  });

  // Verwijder tracking scripts en andere externe dependencies
  html = html.replace(/<script[^>]*src=["']https:\/\/www\.googletagmanager\.com\/[^"']*["'][^>]*>.*?<\/script>/gs, '<!-- Google Tag Manager removed -->');
  html = html.replace(/<script[^>]*src=["']https:\/\/analytics\.tiktok\.com\/[^"']*["'][^>]*>.*?<\/script>/gs, '<!-- TikTok Analytics removed -->');
  html = html.replace(/<script[^>]*src=["']https:\/\/www\.clarity\.ms\/[^"']*["'][^>]*>.*?<\/script>/gs, '<!-- Clarity removed -->');
  html = html.replace(/<script[^>]*src=["']https:\/\/cdn\.cookiecode\.nl\/[^"']*["'][^>]*>.*?<\/script>/gs, '<!-- Cookie Code removed -->');

  // Verwijder Google Tag Manager noscript
  html = html.replace(/<noscript>.*?googletagmanager.*?<\/noscript>/gs, '');

  // Verwijder cookie banner
  html = html.replace(/<cookiecode-banner[^>]*>.*?<\/cookiecode-banner>/gs, '');

  // Schrijf terug
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Fixed ${changes} URLs in ${path.basename(filePath)}`);

  return changes;
}

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

// Main functie
async function main() {
  console.log('🚀 Starting HTML link fixing...\n');

  // Build mappings
  console.log('📋 Building resource mappings...');
  buildImageMappings();
  buildJsMappings();
  console.log(`✅ Mapped ${Object.keys(urlMappings).length} resources\n`);

  // Vind alle HTML bestanden
  const files = findHtmlFiles(BASE_DIR);
  console.log(`📄 Found ${files.length} HTML files\n`);

  let totalChanges = 0;
  let fileCount = 0;

  // Process elk HTML bestand
  for (const file of files) {
    const changes = fixHtmlFile(file);
    totalChanges += changes;
    fileCount++;
  }

  console.log('\n\n✅ Processing complete!');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${fileCount}`);
  console.log(`   Total URL replacements: ${totalChanges}`);
  console.log(`\n📁 Output directory: ${BASE_DIR}`);
  console.log('\n🌐 Open index.html in browser to test!');
}

main().catch(console.error);
