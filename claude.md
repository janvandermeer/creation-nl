# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Creation.nl is een moderne HTML/CSS/PHP website die lokaal draait met Docker. Het project gebruikt PHP 8.2, MySQL 8.0, en Apache als webserver.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 8.2
- **Webserver**: Apache
- **Database**: MySQL 8.0
- **Database Management**: PHPMyAdmin
- **Containerization**: Docker & Docker Compose

## Essential Commands

### Docker Operations
```bash
# Start ontwikkelomgeving
docker-compose up -d

# Stop containers
docker-compose down

# View logs (handig voor debugging)
docker-compose logs -f

# Rebuild na Dockerfile wijzigingen
docker-compose up -d --build

# Container status checken
docker-compose ps

# Restart specifieke service
docker-compose restart web
```

### Access Points
- **Website**: http://localhost:3033
- **PHPMyAdmin**: http://localhost:8081 (database: `creation_db`, user: `creation_user`, password: `creation_password`)
- **GitHub**: https://github.com/janvandermeer/creation-nl

## Architecture

### Directory Structure
```
public/                 # Web root - Volledige Creation.nl kopie (15 pagina's)
  ├── index.html        # Homepage
  ├── portfolio.html    # Portfolio
  ├── contact.html      # Contact
  ├── css/              # Webflow stylesheets
  ├── js/               # JavaScript (jQuery, Webflow)
  ├── images/           # Alle afbeeldingen (28 bestanden)
  ├── videos/           # Achtergrond video's
  ├── banners/          # Banner pagina's
  ├── internet-marketing/  # Marketing diensten
  └── [+7 andere pagina's]

src/                   # Backend code (voor toekomstig gebruik)
  ├── config/
  │   └── config.php   # Database configuratie
  └── includes/
      └── database.php # Database connectie klasse (PDO)

backup-original/       # Originele PHP project bestanden (backup)
```

### Database Connection Pattern
```php
require_once __DIR__ . '/../src/config/config.php';
require_once __DIR__ . '/../src/includes/database.php';

$database = new Database();
$conn = $database->getConnection();  // Returns PDO instance
```

De Database klasse gebruikt PDO met prepared statements voor veiligheid.

### Configuration
[src/config/config.php](src/config/config.php) bevat:
- Database credentials (host: `db` - container naam!)
- Site instellingen (SITE_NAME, SITE_URL)
- Environment mode (development/production)
- Error reporting configuratie
- Timezone: Europe/Amsterdam

### Development Mode
- Development mode is standaard actief (`ENVIRONMENT = 'development'`)
- Full error reporting enabled in development
- Wijzigingen in `public/` en `src/` zijn direct zichtbaar (hot reload)
- PHPMyAdmin beschikbaar voor database beheer

## Important Architectural Notes

1. **Volume Mounts**: `public/` en `src/` worden gemount in de container, dus wijzigingen zijn direct zichtbaar
2. **Database Host**: Gebruik `db` (niet `localhost`) - dit is de Docker container naam
3. **PDO Prepared Statements**: Alle database queries moeten prepared statements gebruiken
4. **Security**: `src/` staat buiten de web root voor veiligheid
5. **PHP 8.2 Syntax**: Code moet PHP 8.2 compatibel zijn

## Troubleshooting

### Port conflicts
Als port 8080 of 8081 al in gebruik is, wijzig de ports in [docker-compose.yml](docker-compose.yml):
```yaml
ports:
  - "8090:80"  # In plaats van 8080
```

### Database connection errors
```bash
# Check of database container draait
docker-compose ps

# Bekijk database logs
docker-compose logs db

# Mogelijk moet web container wachten - herstart:
docker-compose restart web
```

### Changes niet zichtbaar
```bash
# Check volume mounts
docker-compose config

# Hard restart
docker-compose down && docker-compose up -d
```

## Coding Guidelines

- **Taal**: Nederlandse taal voor content en UI
- **Security**: XSS en SQL injection preventie is kritisch
  - Gebruik prepared statements voor DB queries
  - Escape output met `htmlspecialchars()`
  - Valideer alle user input
- **PHP**: PHP 8.2 syntax en features gebruiken
- **Database**: PDO met prepared statements (NOOIT direct queries)
- **Responsive Design**: Alle nieuwe UI moet responsive zijn
- **CSS**: Gebruik bestaande CSS variabelen in [public/css/style.css](public/css/style.css)
