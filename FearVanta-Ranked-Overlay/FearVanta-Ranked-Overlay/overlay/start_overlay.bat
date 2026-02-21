@echo off
cd /d "%~dp0"
powershell -WindowStyle Hidden -Command "Start-Process node -ArgumentList 'server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
echo Server started! Open OBS and load your Browser Source.
timeout /t 2 >nul
