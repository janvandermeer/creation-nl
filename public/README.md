# Creation.nl - Volledige Lokale Kopie

Deze directory bevat een complete lokale kopie van de Creation.nl website, gedownload op 6 november 2024.

## 📊 Wat is gedownload

### Pagina's (15)
✅ Homepage (index.html)
✅ Portfolio (portfolio.html)
✅ Online Marketing Bureau (online-marketing-bureau.html)
✅ Contact (contact.html)
✅ Zoekmachine Optimalisatie (internet-marketing/zoekmachine-optimalisatie.html)
✅ Google Ads (internet-marketing/google-ads.html)
✅ Conversie Optimalisatie (internet-marketing/conversie-optimalisatie.html)
✅ HTML5 Banners (banners/html5-banners.html)
✅ Google Ads Banners (banners/google-ads-banners.html)
✅ Bannerset (bannerset.html)
✅ Online Marketing Coaching (online-marketing-coaching.html)
✅ Voorwaarden (voorwaarden.html)
✅ Cookie Policy (cookie.html)
✅ Privacy Policy (privacy.html)
✅ Kennisbank (kennisbank.html)

### Resources
- **CSS**: 2 bestanden
- **JavaScript**: 13 bestanden
- **Afbeeldingen**: 28 bestanden
- **Video's**: 2 bestanden (MP4 + WebM)
- **Totaal**: 45 resources + 15 HTML pagina's

## 📁 Structuur

```
creation-nl-complete/
├── index.html                 # Homepage
├── portfolio.html
├── online-marketing-bureau.html
├── contact.html
├── bannerset.html
├── online-marketing-coaching.html
├── kennisbank.html
├── voorwaarden.html
├── cookie.html
├── privacy.html
│
├── banners/
│   ├── html5-banners.html
│   └── google-ads-banners.html
│
├── internet-marketing/
│   ├── zoekmachine-optimalisatie.html
│   ├── google-ads.html
│   └── conversie-optimalisatie.html
│
├── css/
│   ├── creation-2022.webflow.shared.dfed5f82c.min.css
│   └── widget.css
│
├── js/
│   ├── jquery-3.5.1.min.dc5e7f18c8.js
│   ├── webfont.js
│   ├── api.js
│   ├── widget.js
│   └── webflow.[various].js (9 bestanden)
│
├── images/
│   ├── logo-webiste-wit.png
│   ├── icon-32.png
│   ├── icon-256.png
│   ├── creation-footer.png
│   ├── PartnerBadgeClickable.svg
│   ├── RTL_Nederland.png
│   ├── Hero.png
│   ├── friesland.png
│   ├── laplace.png
│   ├── BNR.png
│   ├── ABN.png
│   └── [15+ andere afbeeldingen]
│
└── videos/
    ├── creation-online-marketing-transcode.mp4
    └── creation-online-marketing-transcode.webm
```

## 🚀 Hoe te gebruiken

### Optie 1: Direct in browser openen
Dubbelklik op `index.html` of open het in je browser:
```
file:///Users/janvandermeer/Local Sites/creation-nl/public/creation-nl-complete/index.html
```

### Optie 2: Via lokale webserver (aanbevolen)
```bash
# Met Python 3
cd "/Users/janvandermeer/Local Sites/creation-nl/public/creation-nl-complete"
python3 -m http.server 8000

# Open browser naar: http://localhost:8000
```

### Optie 3: Via Docker
De site is toegankelijk via de Docker webserver:
```
http://localhost:3033/creation-nl-complete/
```

## ✨ Aanpassingen

### Wat is aangepast
1. **Alle externe URLs vervangen door lokale paden**
   - CDN URLs voor CSS, JS, afbeeldingen → lokale bestanden
   - Interne links aangepast (bijv. `/portfolio` → `portfolio.html`)

2. **Tracking en analytics verwijderd**
   - Google Tag Manager
   - Google Analytics
   - TikTok Analytics
   - Microsoft Clarity
   - Cookie consent banners

3. **Relatieve paden gecorrigeerd**
   - Alle links werken lokaal
   - Subdirectory navigatie werkt correct

### URL Vervangingen
Totaal: **312 URL vervangingen** in 15 HTML bestanden

## ⚠️ Beperkingen

### Niet gedownload
- Portfolio detailpagina's (portfolio/treinrondreis.html, portfolio/bnr.html, etc.)
- Kennisbank artikelen
- Externe iframes (Calendly widgets, etc.)
- Externe fonts (Google Fonts wordt nog van CDN geladen)

### Niet werkend
- Formulieren (contact form, etc.) - geen backend
- Externe API calls
- Google reCAPTCHA
- Cookie consent functionaliteit
- Calendly widget voor afspraken

## 🔧 Scripts gebruikt

### 1. Download script
```bash
node download-full-site.js
```
- Download alle 15 pagina's
- Extract alle resource URLs
- Download CSS, JS, afbeeldingen en video's

### 2. Link fix script
```bash
node fix-html-links.js
```
- Vervangt externe URLs door lokale paden
- Past interne links aan
- Verwijdert tracking scripts

## 📈 Statistieken

- **Download tijd**: ~2 minuten
- **Totale grootte**: ~5 MB (inclusief video's)
- **URL vervangingen**: 312
- **Pagina's**: 15
- **Resources**: 45

## 🎯 Volgende stappen (optioneel)

Om een nog completere kopie te maken:
1. Download portfolio detailpagina's
2. Download kennisbank artikelen
3. Download Google Fonts lokaal
4. Implementeer contact formulier backend
5. Download eventuele PDF's en documenten

## 📝 Notities

- Alle links tussen pagina's werken lokaal
- Afbeeldingen laden correct
- Video's werken (met fallback naar WebM)
- Styling is volledig behouden
- Responsive design werkt

## 🔒 Gebruik

Deze lokale kopie is gemaakt voor:
- Backup doeleinden
- Offline demonstraties
- Ontwikkeling/testing
- Archivering

**Niet voor**: productie gebruik zonder verder onderhoud en updates.

---

**Laatste update**: 6 november 2024
**Originele site**: https://www.creation.nl
**Gedownload met**: Node.js scripts (download-full-site.js + fix-html-links.js)
