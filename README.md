# EduTrack — Système de suivi pédagogique

EduTrack est une application de suivi pédagogique et de gestion des activités enseignants. Le dépôt contient une API Spring Boot, une interface web d'administration Angular et une application mobile Ionic destinée aux enseignants.

## Structure du dépôt

```text
suivi-pedagogique-system/
├── backend/edutrack        # API REST Spring Boot
├── frontend-web            # Frontend web administrateur Angular
├── mobile-ionic            # Application mobile Ionic/Angular
├── scripts                 # Scripts de lancement et de test locaux
├── MEMOIRE                 # Documents de mémoire/rapport
└── src                     # Ancien squelette Angular à confirmer/nettoyer
```

## Prérequis

- Java 17
- Maven Wrapper inclus dans `backend/edutrack/mvnw`
- Node.js compatible Angular 20/21
- npm
- PostgreSQL

## Base de données

Créer une base PostgreSQL locale :

```sql
CREATE DATABASE db_suivipedago;
```

Par défaut, le backend utilise :

```text
DB_URL=jdbc:postgresql://localhost:5432/db_suivipedago
DB_USERNAME=postgres
DB_PASSWORD=1234
```

Ces valeurs peuvent être remplacées par variables d'environnement.

## Configuration backend

Fichier principal : `backend/edutrack/src/main/resources/application.properties`.

Un exemple de configuration est disponible dans `docs/backend-env.example`.

Variables disponibles :

| Variable | Défaut | Description |
| --- | --- | --- |
| `SERVER_PORT` | `8099` | Port HTTP Spring Boot |
| `DB_URL` | `jdbc:postgresql://localhost:5432/db_suivipedago` | URL PostgreSQL |
| `DB_USERNAME` | `postgres` | Utilisateur DB |
| `DB_PASSWORD` | `1234` | Mot de passe DB |
| `JPA_DDL_AUTO` | `update` | Mode Hibernate DDL |
| `JPA_SHOW_SQL` | `true` | Affichage SQL |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:4200,http://localhost:8100` | Origines CORS autorisées |
| `APP_SEED_ADMIN_ENABLED` | `true` | Création auto d'un administrateur par défaut |
| `APP_SEED_ADMIN_RESET_EXISTING` | `true` | Réinitialise le compte admin existant trouvé par email ou matricule |
| `APP_SEED_ADMIN_EMAIL` | `admin@edutrack.local` | Email admin par défaut |
| `APP_SEED_ADMIN_PASSWORD` | `ChangeMe123456!` | Mot de passe admin par défaut |
| `APP_JWT_SECRET` | clé locale longue | Clé de signature JWT, minimum 32 octets |
| `APP_JWT_EXPIRATION_MS` | `86400000` | Durée de validité JWT en millisecondes |

> En production, définir obligatoirement `DB_PASSWORD`, `APP_JWT_SECRET`, `APP_SEED_ADMIN_PASSWORD` et désactiver le seeding si nécessaire avec `APP_SEED_ADMIN_ENABLED=false`.

## Lancement

### Backend

```bash
backend/edutrack/mvnw -f backend/edutrack/pom.xml spring-boot:run
```

API :

```text
http://localhost:8099/api
```

Swagger :

```text
http://localhost:8099/swagger-ui.html
```

### Frontend web admin

```bash
npm --prefix frontend-web install
npm --prefix frontend-web start
```

Application :

```text
http://localhost:4200
```

### Mobile Ionic

```bash
npm --prefix mobile-ionic install
npm --prefix mobile-ionic start
```

Application :

```text
http://localhost:8100
```

## Tests et builds

Backend :

```bash
backend/edutrack/mvnw -f backend/edutrack/pom.xml test
```

Les tests backend utilisent le profil Spring `test` avec une base H2 en mémoire configurée dans `backend/edutrack/src/test/resources/application-test.properties`.

Frontend web :

```bash
npm --prefix frontend-web run build
```

Mobile Ionic :

```bash
npm --prefix mobile-ionic run build
```

## Fonctionnalités principales

- Authentification JWT
- Gestion des utilisateurs et enseignants
- Gestion des classes, matières, départements, filières, niveaux, salles et années universitaires
- Gestion des emplois du temps et séances
- Génération / scan QR code pour l'émargement
- Cahier de textes / fiches de progression
- Base de calcul des honoraires enseignants

## Notes de sécurité

- Ne jamais versionner de vrais secrets.
- La clé JWT par défaut est réservée au développement local.
- Restreindre `APP_CORS_ALLOWED_ORIGINS` aux domaines réels en production.
- Changer ou désactiver l'administrateur seedé avant déploiement.
- Le profil `test` utilise une base H2 en mémoire pour éviter que les tests touchent la base de développement.
