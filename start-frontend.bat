@echo off
REM ============================================
REM  EduTrack - Lancement rapide FRONTEND (Windows)
REM ============================================

echo 🌐 Démarrage du frontend EduTrack...
echo    Admin web → http://localhost:4200/web/login
echo    Mobile    → http://localhost:4200/mobile/login
echo.

cd frontend-ionic
call npm start
pause
