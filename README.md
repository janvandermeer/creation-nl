# Creation.nl

Een moderne HTML/CSS/PHP website met Docker ondersteuning.

## Vereisten

- Docker
- Docker Compose

## Installatie

1. Clone de repository:
```bash
git clone https://github.com/JOUW-GEBRUIKERSNAAM/creation-nl.git
cd creation-nl
```

2. Start de Docker containers:
```bash
docker-compose up -d
```

3. Open je browser en ga naar:
- Website: http://localhost:8080
- PHPMyAdmin: http://localhost:8081

## Database Credentials

- **Database**: creation_db
- **Gebruiker**: creation_user
- **Wachtwoord**: creation_password
- **Root wachtwoord**: root_password

## Project Structuur

```
creation-nl/
├── public/              # Publiek toegankelijke bestanden
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript bestanden
│   ├── images/         # Afbeeldingen
│   └── index.php       # Hoofdpagina
├── src/                # Backend PHP code
│   ├── config/         # Configuratie bestanden
│   └── includes/       # Herbruikbare PHP bestanden
├── docker-compose.yml  # Docker configuratie
├── Dockerfile          # PHP Apache container
└── README.md           # Deze file
```

## Docker Commando's

- **Start containers**: `docker-compose up -d`
- **Stop containers**: `docker-compose down`
- **Bekijk logs**: `docker-compose logs -f`
- **Herstart containers**: `docker-compose restart`

## Development

De website draait op PHP 8.2 met Apache. Wijzigingen in de `public/` en `src/` directories worden direct zichtbaar zonder de container te herstarten.

## License

Dit project is voor intern gebruik.
