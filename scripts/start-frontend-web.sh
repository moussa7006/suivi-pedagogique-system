#!/bin/bash
# ============================================================
#  EduTrack - Script de lancement FRONTEND WEB (admin)
#  Usage: ./scripts/start-frontend-web.sh
# ============================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend-web"

echo "============================================"
echo "  EduTrack - Demarrage FRONTEND WEB ADMIN"
echo "============================================"
echo ""

cd "$FRONTEND_DIR"

echo ">>> Lancement sur http://localhost:4200 ..."
echo "    Appuyez sur Ctrl+C pour arreter."
echo ""
npm start
