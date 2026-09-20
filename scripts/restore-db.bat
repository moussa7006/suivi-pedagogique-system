@echo off
REM ============================================================
REM  EduTrack - Restauration PostgreSQL depuis un dump SQL
REM  ------------------------------------------------------------
REM  Usage : restore-db.bat <fichier-sauvegarde.sql>
REM    Ex. : restore-db.bat "D:\backups\edutrack\edutrack_20260917_180000.sql"
REM
REM  AVERTISSEMENT : REMPLACE toutes les donnees de la base.
REM  Les connexions actives (backend) sont deconnectees.
REM  Redemarrer le backend apres la restauration.
REM
REM  Variables surchargeables : DB_HOST, DB_PORT, DB_USER,
REM  DB_NAME, PGPASSWORD, PG_BIN.
REM ============================================================
setlocal

if "%~1"=="" (
  echo Usage : %~nx0 ^<fichier-sauvegarde.sql^>
  echo   Ex. : %~nx0 "D:\backups\edutrack\edutrack_20260917_180000.sql"
  exit /b 1
)
set "BACKUP_FILE=%~f1"
if not exist "%BACKUP_FILE%" (
  echo [ERREUR] Fichier introuvable : %BACKUP_FILE%
  exit /b 1
)

REM ---------- Configuration ----------
if not defined DB_HOST    set "DB_HOST=localhost"
if not defined DB_PORT    set "DB_PORT=5432"
if not defined DB_USER    set "DB_USER=postgres"
if not defined DB_NAME    set "DB_NAME=db_suivipedago"
if not defined PGPASSWORD set "PGPASSWORD=1234"
set "PGCLIENTENCODING=UTF8"

REM ---------- Localisation de psql ----------
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" set "PG_BIN=C:\Program Files\PostgreSQL\18\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" set "PG_BIN=C:\Program Files\PostgreSQL\17\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set "PG_BIN=C:\Program Files\PostgreSQL\16\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set "PG_BIN=C:\Program Files\PostgreSQL\15\bin"
if not defined PG_BIN (
  for /f "delims=" %%i in ('where psql.exe 2^>nul') do set "PG_BIN=%%~dpi"
)
if not defined PG_BIN (
  echo [ERREUR] psql introuvable. Definir PG_BIN vers le dossier bin de PostgreSQL.
  exit /b 1
)
set "PSQL=%PG_BIN%\psql.exe"
if not exist "%PSQL%" set "PSQL=%PG_BIN%psql.exe"

echo.
echo ############################################################
echo  Restauration de la base "%DB_NAME%" depuis :
echo    %BACKUP_FILE%
echo  ATTENTION : toutes les donnees actuelles seront remplacees.
echo ############################################################
set /p "CONFIRM=Taper OUI pour continuer : "
if /i not "%CONFIRM%"=="OUI" (
  echo Restauration annulee.
  exit /b 0
)

REM ---------- Deconnexion des clients + recreation de la base ----------
"%PSQL%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='%DB_NAME%' AND pid <> pg_backend_pid();" >nul
"%PSQL%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d postgres -c "DROP DATABASE IF EXISTS %DB_NAME%;"
if errorlevel 1 ( echo [ERREUR] Impossible de supprimer la base. & exit /b 1 )
"%PSQL%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d postgres -c "CREATE DATABASE %DB_NAME%;"
if errorlevel 1 ( echo [ERREUR] Impossible de recreer la base. & exit /b 1 )

REM ---------- Import du dump ----------
"%PSQL%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d "%DB_NAME%" -v ON_ERROR_STOP=1 -f "%BACKUP_FILE%"
if errorlevel 1 ( echo [ERREUR] Echec de l'import du dump. & exit /b 1 )

echo.
echo [OK] Base %DB_NAME% restauree depuis %BACKUP_FILE%
echo      Redemarrez le backend : cd backend/edutrack ^& mvnw.cmd spring-boot:run
exit /b 0
