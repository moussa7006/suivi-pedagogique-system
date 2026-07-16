#!/bin/bash
# ============================================================
#  EduTrack - Script TOUT LANCER
#  Lance le backend + les 2 frontends dans des terminaux separes
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
echo "Web Admin:   http://localhost:4200"
echo "Mobile:      http://localhost:8100 (port variable si occupe)"
echo ""
echo "Lancement dans 2 secondes..."
sleep 2

# Lancer le backend en arriere-plan
echo ">>> Demarrage BACKEND..."
gnome-terminal --title="EduTrack BACKEND" -- bash -c "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run; exec bash" 2>/dev/null || \
xfce4-terminal --title="EduTrack BACKEND" -- bash -c "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run; exec bash" 2>/dev/null || \
xterm -title "EduTrack BACKEND" -e "cd '$PROJECT_DIR/backend/edutrack' && mvn spring-boot:run" 2>/dev/null || \
echo ">>> BACKEND: Lancez manuellement dans un terminal :"
echo "    cd $PROJECT_DIR/backend/edutrack && mvn spring-boot:run"
echo ""

echo ">>> Attente du backend (5 secondes)..."
sleep 5

# Lancer le frontend web admin
echo ">>> Demarrage FRONTEND WEB ADMIN..."
gnome-terminal --title="EduTrack WEB-ADMIN" -- bash -c "cd '$PROJECT_DIR/frontend-web' && npm start; exec bash" 2>/dev/null || \
xfce4-terminal --title="EduTrack WEB-ADMIN" -- bash -c "cd '$PROJECT_DIR/frontend-web' && npm start; exec bash" 2>/dev/null || \
xterm -title "EduTrack WEB-ADMIN" -e "cd '$PROJECT_DIR/frontend-web' && npm start" 2>/dev/null || \
echo ">>> WEB ADMIN: Lancez manuellement dans un terminal :"
echo "    cd $PROJECT_DIR/frontend-web && npm start"
echo ""

# Lancer le frontend mobile Ionic
echo ">>> Demarrage FRONTEND MOBILE..."
gnome-terminal --title="EduTrack MOBILE" -- bash -c "cd '$PROJECT_DIR/frontend-ionic' && npm start; exec bash" 2>/dev/null || \
xfce4-terminal --title="EduTrack MOBILE" -- bash -c "cd '$PROJECT_DIR/frontend-ionic' && npm start; exec bash" 2>/dev/null || \
xterm -title "EduTrack MOBILE" -e "cd '$PROJECT_DIR/frontend-ionic' && npm start" 2>/dev/null || \
echo ">>> MOBILE: Lancez manuellement dans un terminal :"
echo "    cd $PROJECT_DIR/frontend-ionic && npm start"

echo ""
echo "============================================"
echo "  Tous les services sont lances !"
echo "============================================"
