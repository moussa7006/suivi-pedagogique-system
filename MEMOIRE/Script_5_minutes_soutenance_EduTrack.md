# Script oral — Soutenance EduTrack avec transition démo

Durée cible avant démo : environ 5 minutes. La démo peut ensuite durer 2 à 3 minutes selon les consignes du jury.

## Slide 1 — Bienvenue (20 s)
Bonjour Mesdames et Messieurs les membres du jury. Bienvenue à notre soutenance. Nous allons vous présenter EduTrack, notre système de suivi pédagogique et de gestion des honoraires des enseignants.

## Slide 2 — EduTrack en une phrase (30 s)
EduTrack centralise les données pédagogiques, automatise l’émargement par QR code et facilite le calcul des honoraires. Le système s’adresse principalement à l’administration et aux enseignants.

## Slide 3 — Problème (35 s)
Le problème initial est la gestion manuelle : feuilles de présence, fichiers dispersés, calculs d’honoraires manuels et manque de visibilité. Cela entraîne des erreurs, des retards et une faible traçabilité.

## Slide 4 — Solution (35 s)
Notre solution repose sur trois composants : une interface web d’administration, une API sécurisée et une application mobile enseignant. Cette séparation rend le système plus clair, maintenable et évolutif.

## Slide 5 — Fonctionnalités (40 s)
Le parcours principal est complet : planification d’une séance, génération du QR code, scan mobile, enregistrement de l’émargement, suivi de la progression pédagogique et calcul des honoraires.

## Slide 6 — Architecture (40 s)
Techniquement, le backend Spring Boot expose une API REST sécurisée par JWT. Les données sont centralisées dans PostgreSQL. Le web est développé avec Angular et le mobile avec Ionic.

## Slide 7 — QR code (35 s)
Le QR code permet de fiabiliser l’émargement. Le système vérifie la séance et l’enseignant, puis enregistre une présence horodatée. On sait donc qui a émargé, quand, et pour quelle séance.

## Slide 8 — Impact et perspectives (35 s)
EduTrack apporte trois bénéfices : fiabilité, gain de temps et transparence. Les perspectives sont le renforcement des tests, la sécurisation de la production, les notifications, le module étudiant et les analytics avancés.

## Slide 9 — Transition démo (10 s)
Nous allons maintenant basculer vers l’application pour montrer concrètement le parcours : connexion, séance, QR code, scan mobile et consultation de l’émargement.

## Démo live conseillée
1. Connexion administrateur.
2. Consultation ou création d’une séance.
3. Génération/affichage du QR code.
4. Scan depuis l’application mobile enseignant.
5. Retour sur l’administration : émargements ou honoraires.

## Slide 10 — Remerciements (10 s)
Merci pour votre attention. Nous sommes prêts à répondre à vos questions.
