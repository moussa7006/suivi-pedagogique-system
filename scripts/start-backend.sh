#!/bin/bash
cd /home/aya97/suivi-pedagogique-system/backend/edutrack
nohup mvn spring-boot:run > /tmp/backend.log 2>&1 &
echo "Backend PID: $!"
