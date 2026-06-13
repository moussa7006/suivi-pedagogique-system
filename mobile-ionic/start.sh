#!/bin/bash

# ============================================
# Script de démarrage - Suivi Pédagogique Mobile
# ============================================

echo "🚀 Démarrage de l'application Suivi Pédagogique Mobile..."
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version 18 ou supérieure est requise. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Échec de l'installation des dépendances"
        exit 1
    fi
    echo "✅ Dépendances installées avec succès"
fi

# Vérifier Ionic CLI
if ! command -v ionic &> /dev/null; then
    echo "⚠️  Ionic CLI n'est pas installé globalement."
    echo "💡 Pour une meilleure expérience, installez Ionic CLI:"
    echo "   npm install -g @ionic/cli"
    echo ""
    echo "🚀 Lancement avec npm start..."
    npm start
else
    echo "✅ Ionic CLI $(ionic --version) détecté"
    echo ""
    echo "🚀 Lancement de l'application..."
    ionic serve
fi
