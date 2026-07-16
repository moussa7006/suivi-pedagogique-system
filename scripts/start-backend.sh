#!/bin/bash
# ============================================================
#  EduTrack - Script de lancement BACKEND
#  Usage: ./scripts/start-backend.sh
# ============================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend/edutrack"

echo "============================================"
echo "  EduTrack - Demarrage BACKEND (Spring Boot)"
echo "============================================"
echo ""

cd "$BACKEND_DIR"

echo ">>> Compilation..."
mvn compile -q

echo ">>> Lancement sur http://localhost:8099 ..."
echo "    Swagger: http://localhost:8099/swagger-ui.html"
echo ""
mvn spring-boot:run
