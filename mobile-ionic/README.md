# Suivi Pédagogique - Application Mobile Ionic

Application mobile moderne pour la gestion pédagogique des enseignants, développée avec Ionic/Angular.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Ionic CLI (`npm install -g @ionic/cli`)

### Installation

1. **Installer les dépendances**
```bash
cd mobile-ionic
npm install
```

2. **Lancer l'application en développement**
```bash
ionic serve
```
L'application sera accessible à l'adresse : http://localhost:8100

### Builds de Production

**Pour le web :**
```bash
ionic build --prod
```

**Pour Android :**
```bash
ionic capacitor build android
```

**Pour iOS :**
```bash
ionic capacitor build ios
```

## 📱 Fonctionnalités

### Page de Connexion
- Interface épurée et moderne
- Validation des formulaires
- Suppression des boutons de test

### Tableau de Bord (Accueil)
- Statistiques en temps réel
- Volume horaire avec graphique circulaire
- Cartes de statistiques (séances, présence, planning)

### Profil Enseignant
- Informations complètes de l'enseignant
- Statistiques personnelles
- Bouton de déconnexion en bas de page
- Suppression du menu intégré

### Historique des Séances
- **NOUVEAU** : Filtrage par période (Tout/Semaine/Mois)
- Timeline chronologique des séances
- Statistiques rapides (séances réalisées, taux de présence)
- Détails complets par séance (matière, date, heure, contenu, présence)

### Cahier de Textes
- **REFAIT** : Design professionnel et moderne
- Formulaire de saisie ergonomique
- Statistiques (nombre de séances, séances validées)
- Cartes de séances avec en-tête dégradé
- Boutons d'action (Voir, Modifier)
- Gestion des ressources et supports

## 🎨 Design System

### Couleurs Modernes (Zéro Noir)
- **Primaire** : #4361ee (Bleu moderne)
- **Secondaire** : #3f37c9 (Indigo)
- **Succès** : #4cc9f0 (Cyan)
- **Avertissement** : #f77f00 (Orange)
- **Danger** : #f72585 (Rose)
- **Fond** : #f8f9fa (Gris très clair)

### Navigation
- Tab bar moderne avec effets de hover
- Icônes colorées (plus de noir)
- Transitions fluides
- Support du mode sombre

## 🛠️ Structure du Projet

```
mobile-ionic/
├── src/
│   ├── app/
│   │   ├── login/          # Page de connexion
│   │   ├── tab1/           # Accueil / Tableau de bord
│   │   ├── profile/        # Profil enseignant
│   │   ├── historique/     # Historique des séances (NOUVEAU)
│   │   ├── cahier-textes/  # Cahier de textes (REFAIT)
│   │   ├── tabs/           # Navigation principale
│   │   └── app.component.* # Composant racine
│   ├── global.scss         # Styles globaux
│   └── theme/              # Thème Ionic
├── capacitor.config.ts     # Configuration Capacitor
├── angular.json            # Configuration Angular
├── package.json            # Dépendances
└── ionic.config.json       # Configuration Ionic
```

## 🔄 Modifications Récentes

### Supprimé
- Page "Scanner QR" (remplacée par Historique)
- Boutons de test dans la page de login
- Menu dans le profil enseignant
- Footer avec boutons dans l'accueil

### Ajouté
- Page Historique avec timeline et filtres
- Bouton de déconnexion en bas du profil
- Statistiques rapides dans le cahier de textes
- Design moderne sans couleur noire

### Amélioré
- Cahier de textes entièrement refait
- Navigation avec icônes colorées
- Interface plus professionnelle
- Expérience utilisateur optimisée pour les enseignants

## 📱 Test sur Mobile

### Android
```bash
ionic capacitor run android
```

### iOS
```bash
ionic capacitor run ios
```

## 🔧 Développement

### Linter
```bash
npm run lint
```

### Tests unitaires
```bash
npm test
```

### Tests e2e
```bash
npm run e2e
```

## 📦 Déploiement

### Web (PWA)
```bash
ionic build --prod
# Déployer le dossier www/ sur un serveur web
```

### Mobile (Play Store / App Store)
1. Construire l'application
2. Signer l'APK/AAB (Android) ou l'IPA (iOS)
3. Soumettre aux stores respectifs

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur le repository.