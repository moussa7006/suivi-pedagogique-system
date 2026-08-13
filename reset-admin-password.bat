@echo off
REM ============================================
REM  EduTrack - Reset du mot de passe ADMIN
REM ============================================

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

REM Activer le seed admin pour reinitialiser le compte
set APP_SEED_ADMIN_ENABLED=true
set APP_SEED_ADMIN_RESET_EXISTING=true

echo 🔑 Reset du compte administrateur...
echo    Email    → admin@edutrack.local
echo    Password → Admin1234!
echo.
echo Apres le demarrage, connecte-toi avec ces identifiants.
echo Puis fais Ctrl+C pour arreter et relance normalement.
echo.

cd backend\edutrack
call mvnw.cmd spring-boot:run
pause
