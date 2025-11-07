# Externe Resources Analyse - Homepage (index.html)

## 📊 Samenvatting
Geanalyseerd: **index.html**
Datum: 2025-11-06

## 🌐 Externe Domeinen Gevonden

### 1. **Google Fonts** (2 URLs)
**Domein:** `fonts.googleapis.com` + `fonts.gstatic.com`
**Type:** Font hosting
**Locatie in code:** `<head>` sectie
```html
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous"/>
```
**Functie:** Laadt de "Assistant" font family
**Impact:** Noodzakelijk voor typography, kan lokaal gehost worden

---

### 2. **Google Tag Manager**
**Domein:** `www.googletagmanager.com`
**Type:** Analytics/Tracking script
**Locatie in code:** `<head>` sectie (inline script)
```javascript
'https://www.googletagmanager.com/gtm.js?id='
```
**Functie:** Website analytics en tracking
**Impact:** Kan verwijderd worden voor volledig offline gebruik
**Status:** Optioneel voor lokale development

---

### 3. **Canonical URL**
**Domein:** `www.creation.nl`
**Type:** SEO metadata
**Locatie in code:** `<head>` sectie
```html
<link href="https://www.creation.nl" rel="canonical"/>
```
**Functie:** SEO - vertelt zoekmachines wat de originele URL is
**Impact:** Geen externe resource download, alleen metadata
**Status:** Kan aangepast worden naar localhost voor lokaal

---

### 4. **Calendly Widget**
**Domein:** `calendly.com`
**Type:** Meeting/afspraak scheduler
**Locatie in code:** Footer - "Online meet" sectie
```html
onclick="Calendly.initPopupWidget({url: 'https://calendly.com/jan-vandermeer/afspraak'});"
```
**Functie:** Popup voor het maken van afspraken
**Impact:** Widget werkt niet offline, moet externe verbinding hebben
**Status:** Blijft extern (vereist Calendly account)

---

### 5. **Google Partner Badge**
**Domein:** `www.google.com`
**Type:** Externe link
**Locatie in code:** Footer
```html
<a href="https://www.google.com/partners/agency?id=8173009707" target="_blank">
```
**Functie:** Link naar Google Partner profiel
**Impact:** Alleen een link, laadt geen resources
**Status:** Link blijft extern

---

### 6. **Adpiler Banner Ads** (2 iframes)
**Domein:** `adpiler.s3.eu-central-1.amazonaws.com`
**Type:** HTML5 banner demo's in iframes
**Locatie in code:** Footer animatie sectie

**Mobile banner:**
```html
<iframe src="https://adpiler.s3.eu-central-1.amazonaws.com/ads/0c3349b9940a5675888aeeaa11146792_html/index.html"
        width="300" height="280">
```

**Desktop banner:**
```html
<iframe src="https://adpiler.s3.eu-central-1.amazonaws.com/ads/7999011f9adf019dc83d50a17ac8630e_html/index.html"
        width="550" height="280">
```

**Functie:** Toont voorbeeld banners in de footer
**Impact:** Banner animations werken niet offline
**Status:** Kan gedownload en lokaal gehost worden

---

## 📈 Statistieken

| Type | Aantal | Kan lokaal? | Prioriteit |
|------|---------|-------------|------------|
| **Fonts** | 2 | ✅ Ja | Hoog |
| **Analytics/Tracking** | 1 | ✅ Ja (optioneel) | Laag |
| **SEO Metadata** | 1 | ⚠️ N.v.t. | N.v.t. |
| **External Widgets** | 1 | ❌ Nee | Medium |
| **External Links** | 1 | ⚠️ Link only | N.v.t. |
| **Banner Iframes** | 2 | ✅ Ja | Hoog |

---

## ✅ Lokale Resources (Werken al offline)

Alle volgende resources zijn **lokaal** en werken offline:
- ✅ CSS bestanden (`./css/`)
- ✅ JavaScript bestanden (`./js/`)
- ✅ Afbeeldingen (`./images/`)
- ✅ Video's (`./videos/`)
- ✅ Alle interne links

---

## 🎯 Aanbevelingen voor Volledig Offline Gebruik

### Hoge Prioriteit:
1. **Google Fonts lokaliseren** - Download "Assistant" font en host lokaal
2. **Adpiler banners downloaden** - Download de 2 HTML5 banners en host lokaal

### Lage Prioriteit:
3. **Google Tag Manager verwijderen** - Niet nodig voor lokale development
4. **Canonical URL aanpassen** - Verander naar localhost URL

### Niet mogelijk:
- **Calendly widget** blijft extern (vereist online service)
- **Google Partner link** blijft extern (externe verwijzing)

---

## 🔍 Technische Details

**Totaal externe requests bij laden homepage:**
- Fonts: 2 requests (preconnect + font download)
- Google Tag Manager: 1 request
- Calendly widget: 1 request (bij klikken)
- Adpiler iframes: 2 requests
- **Totaal: ~6 externe requests**

**Totaal lokale resources:**
- HTML: 1 bestand
- CSS: 2 bestanden
- JavaScript: 13+ bestanden
- Afbeeldingen: 28+ bestanden
- Video's: 2 bestanden
