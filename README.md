# EduTrack — Système de suivi pédagogique

EduTrack est une application de suivi pédagogique destinée à centraliser la gestion des séances, des emplois du temps, des émargements par QR code, des fiches de progression et des honoraires enseignants.

Le projet est organisé autour d’un backend Spring Boot et d’un frontend unique Ionic/Angular qui contient à la fois l’interface web d’administration et l’application mobile enseignant.

## Fonctionnalités principales

### Interface web administrateur

- Tableau de bord avec indicateurs et graphiques.
- Gestion des classes, matières, enseignants/utilisateurs, salles et référentiels.
- Gestion des emplois du temps et des séances.
- Génération et affichage des QR codes d’émargement.
- Écran public de salle pour afficher le QR code actif.
- Suivi des émargements et des fiches de progression.
- Calcul, suivi et export des honoraires enseignants.
- Import/export Excel et PDF selon les modules.

### Application mobile enseignant

- Connexion enseignant sécurisée par JWT.
- Tableau de bord mobile.
- Planning enseignant.
- Scan QR code pour émargement.
- Saisie du cahier de textes / fiche de progression.
- Historique des séances.
- Consultation du profil et des honoraires.
- Configuration de l’adresse du serveur backend pour usage sur téléphone.

## Architecture

```text
suivi-pedagogique-system/
├── backend/edutrack        # API Spring Boot
├── frontend-ionic          # Frontend Ionic/Angular web + mobile
├── docs                    # Documentation complémentaire
├── scripts                 # Scripts de développement
└── MEMOIRE                 # Documents académiques du projet
```

Les anciens dossiers `frontend-web` et `libs` ont été fusionnés dans `frontend-ionic` afin de garder une seule base frontend.

## Stack technique

### Backend

- Java 17
- Spring Boot 3.4
- Spring Web
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL en développement/production
- H2 pour les tests
- Apache POI pour Excel
- OpenPDF pour PDF
- Springdoc OpenAPI / Swagger

### Frontend

- Angular 21
- Ionic / Capacitor 8
- PrimeNG / PrimeIcons
- ApexCharts / Chart.js
- `angularx-qrcode`
- Application web admin et mobile enseignant dans le même projet Ionic

## Prérequis

- Java 17+
- Maven 3.9+ ou wrapper Maven fourni
- Node.js récent compatible Angular 21
- npm
- PostgreSQL
- Android Studio, uniquement pour générer/tester l’application Android

## Configuration backend

Le backend lit sa configuration depuis `backend/edutrack/src/main/resources/application.properties` et accepte les variables d’environnement suivantes :

| Variable | Défaut | Description |
| --- | --- | --- |
| `SERVER_PORT` | `8099` | Port HTTP du backend |
| `DB_URL` | `jdbc:postgresql://localhost:5432/db_suivipedago` | URL PostgreSQL |
| `DB_USERNAME` | `postgres` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | `1234` | Mot de passe PostgreSQL |
| `JPA_DDL_AUTO` | `update` | Stratégie Hibernate |
| `APP_JWT_SECRET` | valeur dev | Secret JWT, minimum 32 octets |
| `APP_JWT_EXPIRATION_MS` | `86400000` | Durée de validité JWT |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:4200,http://localhost:8100` | Origines autorisées |
| `APP_SEED_ADMIN_ENABLED` | `false` | Création automatique d’un admin |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | vide | Identifiants SMTP pour réinitialisation de mot de passe |

> En production, ne pas utiliser les valeurs par défaut pour `DB_PASSWORD`, `APP_JWT_SECRET` et le compte admin initial.

## Lancer le backend

Depuis la racine du projet :

```bash
cd backend/edutrack
./mvnw spring-boot:run
```

Sous Windows :

```bash
cd backend/edutrack
mvnw.cmd spring-boot:run
```

L’API démarre par défaut sur :

```text
http://localhost:8099
```

Swagger est disponible sur :

```text
http://localhost:8099/swagger-ui.html
```

## Lancer le frontend Ionic

Depuis la racine du projet :

```bash
cd frontend-ionic
npm install
npm start
```

Le proxy Angular redirige `/api` vers :

```text
http://localhost:8099
```

Interface web admin :

```text
http://localhost:4200/web/login
```

Application mobile en mode navigateur :

```text
http://localhost:4200/mobile/login
```

La route `/` ouvre l’interface web par défaut dans le navigateur.

## Utilisation mobile sur téléphone

Pour utiliser l’application mobile avec un backend lancé sur un ordinateur du même réseau Wi‑Fi :

1. Démarrer le backend sur l’ordinateur.
2. Vérifier l’adresse IP locale de l’ordinateur.
3. Depuis l’écran de connexion mobile, utiliser la configuration serveur.
4. Renseigner une adresse du type :

```text
192.168.1.15:8099/api
```

Capacitor est configuré pour autoriser HTTP en développement :

```ts
server: {
  cleartext: true,
  androidScheme: 'http'
}
```

## Générer l’APK Android

L’application Android utilise l’identifiant :

```text
com.edutrack.mobile
```

Workflow recommandé avec Android Studio :

```bash
cd frontend-ionic
npm run build
npx cap sync android
npx cap open android
```

Dans Android Studio, générer ensuite l’APK signé via :

```text
Build > Generate Signed App Bundle / APK > APK
```

## Routes importantes

| Route | Description |
| --- | --- |
| `/web/login` | Connexion admin web |
| `/web/dashboard` | Tableau de bord admin |
| `/web/seances` | Gestion des séances |
| `/web/salles` | Gestion des salles |
| `/web/salle-display/:token` | Écran public salle / QR actif |
| `/mobile/login` | Connexion enseignant mobile |
| `/mobile/tabs/tabs/tab1` | Tableau de bord mobile |
| `/mobile/scan-qr` | Scan QR enseignant |
| `/mobile/cahier-textes` | Fiche de progression |

## Tests

### Backend

Les tests backend utilisent le profil `test` et une base H2 en mémoire.

Depuis la racine :

```bash
cd backend/edutrack
./mvnw test
```

Sous Windows :

```bash
cd backend/edutrack
mvnw.cmd test
```

La suite couvre désormais :

- le chargement du contexte Spring Boot ;
- la génération, l’extraction et la validation des tokens JWT ;
- le rejet des secrets JWT trop courts ;
- la logique de mapping/persistance du service départements ;
- la génération automatique des tokens d’affichage des salles.

### Frontend

Build de validation :

```bash
cd frontend-ionic
npm run build
```

Tests Angular/Karma :

```bash
cd frontend-ionic
npm test
```

Selon l’environnement, les tests Karma peuvent nécessiter Chrome/Chromium disponible localement.

## Nettoyage du dépôt

Les artefacts générés et temporaires sont ignorés par Git :

- `node_modules/`
- `dist/`
- `.angular/cache/`
- `target/`
- `www/` selon les besoins de build local
- `tmp_*/`
- logs locaux

Les anciens dossiers temporaires `tmp_docx_edit` et `tmp_memoire_analysis` ont été supprimés et ajoutés au `.gitignore` pour éviter leur retour.

## Commandes utiles

Depuis la racine du projet :

```bash
# Build frontend
npm --prefix frontend-ionic run build

# Tests backend
cd backend/edutrack && ./mvnw test

# Démarrage frontend avec proxy
npm --prefix frontend-ionic start
```

## Notes de sécurité

- Ne jamais committer de secrets réels.
- Définir `APP_JWT_SECRET` en production avec une valeur forte.
- Définir `DB_PASSWORD`, `MAIL_USERNAME` et `MAIL_PASSWORD` via l’environnement.
- Désactiver ou contrôler strictement le seed admin en production.
- Remplacer `spring.jpa.hibernate.ddl-auto=update` par une stratégie maîtrisée (`validate`, Flyway ou Liquibase) en production.
