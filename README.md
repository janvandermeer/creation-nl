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
- Website: http://localhost:3033
- PHPMyAdmin: http://localhost:8081

## Database Credentials

- **Database**: creation_db
- **Gebruiker**: creation_user
- **Wachtwoord**: creation_password
- **Root wachtwoord**: root_password

## Project Structuur

```
creation-nl/
├── public/                      # Web root - VOLLEDIGE CREATION.NL KOPIE
│   ├── index.html              # Homepage
│   ├── portfolio.html          # Portfolio pagina
│   ├── contact.html            # Contact pagina
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript bestanden
│   ├── images/                 # Afbeeldingen (28 bestanden)
│   ├── videos/                 # Video's (MP4 + WebM)
│   ├── banners/                # Banner pagina's
│   ├── internet-marketing/     # Marketing diensten pagina's
│   └── [+7 andere HTML pagina's]
├── src/                        # Backend PHP code (voor toekomstig gebruik)
│   ├── config/                 # Configuratie bestanden
│   └── includes/               # Herbruikbare PHP bestanden
├── backup-original/            # Originele project bestanden (backup)
├── docker-compose.yml          # Docker configuratie
├── Dockerfile                  # PHP Apache container
├── download-full-site.js       # Script om volledige site te downloaden
├── fix-html-links.js          # Script om HTML links aan te passen
└── README.md                   # Deze file
```

## 🌐 Gedownloade Site

In `public/` staat een **100% complete lokale kopie** van creation.nl:

- ✅ **49 pagina's** (47 van sitemap + 2 bedankpagina's - VOLLEDIG!)
- ✅ **45+ resources** (CSS, JS, afbeeldingen, video's)
- ✅ **897 URL vervangingen** (alle externe links → lokale paden)
- ✅ **Volledig werkende navigatie**
- ✅ **Formulier bedankpagina's** (contact, offerte)
- ✅ **sitemap.xml** beschikbaar

### Gedownloade Categorieën
- **Homepage**: 1 pagina
- **Banners**: 6 pagina's (offerte, tarieven, voorbeelden, werkwijze, HTML5, Google Ads)
- **Internet Marketing**: 4 pagina's (SEO, SEA, conversie, websites)
- **Portfolio**: 9 pagina's (overzicht + 8 projectdetails)
- **Kennisbank**: 15 pagina's (overzicht + 14 artikelen)
- **Onderwerp**: 4 pagina's (banners, Google, Google Ads, SEO)
- **Overige**: 8 pagina's (contact, coaching, bureau, voorwaarden, etc.)
- **Bedankpagina's**: 2 pagina's (contact-bedankt, offerte-bedankt)

### Toegang
- **Lokaal**: `file:///Users/janvandermeer/Local Sites/creation-nl/public/index.html`
- **Via Docker**: http://localhost:3033/
- **Sitemap**: http://localhost:3033/sitemap.xml

**Originele project bestanden** zijn verplaatst naar `backup-original/`

## Docker Commando's

- **Start containers**: `docker-compose up -d`
- **Stop containers**: `docker-compose down`
- **Bekijk logs**: `docker-compose logs -f`
- **Herstart containers**: `docker-compose restart`

## Development

De website draait op PHP 8.2 met Apache. Wijzigingen in de `public/` en `src/` directories worden direct zichtbaar zonder de container te herstarten.

## License

Dit project is voor intern gebruik.
