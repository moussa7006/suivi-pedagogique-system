#!/bin/bash
# ============================================================
#  EduTrack - Lancement BACKEND en arriere-plan (nohup + log)
#  Usage: bash scripts/start-backend-bg.sh
# ============================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/backend/edutrack"

nohup mvn spring-boot:run > "$ROOT_DIR/backend-run.log" 2>&1 &
echo "Backend PID: $!"
echo "Logs: $ROOT_DIR/backend-run.log"
echo "URL:   http://localhost:8099  (Swagger: /swagger-ui.html)"
