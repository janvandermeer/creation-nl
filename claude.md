# Creation.nl - Project Documentatie

## Project Overview

Creation.nl is een moderne HTML/CSS/PHP website die lokaal draait met Docker. Het project is opgezet voor ontwikkeling en testen van webfunctionaliteit.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 8.2
- **Webserver**: Apache
- **Database**: MySQL 8.0
- **Database Management**: PHPMyAdmin
- **Containerization**: Docker & Docker Compose

## Project Structuur

```
creation-nl/
├── .git/                    # Git repository
├── .gitignore              # Git ignore regels
├── .htaccess               # Apache configuratie
├── Dockerfile              # PHP Apache container definitie
├── apache-config.conf      # Apache virtual host config
├── docker-compose.yml      # Docker services definitie
├── README.md               # Project readme
├── claude.md               # Deze file - AI context
│
├── public/                 # Web root directory
│   ├── css/
│   │   └── style.css      # Hoofdstijlen
│   ├── js/
│   │   └── main.js        # Hoofd JavaScript
│   ├── images/            # Afbeeldingen directory
│   └── index.php          # Hoofdpagina
│
└── src/                   # Backend PHP code
    ├── config/
    │   └── config.php     # Database & app configuratie
    └── includes/
        └── database.php   # Database connectie klasse
```

## Docker Setup

### Services

1. **web** (Port 8080)
   - PHP 8.2 met Apache
   - Volumes: `./public` en `./src`
   - Extensies: mysqli, pdo, pdo_mysql

2. **db** (Port 3306)
   - MySQL 8.0
   - Database: `creation_db`
   - User: `creation_user`
   - Password: `creation_password`

3. **phpmyadmin** (Port 8081)
   - Web interface voor database beheer

### Docker Commando's

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build
```

## Toegang

- **Website**: http://localhost:8080
- **PHPMyAdmin**: http://localhost:8081
- **GitHub**: https://github.com/janvandermeer/creation-nl

## Development Workflow

1. **Code aanpassingen**: Bewerk bestanden in `public/` of `src/`
2. **Testen**: Wijzigingen zijn direct zichtbaar (geen container restart nodig)
3. **Git workflow**:
   ```bash
   git add .
   git commit -m "Beschrijving van wijzigingen"
   git push
   ```

## Database Configuratie

Configuratie is te vinden in [src/config/config.php](src/config/config.php):

- **DB_HOST**: `db` (container naam)
- **DB_NAME**: `creation_db`
- **DB_USER**: `creation_user`
- **DB_PASS**: `creation_password`

Database connectie voorbeeld:
```php
require_once __DIR__ . '/../src/config/config.php';
require_once __DIR__ . '/../src/includes/database.php';

$database = new Database();
$conn = $database->getConnection();
```

## Belangrijke Bestanden

### [public/index.php](public/index.php)
De hoofdpagina met HTML structuur en PHP integratie.

### [public/css/style.css](public/css/style.css)
CSS styling met:
- CSS variabelen voor kleuren
- Responsive design
- Modern layout

### [src/config/config.php](src/config/config.php)
Centrale configuratie voor:
- Database credentials
- Site instellingen
- Error reporting
- Timezone

### [docker-compose.yml](docker-compose.yml)
Definieert alle Docker services en hun configuratie.

## Ontwikkel Tips

1. **Environment**: Development mode is standaard actief (zie config.php)
2. **Error Reporting**: Volledige errors zichtbaar in development
3. **Hot Reload**: Frontend wijzigingen direct zichtbaar
4. **Database**: Gebruik PHPMyAdmin voor database beheer
5. **Logs**: Bekijk container logs met `docker-compose logs -f`

## Troubleshooting

### Port al in gebruik
```bash
# Verander ports in docker-compose.yml
ports:
  - "8090:80"  # In plaats van 8080
```

### Database connectie fout
- Check of db container draait: `docker-compose ps`
- Controleer credentials in config.php
- Wait for database: mogelijk moet web container herstarten

### Bestand wijzigingen niet zichtbaar
- Check of volumes correct gemount zijn
- Restart containers: `docker-compose restart`

## Volgende Stappen

- [ ] Contact formulier toevoegen
- [ ] Admin panel ontwikkelen
- [ ] User authenticatie implementeren
- [ ] Content Management Systeem bouwen
- [ ] API endpoints toevoegen

## Notes voor AI Assistenten

- Project gebruikt PHP 8.2 syntax
- Database queries via PDO (prepared statements)
- Responsive design is belangrijk
- Code moet veilig zijn (XSS, SQL injection preventie)
- Nederlandse taal voor content
