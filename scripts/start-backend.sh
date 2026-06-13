#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

nohup backend/edutrack/mvnw -f backend/edutrack/pom.xml spring-boot:run > backend-run.log 2>&1 &
echo "Backend PID: $!"
echo "Logs: $ROOT_DIR/backend-run.log"
