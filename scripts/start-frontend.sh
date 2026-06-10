#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

nohup npm --prefix frontend-web start -- --host 0.0.0.0 --port 4200 > frontend-web-run.log 2>&1 &
echo "Frontend PID: $!"
echo "Logs: $ROOT_DIR/frontend-web-run.log"
