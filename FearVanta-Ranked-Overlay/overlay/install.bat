@echo off
title FearVanta Ranked Overlay - Installer
echo.
echo  ===============================================
echo   FEARVANTA RANKED OVERLAY - AUTO INSTALLER
echo  ===============================================
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo  [!] Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: -----------------------------------------------
:: STEP 1 - Check if Node.js is installed
:: -----------------------------------------------
echo  [1/3] Checking for Node.js...
where node >nul 2>&1
if %errorLevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo  [OK] Node.js is already installed: %NODE_VER%
) else (
    echo  [!] Node.js not found. Downloading and installing...
    echo      This may take a minute, please wait...

    :: Download Node.js LTS installer
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile '%TEMP%\node_installer.msi'"

    :: Silent install
    msiexec /i "%TEMP%\node_installer.msi" /qn /norestart

    :: Refresh PATH
    set "PATH=%PATH%;C:\Program Files\nodejs"

    where node >nul 2>&1
    if %errorLevel% equ 0 (
        echo  [OK] Node.js installed successfully!
    ) else (
        echo  [ERROR] Node.js installation failed.
        echo          Please install manually from https://nodejs.org
        pause
        exit /b 1
    )
)

:: -----------------------------------------------
:: STEP 2 - Add to Windows Startup
:: -----------------------------------------------
echo.
echo  [2/3] Setting up auto-start on Windows boot...

set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set BAT_FILE=%~dp0start_overlay_startup.bat

copy /y "%BAT_FILE%" "%STARTUP_FOLDER%\FearVanta_Overlay.bat" >nul

if exist "%STARTUP_FOLDER%\FearVanta_Overlay.bat" (
    echo  [OK] Auto-start configured!
) else (
    echo  [WARN] Could not add to startup folder automatically.
    echo         Please manually copy start_overlay_startup.bat to:
    echo         %STARTUP_FOLDER%
)

:: -----------------------------------------------
:: STEP 3 - Start the server now
:: -----------------------------------------------
echo.
echo  [3/3] Starting the overlay server...
powershell -WindowStyle Hidden -Command "Start-Process node -ArgumentList 'server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
timeout /t 2 >nul

:: Verify server started
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080/fv_overlay.html' -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorLevel% equ 0 (
    echo  [OK] Server is running!
) else (
    echo  [WARN] Server may still be starting up...
)

:: -----------------------------------------------
:: DONE
:: -----------------------------------------------
echo.
echo  ===============================================
echo   SETUP COMPLETE!
echo  ===============================================
echo.
echo   In OBS Studio:
echo.
echo   1. Add a Browser Source with this URL:
echo      http://localhost:8080/fv_overlay.html
echo.
echo   2. Add a Custom Dock (View - Docks - Custom
echo      Browser Docks) with this URL:
echo      http://localhost:8080/fv_dock.html
echo.
echo   The overlay server will now start automatically
echo   every time your PC boots. No manual steps needed!
echo.
echo  ===============================================
pause
