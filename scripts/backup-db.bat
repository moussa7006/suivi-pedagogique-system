@echo off
REM ============================================================
REM  EduTrack - Sauvegarde PostgreSQL (pg_dump) + rotation 30 j
REM  ------------------------------------------------------------
REM  Aucune dependance au backend : se connecte directement a
REM  PostgreSQL. Le backend peut rester en cours d'execution.
REM
REM  Usage manuel   : backup-db.bat
REM  Automatisation : Planificateur de taches Windows, ex. :
REM    schtasks /create /tn "EduTrack Backup" /sc daily /st 18:00 ^
REM      /tr "\"C:\chemin\vers\scripts\backup-db.bat\""
REM
REM  Variables surchargeables par l'environnement (memes noms
REM  que le backend) : DB_HOST, DB_PORT, DB_USER, DB_NAME,
REM  PGPASSWORD, PG_BIN, BACKUP_DIR, RETENTION_DAYS.
REM ============================================================
setlocal EnableDelayedExpansion

REM ---------- Configuration ----------
if not defined DB_HOST        set "DB_HOST=localhost"
if not defined DB_PORT        set "DB_PORT=5432"
if not defined DB_USER        set "DB_USER=postgres"
if not defined DB_NAME        set "DB_NAME=db_suivipedago"
if not defined PGPASSWORD     set "PGPASSWORD=1234"
REM Dossier des sauvegardes : HORS de OneDrive si possible.
if not defined BACKUP_DIR (
  if exist D:\ (
    set "BACKUP_DIR=D:\backups\edutrack"
  ) else (
    set "BACKUP_DIR=%LOCALAPPDATA%\edutrack-backups"
  )
)
if not defined RETENTION_DAYS set "RETENTION_DAYS=30"

REM ---------- Localisation de pg_dump ----------
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" set "PG_BIN=C:\Program Files\PostgreSQL\18\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" set "PG_BIN=C:\Program Files\PostgreSQL\17\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" set "PG_BIN=C:\Program Files\PostgreSQL\16\bin"
if not defined PG_BIN if exist "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" set "PG_BIN=C:\Program Files\PostgreSQL\15\bin"
if not defined PG_BIN (
  for /f "delims=" %%i in ('where pg_dump.exe 2^>nul') do set "PG_BIN=%%~dpi"
)
if not defined PG_BIN (
  echo [ERREUR] pg_dump introuvable. Definir PG_BIN vers le dossier bin de PostgreSQL.
  exit /b 1
)
set "PG_DUMP=%PG_BIN%\pg_dump.exe"
if not exist "%PG_DUMP%" set "PG_DUMP=%PG_BIN%pg_dump.exe"

REM ---------- Preparation ----------
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
set "LOG_FILE=%BACKUP_DIR%\backup.log"

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "TS=%%i"
set "BACKUP_FILE=%BACKUP_DIR%\edutrack_%TS%.sql"

echo [%DATE% %TIME%] Sauvegarde de %DB_NAME% sur %DB_HOST%:%DB_PORT% >> "%LOG_FILE%"

REM ---------- Dump ----------
"%PG_DUMP%" -h "%DB_HOST%" -p "%DB_PORT%" -U "%DB_USER%" -d "%DB_NAME%" -f "%BACKUP_FILE%"
set "PG_EXIT=%ERRORLEVEL%"

if not "%PG_EXIT%"=="0" (
  echo [%DATE% %TIME%] ECHEC pg_dump, code %PG_EXIT% >> "%LOG_FILE%"
  del "%BACKUP_FILE%" 2>nul
  echo [ECHEC] Sauvegarde impossible - voir %LOG_FILE%
  exit /b 1
)

if not exist "%BACKUP_FILE%" (
  echo [%DATE% %TIME%] ECHEC : fichier dump absent >> "%LOG_FILE%"
  echo [ECHEC] Fichier de sauvegarde absent.
  exit /b 1
)

for %%A in ("%BACKUP_FILE%") do set "DUMP_SIZE=%%~zA"
if %DUMP_SIZE% LSS 1024 (
  echo [%DATE% %TIME%] ECHEC : dump trop petit, %DUMP_SIZE% octets >> "%LOG_FILE%"
  del "%BACKUP_FILE%" 2>nul
  echo [ECHEC] Dump anormalement petit - fichier supprime.
  exit /b 1
)

echo [%DATE% %TIME%] OK, %DUMP_SIZE% octets : %BACKUP_FILE% >> "%LOG_FILE%"

REM ---------- Rotation : suppression des dumps de plus de N jours ----------
forfiles /p "%BACKUP_DIR%" /m "edutrack_*.sql" /d -%RETENTION_DAYS% /c "cmd /c del @path" >nul 2>&1

echo [OK] Sauvegarde creee : %BACKUP_FILE% (%DUMP_SIZE% octets)
echo      Dossier          : %BACKUP_DIR%
echo      Conservation     : %RETENTION_DAYS% jours
exit /b 0
