# E-mail Formulieren Setup - Creation.nl

Deze documentatie beschrijft de e-mail formulier implementatie voor Creation.nl.

## Overzicht

Het project heeft nu **2 werkende formulieren**:
1. **Contactformulier** ([contact.html](public/contact.html))
2. **HTML5 Banner Offerte formulier** ([banners/offerte-banners.html](public/banners/offerte-banners.html) en [banners/html5-banners.html](public/banners/html5-banners.html))

## Technologie

De implementatie volgt **exact dezelfde techniek als XAM.nl**:
- ✅ PHPMailer (via Composer)
- ✅ Fallback naar native PHP `mail()` functie
- ✅ **Geen SMTP** - gebruikt server's lokale mail functie
- ✅ Development mode: emails disabled (alleen logging)
- ✅ Production mode: emails enabled

## Architectuur

### Bestandsstructuur

```
creation-nl/
├── composer.json              # PHPMailer dependency
├── vendor/                    # Composer packages (PHPMailer)
│   └── phpmailer/
├── src/
│   ├── config/
│   │   ├── config.php         # Development configuratie
│   │   └── config.production.php  # Productie configuratie
│   └── includes/
│       ├── email-functions.php    # Email functies
│       └── database.php
├── public/
│   ├── api/
│   │   ├── contact.php        # Contact form API endpoint
│   │   └── banner-offerte.php # Banner offerte API endpoint
│   ├── js/
│   │   └── forms.js           # Frontend formulier handling
│   ├── contact.html
│   └── banners/
│       ├── offerte-banners.html
│       └── html5-banners.html
└── logs/
    └── php-errors.log         # Error logging (productie)
```

## E-mail Configuratie

### Development ([src/config/config.php](src/config/config.php))

```php
define('MAIL_FROM_EMAIL', 'info@creation.nl');
define('MAIL_FROM_NAME', 'Creation Online Marketing');
define('ADMIN_EMAIL', 'info@creation.nl');
define('USE_SMTP', false);
define('MAIL_DISABLE', true);  // ✅ Emails disabled in development
```

**Development gedrag:**
- Emails worden NIET verzonden
- Alleen logging naar error_log
- Formulieren werken wel (return success)

### Productie ([src/config/config.production.php](src/config/config.production.php))

```php
define('MAIL_FROM_EMAIL', 'info@creation.nl');
define('MAIL_FROM_NAME', 'Creation Online Marketing');
define('ADMIN_EMAIL', 'info@creation.nl');
define('USE_SMTP', false);
define('MAIL_DISABLE', false);  // ✅ Emails enabled in production
```

**⚠️ BELANGRIJK:** Pas `ADMIN_EMAIL` aan naar het juiste e-mailadres waar formulieren naartoe moeten!

## E-mail Functies

### Contactformulier

**Wat gebeurt er:**
1. Gebruiker vult formulier in op [contact.html](public/contact.html)
2. JavaScript [forms.js](public/js/forms.js) submit naar [api/contact.php](public/api/contact.php)
3. PHP valideert data + spam protection (honeypot + rate limiting)
4. **2 emails** worden verzonden:
   - ✅ Email naar **admin** (ADMIN_EMAIL) met contactgegevens
   - ✅ **Bevestigingsmail** naar klant
5. Redirect naar [contact-bedankt.html](public/contact-bedankt.html)

**Velden:**
- Naam (verplicht)
- E-mailadres (verplicht)
- Telefoonnummer (verplicht)
- Bericht (optioneel)

### Banner Offerte Formulier

**Wat gebeurt er:**
1. Gebruiker vult formulier in op offerte pagina
2. JavaScript submit naar [api/banner-offerte.php](public/api/banner-offerte.php)
3. PHP valideert data
4. **2 emails** worden verzonden:
   - ✅ Email naar **admin** met offerte details
   - ✅ **Bevestigingsmail** naar klant
5. Success message wordt getoond

**Velden:**
- Naam (verplicht)
- E-mailadres (verplicht)
- Telefoonnummer (verplicht)
- Bedrijf (optioneel - default: "Particulier")
- Banner formaten (checkboxes)
- Aantal banners (optioneel)
- Aanvullende informatie (optioneel)

## Security Features

### 1. Honeypot Spam Protection
Beide formulieren hebben een **hidden "website" field**:
```html
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
```
- Onzichtbaar voor echte gebruikers
- Bots vullen dit automatisch in
- Als ingevuld → formulier wordt stil genegeerd (spammer weet het niet)

### 2. Rate Limiting
- Max 1 submission per **60 seconden** per gebruiker (sessie)
- Voorkomt spam door dezelfde persoon

### 3. Input Validation
- Server-side validatie van alle velden
- Email format validatie
- XSS protectie (htmlspecialchars)
- SQL injection protectie niet nodig (geen database queries voor forms)

### 4. Security Headers
Beide API endpoints gebruiken:
```php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
```

## Testing

### Lokaal Testen (Development)

1. **Start Docker container:**
   ```bash
   docker-compose up -d
   ```

2. **Open website:**
   ```
   http://localhost:3033/contact.html
   ```

3. **Vul formulier in en submit**

4. **Check logs:**
   ```bash
   docker-compose logs -f web
   ```

   Je ziet:
   ```
   EMAIL DISABLED (dev mode) - Would send to: info@creation.nl | Subject: Nieuw contactformulier bericht van Jan
   ```

5. **Formulier werkt!** (maar emails worden niet echt verzonden)

### Productie Testen (tst.creation.nl)

1. **Upload alle bestanden naar Plesk** (zie [DEPLOYMENT.md](DEPLOYMENT.md))

2. **Zorg dat PHP 8.2 actief is** in Plesk

3. **Check of `vendor/` directory bestaat** op server:
   ```bash
   ssh user@server
   cd /var/www/vhosts/creation.nl/tst.creation.nl/httpdocs
   ls -la vendor/phpmailer
   ```

   Als vendor niet bestaat:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

4. **Test formulier** op https://tst.creation.nl/contact.html

5. **Check of email aankomt** op info@creation.nl (of ingesteld ADMIN_EMAIL)

6. **Check PHP errors** (als iets fout gaat):
   ```bash
   tail -f logs/php-errors.log
   ```

## Troubleshooting

### Emails komen niet aan

**Probleem:** Formulier submit is successful, maar geen email ontvangen.

**Mogelijke oorzaken:**

1. **Server's mail() functie is niet geconfigureerd**
   - Check met Plesk support of mail() functie werkt
   - Test met simpel script:
     ```php
     <?php mail('jouw@email.nl', 'Test', 'Test bericht'); ?>
     ```

2. **SPF/DKIM records niet correct**
   - Emails kunnen in spam terechtkomen
   - Check DNS records van creation.nl domein
   - Voeg SPF record toe als die er niet is

3. **Foutieve FROM email**
   - Sommige servers accepteren alleen `@creation.nl` als FROM adres
   - Check [config.php](src/config/config.php): `MAIL_FROM_EMAIL`

4. **PHP errors**
   - Check `logs/php-errors.log`
   - Check Plesk error logs

### Formulier geeft error

**Probleem:** Rood error bericht bij submit

**Debug stappen:**

1. **Open browser console** (F12)
   - Zie je 404 errors? → API endpoint niet bereikbaar
   - Zie je 500 errors? → PHP error in API endpoint

2. **Check API endpoint direct:**
   ```
   https://tst.creation.nl/api/contact.php
   ```
   Zou moeten geven:
   ```json
   {"success":false,"message":"Method not allowed"}
   ```

3. **Check PHP error log:**
   ```bash
   tail -50 logs/php-errors.log
   ```

4. **Test met minimal data** (vul alleen verplichte velden in)

### PHPMailer niet gevonden

**Probleem:** Error: "Class 'PHPMailer\PHPMailer\PHPMailer' not found"

**Oplossing:**
```bash
cd /var/www/vhosts/creation.nl/tst.creation.nl/httpdocs
composer install --no-dev
```

### Rate limit triggert te vaak

**Probleem:** "Je hebt dit formulier recent al verzonden"

**Oplossing:** Pas rate limit aan in API endpoints:
```php
// Van 60 naar 30 seconden bijvoorbeeld
$rate_limit_seconds = 30;
```

## E-mailadres Wijzigen

### Waar worden emails naartoe gestuurd?

Alle formulier emails gaan naar `ADMIN_EMAIL` gedefinieerd in config files.

### Wijzig ontvanger email:

**Development:**
Edit [src/config/config.php](src/config/config.php):
```php
define('ADMIN_EMAIL', 'jouwemail@creation.nl');
```

**Productie:**
Edit [src/config/config.production.php](src/config/config.production.php):
```php
define('ADMIN_EMAIL', 'jouwemail@creation.nl');
```

Upload naar server en de wijziging is actief!

### Wijzig afzender email:

```php
define('MAIL_FROM_EMAIL', 'noreply@creation.nl');
define('MAIL_FROM_NAME', 'Creation Website');
```

## Email Templates Aanpassen

Email templates zitten in [src/includes/email-functions.php](src/includes/email-functions.php).

**Bijvoorbeeld contactformulier email aanpassen:**

Edit functie `sendContactEmail()`:
```php
$body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Pas CSS aan */
        .header { background: #YOUR_COLOR; }
    </style>
</head>
<body>
    <!-- Pas HTML content aan -->
</body>
</html>
";
```

**Let op:** HTML emails moeten inline CSS gebruiken (geen externe stylesheets).

## Performance

De email sending is **non-blocking** in de browser (JavaScript AJAX), maar **blocking** op de server (PHP wacht tot mail() klaar is).

Voor hoge volumes (100+ emails/dag):
- Overweeg queue systeem (Redis + workers)
- Of gebruik SMTP service (SendGrid, Mailgun, etc.)

Voor Creation.nl (laag volume) is huidige setup perfect!

## Voordelen van Deze Setup

✅ **Simpel** - Geen SMTP credentials nodig
✅ **Werkt out-of-the-box** op shared hosting
✅ **Spam protection** - Honeypot + rate limiting
✅ **Bevestigingsmails** - Klant krijgt automatisch bevestiging
✅ **Development safe** - Geen accidentele emails in development
✅ **Fallback** - PHPMailer → native mail() als backup
✅ **Security** - Input validatie, XSS protectie, headers
✅ **Logging** - Alle emails worden gelogd

## Contact & Support

- **GitHub:** https://github.com/janvandermeer/creation-nl
- **Deployment guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Lokaal testen:** `docker-compose up -d` → http://localhost:3033
