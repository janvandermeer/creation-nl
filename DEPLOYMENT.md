# Deployment Guide - tst.creation.nl (Plesk)

Deze handleiding beschrijft hoe je Creation.nl deployment naar **tst.creation.nl** via Plesk.

## ⚠️ Belangrijk: Statische HTML Website

De huidige website is **volledig statisch HTML/CSS/JavaScript** en heeft **GEEN database of PHP nodig**.

**Wat betekent dit voor deployment:**
- Je hoeft **ALLEEN** de `public/` directory te uploaden
- Database setup is **OPTIONEEL** (zie onderaan voor toekomstig gebruik)
- PHP is **OPTIONEEL** (alleen nodig als je later dynamische features toevoegt)

---

## Snelle Start (Minimale Setup)

Voor een statische website volstaan deze stappen:

### Stap 1: Subdomain Aanmaken
1. Log in op **Plesk**
2. Ga naar **"Websites & Domains"**
3. Klik **"Add Subdomain"**
   - Subdomain: `tst`
   - Parent domain: `creation.nl`
   - Document root: `/httpdocs`

### Stap 2: Bestanden Uploaden

**Optie A: Via Git (Aanbevolen)**
```bash
ssh <gebruiker>@<server>
cd /var/www/vhosts/creation.nl/tst.creation.nl/httpdocs
git clone https://github.com/janvandermeer/creation-nl.git .
```

**Optie B: Via FTP/Plesk File Manager**
1. Upload de **volledige `public/` directory** naar `/httpdocs/`
2. Structuur moet zijn:
   ```
   /httpdocs/
   ├── index.html
   ├── portfolio.html
   ├── contact.html
   ├── css/
   ├── js/
   ├── images/
   ├── videos/
   └── ... (alle andere HTML bestanden)
   ```

### Stap 3: SSL Certificaat Activeren
1. Ga naar **"SSL/TLS Certificates"** in Plesk
2. Kies **"Install free Let's Encrypt certificate"**
3. Vink aan:
   - Assign certificate to domain
   - Permanent SEO-safe 301 redirect from HTTP to HTTPS
4. Klik **"Get it free"**

### Stap 4: Test de Website
Open **https://tst.creation.nl** in je browser en controleer:
- ✅ Homepage laadt correct
- ✅ Alle CSS/JS bestanden laden
- ✅ Afbeeldingen worden getoond
- ✅ Navigatie werkt
- ✅ SSL certificaat is actief (groene slot)

**Klaar!** Je statische website draait nu.

---

## Updates Deployen

### Via Git
```bash
cd /var/www/vhosts/creation.nl/tst.creation.nl/httpdocs
git pull origin main
```

### Via FTP
Upload alleen de gewijzigde bestanden naar `/httpdocs/`

---

## Optioneel: .htaccess voor Performance

Maak een `.htaccess` bestand aan in `/httpdocs/` voor betere performance:

```apache
# Prevent directory browsing
Options -Indexes

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching (1 jaar voor images, 1 maand voor CSS/JS)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Troubleshooting

### Website toont 404 error
- **Check of bestanden correct geüpload zijn** naar `/httpdocs/`
- **Verifieer dat `index.html` in de root staat**

### CSS/JS laden niet (witte pagina)
- **Open browser console** (F12) en kijk naar 404 errors
- **Controleer of `css/` en `js/` directories bestaan**
- **Check file permissions:** `chmod -R 755 /httpdocs/`

### Afbeeldingen laden niet
- **Verifieer dat `images/` directory compleet geüpload is**
- **Check file permissions:** `chmod -R 755 /httpdocs/images/`

### SSL werkt niet
- **Wacht 5-10 minuten** na Let's Encrypt installatie
- **Controleer in Plesk** of certificaat actief is

---

## 🔮 Toekomstig: Database & PHP Setup (Optioneel)

Als je later dynamische features wilt toevoegen (formulieren, CMS, etc.), dan heb je database nodig:

### Database Aanmaken in Plesk

1. **Ga naar "Databases"**
2. **Klik "Add Database"**
3. **Vul in:**
   - Database: `creation_tst`
   - User: `creation_tst`
   - Wachtwoord: Genereer sterk wachtwoord
   - **NOTEER DEZE GEGEVENS**

### PHP Configureren

1. **Ga naar "PHP Settings"** voor tst.creation.nl
2. **Stel in:**
   - PHP versie: **8.2**
   - Memory limit: **256M**

3. **Enable extensies:**
   - mysqli, pdo, pdo_mysql
   - curl, mbstring, openssl

### Configuratie Bestand Setup

1. **Upload ook `src/` directory** naar server (buiten httpdocs!)
   ```
   /var/www/vhosts/creation.nl/tst.creation.nl/
   ├── httpdocs/          # Web root (public/)
   └── src/               # Backend code (niet publiek toegankelijk)
       ├── config/
       └── includes/
   ```

2. **Kopieer config template:**
   ```bash
   cd /var/www/vhosts/creation.nl/tst.creation.nl
   cp src/config/config.production.php src/config/config.php
   ```

3. **Edit config.php** met database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'creation_tst');
   define('DB_USER', 'creation_tst');
   define('DB_PASS', 'JE_WACHTWOORD');
   ```

4. **Maak logs directory:**
   ```bash
   mkdir -p logs
   chmod 755 logs
   ```

### Wijzig Document Root (voor PHP files)

Als je PHP bestanden wilt gebruiken in `public/`:
1. Plesk → Hosting Settings
2. Document root wijzigen naar: `httpdocs/public`
3. Dan upload je alles naar `httpdocs/`:
   ```
   /httpdocs/
   ├── public/     # Web root
   ├── src/        # Backend
   └── logs/       # Error logs
   ```

---

## Samenvatting

**Voor NU (statische HTML):**
- ✅ Upload `public/` → `/httpdocs/`
- ✅ Activeer SSL certificaat
- ✅ Klaar!

**Voor LATER (dynamische features):**
- 📦 Maak database aan
- ⚙️ Configureer PHP 8.2
- 🔧 Setup config.php met database credentials
- 📁 Upload ook `src/` directory

---

## Links

- **Test website:** https://tst.creation.nl
- **GitHub:** https://github.com/janvandermeer/creation-nl
- **Lokaal development:** http://localhost:3033 (via Docker)
