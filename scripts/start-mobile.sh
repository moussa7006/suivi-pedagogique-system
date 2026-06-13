#!/bin/bash
cd /home/aya97/suivi-pedagogique-system/mobile-ionic
nohup npx ng serve --port 8100 > /tmp/mobile.log 2>&1 &
echo "Mobile PID: $!"
