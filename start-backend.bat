@echo off
REM ============================================
REM  EduTrack - Lancement rapide BACKEND (Windows)
REM ============================================

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo 🔧 Démarrage du backend EduTrack...
echo    API       → http://localhost:8099
echo    Swagger   → http://localhost:8099/swagger-ui.html
echo.

cd backend\edutrack
call mvnw.cmd spring-boot:run
pause
