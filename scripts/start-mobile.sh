#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

nohup npm --prefix frontend-ionic start -- --host 0.0.0.0 --port 8100 > frontend-ionic-run.log 2>&1 &
echo "Frontend Ionic PID: $!"
echo "Logs: $ROOT_DIR/frontend-ionic-run.log"
