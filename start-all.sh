#!/bin/bash
# ============================================
#  EduTrack - Lancement BACKEND + FRONTEND
# ============================================

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║          EDU TRACK - DÉMARRAGE          ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""

# Lancer le backend en arrière-plan
echo "🔧 Lancement du backend..."
JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-17.0.20.8-hotspot"
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"

cd backend/edutrack
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ../..

# Attendre que le backend soit prêt
echo "⏳ Attente du backend..."
sleep 25

# Lancer le frontend
echo "🌐 Lancement du frontend..."
cd frontend-ionic
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║         TOUT EST LANCÉ !                ║"
echo "  ╠══════════════════════════════════════════╣"
echo "  ║  Backend  → http://localhost:8099       ║"
echo "  ║  Frontend → http://localhost:4200       ║"
echo "  ║  Swagger  → http://localhost:8099/swagger-ui.html"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "Ctrl+C pour tout arrêter."

wait
