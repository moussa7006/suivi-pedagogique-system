#!/bin/bash
cd /home/aya97/suivi-pedagogique-system/frontend-web
nohup npx ng serve --port 4200 > /tmp/frontend.log 2>&1 &
echo "Frontend PID: $!"
