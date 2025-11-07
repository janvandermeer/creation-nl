const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Basis HTML van creation.nl
const html = `<!DOCTYPE html>
<html data-wf-domain="www.creation.nl" data-wf-page="61128f85e096f2aac7793d8d" data-wf-site="61128f85e096f2adf5793d8b" lang="nl">
<head>
  <meta charset="utf-8">
  <title>Creation Online Marketing Rotterdam</title>
  <meta content="Je website vindbaar, meer bezoekers door Google Ads of HTML5 banners voor je display campagne. Bel Online marketing bureau Creation uit Rotterdam." name="description">
  <meta content="width=device-width, initial-scale=1" name="viewport">

  <!-- CSS -->
  <link href="css/creation-2022.webflow.shared.css" rel="stylesheet" type="text/css">
  <link href="css/webfonts.css" rel="stylesheet">

  <!-- Favicon -->
  <link href="images/icon-32.png" rel="shortcut icon" type="image/x-icon">
  <link href="images/icon-256.png" rel="apple-touch-icon">
</head>
<body class="body-home">
<!-- Placeholder voor nu - we gaan dit uitbreiden -->
<h1>Creation.nl - Downloaded Version</h1>
<p>Site wordt gedownload...</p>
</body>
</html>`;

// Download functie
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    // Maak directory aan als deze niet bestaat
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Downloading: ${url}`);

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirects
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Saved: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Resources die we moeten downloaden
const resources = {
  css: [
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/css/creation-2022.webflow.shared.dfed5f82c.min.css',
      path: 'public/downloaded-site/css/creation-2022.webflow.shared.css'
    }
  ],
  images: [
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a688531f4b560f88d33609_icon-32.png',
      path: 'public/downloaded-site/images/icon-32.png'
    },
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a68881f1c7f64666c6fbb2_icon-256.png',
      path: 'public/downloaded-site/images/icon-256.png'
    },
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/6460ffbda2dbd7cf98404796_logo-webiste-wit.png',
      path: 'public/downloaded-site/images/logo-webiste-wit.png'
    },
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf291d5ae4b5e7a9976a_RTL_Nederland.png',
      path: 'public/downloaded-site/images/RTL_Nederland.png'
    },
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf29d08ecd2ff3bcdf0c_Hero.png',
      path: 'public/downloaded-site/images/Hero.png'
    },
    {
      url: 'https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf29e5d16b23dbd89c12_friesland.png',
      path: 'public/downloaded-site/images/friesland.png'
    }
  ]
};

console.log('Starting download...\n');

// Schrijf de basis HTML
fs.writeFileSync('public/downloaded-site/index.html', html);
console.log('✓ Created index.html\n');

// Download alle resources
async function downloadAll() {
  try {
    // Download CSS
    console.log('Downloading CSS files...');
    for (const item of resources.css) {
      await downloadFile(item.url, item.path);
    }

    // Download images
    console.log('\nDownloading images...');
    for (const item of resources.images) {
      await downloadFile(item.url, item.path);
    }

    console.log('\n✓ Download complete!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

downloadAll();
