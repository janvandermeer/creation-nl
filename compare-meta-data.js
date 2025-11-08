const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuratie
const LOCAL_PUBLIC_DIR = path.join(__dirname, 'public');
const LIVE_BASE_URL = 'https://tst.creation.nl';

// Functie om meta tags uit HTML te extraheren
function extractMetaData(html) {
    const result = {
        title: null,
        description: null
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
        result.title = titleMatch[1].trim();
    }

    // Extract meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                      html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
    if (descMatch) {
        result.description = descMatch[1].trim();
    }

    return result;
}

// Functie om alle HTML bestanden te vinden
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

// Functie om een URL op te halen
function fetchUrl(url) {
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

// Hoofdfunctie
async function compareMetaData() {
    console.log('🔍 Starten meta data vergelijking...\n');

    // Vind alle lokale HTML bestanden
    const htmlFiles = findHtmlFiles(LOCAL_PUBLIC_DIR);
    console.log(`📄 Gevonden: ${htmlFiles.length} HTML pagina's\n`);

    const results = [];
    let totalChecked = 0;
    let totalDifferences = 0;
    let totalErrors = 0;

    // Verwerk elke HTML pagina
    for (const filePath of htmlFiles) {
        const relativePath = path.relative(LOCAL_PUBLIC_DIR, filePath);
        const urlPath = relativePath.replace(/\\/g, '/'); // Windows compatibiliteit
        const liveUrl = `${LIVE_BASE_URL}/${urlPath}`;

        // Lees lokale HTML
        const localHtml = fs.readFileSync(filePath, 'utf8');
        const localMeta = extractMetaData(localHtml);

        // Probeer live versie op te halen
        let liveMeta = null;
        let error = null;

        try {
            console.log(`⏳ Checking: ${urlPath}`);
            const liveHtml = await fetchUrl(liveUrl);
            liveMeta = extractMetaData(liveHtml);
            totalChecked++;

            // Vergelijk
            const titleMatch = localMeta.title === liveMeta.title;
            const descMatch = localMeta.description === liveMeta.description;

            if (!titleMatch || !descMatch) {
                totalDifferences++;
            }

            results.push({
                path: urlPath,
                url: liveUrl,
                local: localMeta,
                live: liveMeta,
                titleMatch,
                descMatch,
                error: null
            });

            console.log(`  ${titleMatch && descMatch ? '✅' : '⚠️'} ${titleMatch ? 'Titel OK' : 'Titel VERSCHIL'} | ${descMatch ? 'Desc OK' : 'Desc VERSCHIL'}`);

        } catch (err) {
            console.log(`  ❌ ERROR: ${err.message}`);
            totalErrors++;
            results.push({
                path: urlPath,
                url: liveUrl,
                local: localMeta,
                live: null,
                titleMatch: false,
                descMatch: false,
                error: err.message
            });
        }

        // Kleine pauze om server niet te overbelasten
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SAMENVATTING');
    console.log('='.repeat(80));
    console.log(`Totaal pagina's: ${htmlFiles.length}`);
    console.log(`Succesvol gecontroleerd: ${totalChecked}`);
    console.log(`Verschillen gevonden: ${totalDifferences}`);
    console.log(`Errors: ${totalErrors}`);
    console.log('='.repeat(80) + '\n');

    // Genereer gedetailleerd rapport
    generateReport(results);
}

// Genereer markdown rapport
function generateReport(results) {
    let report = '# Meta Data Vergelijking: Lokaal vs tst.creation.nl\n\n';
    report += `Gegenereerd: ${new Date().toLocaleString('nl-NL')}\n\n`;

    // Samenvatting
    report += '## Samenvatting\n\n';
    report += `- Totaal pagina's: ${results.length}\n`;
    report += `- Perfect gelijk: ${results.filter(r => r.titleMatch && r.descMatch && !r.error).length}\n`;
    report += `- Met verschillen: ${results.filter(r => (!r.titleMatch || !r.descMatch) && !r.error).length}\n`;
    report += `- Errors (niet bereikbaar): ${results.filter(r => r.error).length}\n\n`;

    // Perfecte matches
    const perfectMatches = results.filter(r => r.titleMatch && r.descMatch && !r.error);
    if (perfectMatches.length > 0) {
        report += '## ✅ Perfect Gelijk (' + perfectMatches.length + ' pagina\'s)\n\n';
        perfectMatches.forEach(r => {
            report += `- [${r.path}](${r.url})\n`;
        });
        report += '\n';
    }

    // Verschillen
    const differences = results.filter(r => (!r.titleMatch || !r.descMatch) && !r.error);
    if (differences.length > 0) {
        report += '## ⚠️ Verschillen Gevonden (' + differences.length + ' pagina\'s)\n\n';
        differences.forEach(r => {
            report += `### ${r.path}\n\n`;
            report += `**URL:** ${r.url}\n\n`;

            if (!r.titleMatch) {
                report += '**TITEL VERSCHIL:**\n\n';
                report += `- **Lokaal:** ${r.local.title || '(geen)'}\n`;
                report += `- **Live:** ${r.live.title || '(geen)'}\n\n`;
            }

            if (!r.descMatch) {
                report += '**DESCRIPTION VERSCHIL:**\n\n';
                report += `- **Lokaal:** ${r.local.description || '(geen)'}\n`;
                report += `- **Live:** ${r.live.description || '(geen)'}\n\n`;
            }

            report += '---\n\n';
        });
    }

    // Errors
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
        report += '## ❌ Errors / Niet Bereikbaar (' + errors.length + ' pagina\'s)\n\n';
        errors.forEach(r => {
            report += `### ${r.path}\n\n`;
            report += `**URL:** ${r.url}\n`;
            report += `**Error:** ${r.error}\n`;
            report += `**Lokale meta data:**\n`;
            report += `- Titel: ${r.local.title || '(geen)'}\n`;
            report += `- Description: ${r.local.description || '(geen)'}\n\n`;
        });
    }

    // Volledige tabel
    report += '## 📋 Volledige Overzicht\n\n';
    report += '| Pagina | Titel Match | Description Match | Status |\n';
    report += '|--------|-------------|-------------------|--------|\n';
    results.forEach(r => {
        const status = r.error ? '❌ Error' : (r.titleMatch && r.descMatch ? '✅ OK' : '⚠️ Verschil');
        const titleIcon = r.error ? '-' : (r.titleMatch ? '✅' : '❌');
        const descIcon = r.error ? '-' : (r.descMatch ? '✅' : '❌');
        report += `| ${r.path} | ${titleIcon} | ${descIcon} | ${status} |\n`;
    });

    // Schrijf rapport naar bestand
    const reportPath = path.join(__dirname, 'meta-data-comparison-report.md');
    fs.writeFileSync(reportPath, report, 'utf8');

    console.log(`\n✅ Rapport opgeslagen: ${reportPath}\n`);

    // Schrijf ook JSON voor verdere analyse
    const jsonPath = path.join(__dirname, 'meta-data-comparison.json');
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`✅ JSON data opgeslagen: ${jsonPath}\n`);
}

// Start het script
compareMetaData().catch(err => {
    console.error('❌ Fout bij uitvoeren script:', err);
    process.exit(1);
});
