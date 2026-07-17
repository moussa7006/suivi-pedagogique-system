#!/bin/bash
# ============================================================
#  EduTrack - Script TOUT LANCER
#  Lance le backend + le frontend Ionic (mobile + web admin)
#  dans des terminaux separes
#  Usage: ./scripts/start-all.sh
# ============================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "============================================"
echo "  EduTrack - Demarrage COMPLET"
echo "============================================"
echo ""
echo "Backend:     http://localhost:8099"
echo "Swagger UI:  http://localhost:8099/swagger-ui.html"
echo "Frontend:    http://localhost:8100"
echo "  - Mobile:  http://localhost:8100/mobile/login"
echo "  - Web:     http://localhost:8100/web/login"
echo ""
echo "Lancement dans 2 secondes..."
sleep 2

# Lancer le backend
echo ">>> Demarrage BACKEND..."
gnome-terminal --title="EduTrack BACKEND" -- bash -c "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run; exec bash" 2>/dev/null || \
xfce4-terminal --title="EduTrack BACKEND" -- bash -c "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run; exec bash" 2>/dev/null || \
xterm -title "EduTrack BACKEND" -e "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run" 2>/dev/null || \
echo ">>> BACKEND: Lancez manuellement dans un terminal :"
echo "    cd $PROJECT_DIR/backend/edutrack && mvn spring-boot:run"
echo ""

echo ">>> Attente du backend (5 secondes)..."
sleep 5

# Lancer le frontend Ionic (mobile + web admin dans un seul projet)
echo ">>> Demarrage FRONTEND IONIC (mobile + web admin)..."
gnome-terminal --title="EduTrack FRONTEND" -- bash -c "cd '$PROJECT_DIR/frontend-ionic' && npm start; exec bash" 2>/dev/null || \
xfce4-terminal --title="EduTrack FRONTEND" -- bash -c "cd '$PROJECT_DIR/frontend-ionic' && npm start; exec bash" 2>/dev/null || \
xterm -title "EduTrack FRONTEND" -e "cd '$PROJECT_DIR/frontend-ionic' && npm start" 2>/dev/null || \
echo ">>> FRONTEND: Lancez manuellement dans un terminal :"
echo "    cd $PROJECT_DIR/frontend-ionic && npm start"

echo ""
echo "============================================"
echo "  Tous les services sont lances !"
echo "============================================"
echo ""
echo "  Mobile:   http://localhost:8100/mobile/login"
echo "  Web Admin: http://localhost:8100/web/login"
echo "  Backend:  http://localhost:8099"