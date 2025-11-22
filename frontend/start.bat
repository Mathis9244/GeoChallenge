@echo off
echo Démarrage du serveur de développement Géo Challenge...
echo.
cd /d %~dp0
call npm run dev
pause

