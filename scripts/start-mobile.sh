#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

nohup npm --prefix mobile-ionic start -- --host 0.0.0.0 --port 8100 > mobile-ionic-run.log 2>&1 &
echo "Mobile PID: $!"
echo "Logs: $ROOT_DIR/mobile-ionic-run.log"
