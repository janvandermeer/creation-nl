# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Creation.nl is een moderne HTML/CSS/JavaScript website met PHP backend functionaliteit voor formulieren. Het project draait lokaal met Docker en is deployment-ready voor Plesk hosting.

**Status:** ✅ Productie-ready voor tst.creation.nl

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend**: PHP 8.2
- **Email**: PHPMailer 6.9 (via Composer)
- **Webserver**: Apache
- **Database**: MySQL 8.0 (optioneel - niet gebruikt voor statische site)
- **Database Management**: PHPMyAdmin (development only)
- **Containerization**: Docker & Docker Compose (development only)
- **Deployment**: Plesk hosting (production)

## Essential Commands

### Docker Operations (Development)
```bash
# Start ontwikkelomgeving
docker-compose up -d

# Stop containers
docker-compose down

# View logs (handig voor debugging + email logging)
docker-compose logs -f web

# Rebuild na Dockerfile wijzigingen
docker-compose up -d --build

# Container status checken
docker-compose ps

# Restart specifieke service
docker-compose restart web
```

### Composer (Dependencies)
```bash
# Install dependencies (development)
composer install

# Install dependencies (production - optimized)
composer install --no-dev --optimize-autoloader

# Update dependencies
composer update
```

### Access Points

**Development:**
- **Website**: http://localhost:3033
- **Contact formulier**: http://localhost:3033/contact.html
- **Banner offerte**: http://localhost:3033/banners/offerte-banners.html
- **PHPMyAdmin**: http://localhost:8081 (database: `creation_db`, user: `creation_user`, password: `creation_password`)

**Production:**
- **Website**: https://tst.creation.nl
- **Contact formulier**: https://tst.creation.nl/contact.html
- **Banner offerte**: https://tst.creation.nl/banners/offerte-banners.html

**Repository:**
- **GitHub**: https://github.com/janvandermeer/creation-nl

## Architecture

### Directory Structure
```
creation-nl/
├── public/                    # Web root - 49 HTML pagina's
│   ├── index.html             # Homepage
│   ├── contact.html           # Contact (met werkend formulier)
│   ├── portfolio.html         # Portfolio
│   ├── api/                   # ⭐ API endpoints
│   │   ├── contact.php        # Contact formulier handler
│   │   └── banner-offerte.php # Banner offerte handler
│   ├── css/                   # Webflow stylesheets
│   │   ├── creation-2022.webflow.shared.*.min.css
│   │   └── widget.css
│   ├── js/                    # JavaScript
│   │   ├── forms.js           # ⭐ Formulier handling (AJAX)
│   │   ├── jquery-3.5.1.min.js
│   │   ├── webflow.*.js       # Webflow bundles
│   │   └── widget.js
│   ├── images/                # Afbeeldingen (28 bestanden)
│   ├── videos/                # Achtergrond video's
│   ├── banners/               # Banner pagina's (7 pagina's)
│   │   ├── offerte-banners.html  # Met werkend formulier
│   │   └── html5-banners.html    # Met werkend formulier
│   ├── internet-marketing/    # Marketing diensten (4 pagina's)
│   ├── kennisbank/            # Kennisbank artikelen (15 pagina's)
│   ├── onderwerp/             # Onderwerp pagina's (4 pagina's)
│   ├── portfolio/             # Portfolio projecten (9 pagina's)
│   ├── .htaccess              # ⭐ Performance & security
│   └── README.md
│
├── src/                       # Backend code
│   ├── config/
│   │   ├── config.php         # ⭐ Development configuratie
│   │   └── config.production.php  # ⭐ Productie template (niet in Git!)
│   └── includes/
│       ├── database.php       # Database connectie klasse (PDO)
│       └── email-functions.php # ⭐ Email functies (PHPMailer)
│
├── vendor/                    # Composer packages (PHPMailer)
│   └── phpmailer/phpmailer/
│
├── logs/                      # Error logging (production)
│   └── php-errors.log
│
├── backup-original/           # Originele PHP project bestanden
│
├── composer.json              # ⭐ PHPMailer dependency
├── composer.lock              # Composer lock file
├── docker-compose.yml         # Docker setup (development)
├── Dockerfile                 # PHP 8.2 + Apache
│
├── DEPLOYMENT.md              # ⭐ Plesk deployment guide
├── EMAIL-SETUP.md             # ⭐ Email formulieren documentatie
├── README.md                  # Project overview
└── claude.md                  # Dit bestand
```

## Email Formulieren

### Overzicht

Het project heeft **2 werkende email formulieren**:

1. **Contactformulier** ([contact.html](public/contact.html))
   - Velden: naam, email, telefoon, bericht
   - API: `/api/contact.php`

2. **Banner Offerte formulier** ([banners/offerte-banners.html](public/banners/offerte-banners.html))
   - Velden: naam, email, telefoon, bedrijf, formaten (checkboxes), aantal, bericht
   - API: `/api/banner-offerte.php`

### Email Technologie (XAM.nl Techniek)

**Geen SMTP** - Gebruikt server's native `mail()` functie:
```php
// PHPMailer met isMail() mode
$mail = new PHPMailer(true);
$mail->isMail();  // Gebruikt server's mail()
```

**Fallback:** Als PHPMailer niet beschikbaar is, valt terug naar native PHP `mail()`.

### Email Configuratie

**Development** ([src/config/config.php](src/config/config.php)):
```php
define('MAIL_FROM_EMAIL', 'info@creation.nl');
define('MAIL_FROM_NAME', 'Creation Online Marketing');
define('ADMIN_EMAIL', 'info@creation.nl');  // Waar formulieren naartoe gaan
define('USE_SMTP', false);
define('MAIL_DISABLE', true);  // ✅ Emails disabled in development
```

**Production** ([src/config/config.production.php](src/config/config.production.php)):
```php
define('MAIL_FROM_EMAIL', 'info@creation.nl');
define('MAIL_FROM_NAME', 'Creation Online Marketing');
define('ADMIN_EMAIL', 'info@creation.nl');
define('USE_SMTP', false);
define('MAIL_DISABLE', false);  // ✅ Emails enabled in production
```

### Email Functions ([src/includes/email-functions.php](src/includes/email-functions.php))

```php
sendEmail($to, $subject, $body, $altBody)           // Algemene email functie
sendContactEmail($data)                              // Contact naar admin
sendContactConfirmation($data)                       // Bevestiging naar klant
sendBannerOfferteEmail($data)                        // Banner offerte naar admin
sendBannerOfferteConfirmation($data)                 // Bevestiging naar klant
```

Alle emails gebruiken **professionele HTML templates** met inline CSS.

### API Endpoints

**[public/api/contact.php](public/api/contact.php)**
- Accepteert: POST requests (JSON response)
- Validatie: naam, email, telefoon, bericht
- Security: honeypot spam protectie + rate limiting (60 sec)
- Output: 2 emails (admin + klant bevestiging)

**[public/api/banner-offerte.php](public/api/banner-offerte.php)**
- Accepteert: POST requests (JSON response)
- Validatie: naam, email, telefoon, bedrijf, formaten, aantal
- Verzamelt: Banner formaten uit checkboxes
- Security: honeypot + rate limiting
- Output: 2 emails (admin + klant bevestiging)

### Frontend ([public/js/forms.js](public/js/forms.js))

- AJAX form submission (geen page reload)
- Real-time success/error messages
- Button disabled tijdens verzenden
- Auto-redirect na success (contact form)
- Compatibel met Webflow form structure
- Support voor beide formulieren

### Security Features

1. **Spam Protection**
   - Honeypot field (hidden `website` field)
   - Rate limiting (max 1 submission per 60 seconden)
   - Spam wordt stil genegeerd

2. **Input Validation**
   - Server-side validatie
   - Email format check (FILTER_VALIDATE_EMAIL)
   - XSS protectie (htmlspecialchars)
   - Required field validation

3. **Security Headers**
   ```php
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```

### Testing Email Formulieren

**Development (emails disabled):**
```bash
docker-compose up -d
# Open http://localhost:3033/contact.html
# Vul formulier in
# Check logs: docker-compose logs -f web
# Output: "EMAIL DISABLED (dev mode) - Would send to: info@creation.nl"
```

**Production (emails enabled):**
```bash
# Deploy naar tst.creation.nl
# Test formulier op https://tst.creation.nl/contact.html
# Check email inbox op ADMIN_EMAIL
# Check logs: tail -f logs/php-errors.log
```

## Database Connection Pattern (Optioneel)

Voor toekomstige dynamische features:

```php
require_once __DIR__ . '/../src/config/config.php';
require_once __DIR__ . '/../src/includes/database.php';

$database = new Database();
$conn = $database->getConnection();  // Returns PDO instance
```

De Database klasse gebruikt PDO met prepared statements voor veiligheid.

## Configuration

### [src/config/config.php](src/config/config.php) bevat:

**Database** (optioneel voor statische site):
- Database credentials (host: `db` - container naam voor Docker)
- Site instellingen (SITE_NAME, SITE_URL)

**Email** (verplicht voor formulieren):
- MAIL_FROM_EMAIL, MAIL_FROM_NAME
- ADMIN_EMAIL (waar formulieren naartoe gaan)
- MAIL_DISABLE (true/false voor dev/prod)

**General:**
- Environment mode (development/production)
- Error reporting configuratie
- Timezone: Europe/Amsterdam

### Development vs Production Mode

**Development:**
- `ENVIRONMENT = 'development'`
- Full error reporting enabled
- **Emails disabled** (MAIL_DISABLE = true)
- Database host: `db` (Docker container)
- Site URL: http://localhost:3033

**Production:**
- `ENVIRONMENT = 'production'`
- Error reporting to logs only
- **Emails enabled** (MAIL_DISABLE = false)
- Database host: `localhost` (server)
- Site URL: https://tst.creation.nl

## Deployment

### Productie Deployment naar Plesk

**Volledige guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick steps:**
1. Maak subdomain `tst.creation.nl` aan in Plesk
2. Clone repo: `git clone https://github.com/janvandermeer/creation-nl.git .`
3. Install dependencies: `composer install --no-dev --optimize-autoloader`
4. Copy config: `cp src/config/config.production.php src/config/config.php`
5. Edit `config.php` en vul database credentials + email settings in
6. Activeer Let's Encrypt SSL certificaat
7. Test formulieren!

**Belangrijk:**
- Website is statisch HTML - **geen database nodig** voor basic functionaliteit
- Database is **optioneel** voor toekomstige features
- Emails werken via server's `mail()` - geen SMTP setup nodig

### Performance & Security ([public/.htaccess](public/.htaccess))

```apache
# Gzip compressie voor snellere laadtijden
# Browser caching (1 jaar images, 1 maand CSS/JS)
# Security headers (X-Frame-Options, X-XSS-Protection)
# Directory browsing disabled
```

## Important Architectural Notes

1. **Statische Website**: Momenteel 100% statisch HTML - snel en veilig
2. **Email Formulieren**: Enige PHP functionaliteit (via API endpoints)
3. **Volume Mounts**: `public/` en `src/` gemount in Docker container
4. **Database Host**:
   - Development: `db` (Docker container naam)
   - Production: `localhost` (server)
5. **PDO Prepared Statements**: Voor toekomstige database queries
6. **Security**: `src/` staat buiten web root (niet publiek toegankelijk)
7. **PHP 8.2**: Alle code is PHP 8.2 compatibel
8. **No SMTP**: Email via server's native `mail()` functie

## Meta Data & SEO

### Meta Data Comparison Tool

**Script:** [compare-meta-data.js](compare-meta-data.js)

Vergelijkt alle meta titels en descriptions tussen lokaal en live:
```bash
node compare-meta-data.js
```

**Output:**
- Console progress updates
- [meta-data-comparison-report.md](meta-data-comparison-report.md)
- [meta-data-comparison.json](meta-data-comparison.json)

**Laatste check:** ✅ 49/49 pagina's perfect gelijk (100%)

### SEO Best Practices

- Alle 49 pagina's hebben unieke meta titles
- Alle pagina's hebben meta descriptions
- HTML5 semantic markup
- Responsive design (mobile-friendly)
- Fast loading (Gzip, caching, optimized images)

## Troubleshooting

### Port Conflicts (Development)

Als port 3033 of 8081 al in gebruik is:
```yaml
# docker-compose.yml
ports:
  - "3034:80"  # In plaats van 3033
```

### Email Formulieren Werken Niet

**Development:**
```bash
# Check of emails disabled zijn (normaal in dev)
grep MAIL_DISABLE src/config/config.php
# Output: define('MAIL_DISABLE', true);

# Check logs
docker-compose logs -f web | grep EMAIL
```

**Production:**
```bash
# Check PHP errors
tail -50 logs/php-errors.log

# Test server mail() functie
php -r "mail('test@example.com', 'Test', 'Test message');"

# Check config
grep MAIL_DISABLE src/config/config.php
# Output: define('MAIL_DISABLE', false);
```

### Database Connection Errors (Optioneel)

```bash
# Check of database container draait
docker-compose ps

# Bekijk database logs
docker-compose logs db

# Restart web container
docker-compose restart web
```

### Changes Niet Zichtbaar

```bash
# Check volume mounts
docker-compose config

# Hard restart
docker-compose down && docker-compose up -d

# Clear browser cache (Cmd+Shift+R / Ctrl+F5)
```

### PHPMailer Not Found

```bash
# Install Composer dependencies
composer install

# Check vendor directory
ls -la vendor/phpmailer

# Productie: optimized install
composer install --no-dev --optimize-autoloader
```

## Coding Guidelines

### General

- **Taal**: Nederlandse taal voor content en UI
- **Code comments**: Engels voor technische documentatie
- **Responsive Design**: Alle nieuwe UI moet responsive zijn
- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Security (KRITISCH!)

- **XSS Preventie**:
  - Escape output met `htmlspecialchars()`
  - Valideer alle user input

- **SQL Injection Preventie**:
  - Gebruik prepared statements voor DB queries
  - NOOIT direct user input in queries

- **Email Security**:
  - Valideer email addresses (FILTER_VALIDATE_EMAIL)
  - Honeypot voor spam protectie
  - Rate limiting

- **Headers**:
  - X-Frame-Options, X-XSS-Protection
  - Content-Type: application/json voor API's

### PHP

- **Version**: PHP 8.2 syntax en features
- **Database**: PDO met prepared statements
- **Email**: PHPMailer voor email functionaliteit
- **Error Handling**: Try-catch blocks, proper error logging
- **Code Style**: PSR-12 coding standard

### JavaScript

- **No Framework**: Vanilla JavaScript (geen jQuery dependencies voor nieuwe code)
- **ES6+**: Moderne JavaScript syntax
- **AJAX**: XMLHttpRequest of Fetch API
- **Error Handling**: Proper try-catch blocks

### CSS

- **Existing styles**: Gebruik Webflow CSS waar mogelijk
- **New styles**: Inline CSS voor emails, external voor pagina's
- **Responsive**: Mobile-first approach
- **Performance**: Minified CSS in productie

## Documentation

### Project Documentation

- **README.md**: Project overview en quick start
- **DEPLOYMENT.md**: Volledige Plesk deployment guide
- **EMAIL-SETUP.md**: Email formulieren setup en troubleshooting
- **claude.md**: Dit bestand - development guide

### Code Documentation

- **Email functions**: Gedetailleerde PHPDoc comments
- **API endpoints**: Header comments met usage examples
- **Config files**: Inline comments voor alle settings

### External Documentation

- **PHPMailer**: https://github.com/PHPMailer/PHPMailer
- **Webflow**: https://webflow.com/
- **Docker**: https://docs.docker.com/

## Git Workflow

### Branches

- **main**: Production-ready code (deployed naar tst.creation.nl)

### Commits

- Gebruik descriptive commit messages
- Verwijs naar issue numbers (#1, #2, etc.)
- Inclusief "Co-Authored-By: Claude" waar van toepassing

### GitHub Issues

- **#1**: Plesk deployment configuratie ✅ Closed
- **#2**: Meta data vergelijking ✅ Closed
- **#3**: Email formulieren implementatie ✅ Closed

## Testing Checklist

### Voor Deployment

- [ ] Composer dependencies geïnstalleerd
- [ ] Config.php aangepast voor productie
- [ ] ADMIN_EMAIL correct ingesteld
- [ ] .htaccess aanwezig in public/
- [ ] Logs directory aangemaakt (chmod 755)
- [ ] Git credentials verwijderd uit config files

### Na Deployment

- [ ] Website laadt correct (https://tst.creation.nl)
- [ ] SSL certificaat actief (groene slot)
- [ ] Contactformulier werkt
- [ ] Banner offerte formulier werkt
- [ ] Emails aankomen op ADMIN_EMAIL
- [ ] Bevestigingsmails naar klanten werken
- [ ] Error logs checken (logs/php-errors.log)
- [ ] Meta data correct (alle pagina's)

## Support & Contact

- **GitHub**: https://github.com/janvandermeer/creation-nl
- **Issues**: https://github.com/janvandermeer/creation-nl/issues
- **Email**: info@creation.nl (productie)

## Version History

- **v1.0** - Statische website met werkende email formulieren
- **v0.9** - Meta data verification (100% match)
- **v0.8** - Plesk deployment configuratie
- **v0.7** - PHPMailer implementatie
- **v0.5** - Volledige website scrape (49 pagina's)
- **v0.1** - Initial project setup
