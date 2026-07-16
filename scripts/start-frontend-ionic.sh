#!/bin/bash
# ============================================================
#  EduTrack - Script de lancement FRONTEND IONIC (mobile)
#  Usage: ./scripts/start-frontend-ionic.sh
# ============================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend-ionic"

echo "============================================"
echo "  EduTrack - Demarrage FRONTEND MOBILE"
echo "============================================"
echo ""

cd "$FRONTEND_DIR"

echo ">>> Lancement avec proxy vers http://localhost:8099/api ..."
echo "    Appuyez sur Ctrl+C pour arreter."
echo ""
npm start
