#!/bin/bash
# ============================================
#  EduTrack - Lancement rapide du BACKEND
# ============================================

JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-17.0.20.8-hotspot"
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"

echo "🔧 Démarrage du backend EduTrack..."
echo "   API       → http://localhost:8099"
echo "   Swagger   → http://localhost:8099/swagger-ui.html"
echo ""

cd backend/edutrack
./mvnw spring-boot:run
