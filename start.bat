@echo off
title CampusConnect Launcher
echo ========================================================
echo         Launching CampusConnect Digital Campus Platform
echo ========================================================

:: Check if node is in PATH, otherwise append local Playwright fallback
where node >nul 2>nul
if %errorlevel% neq 0 (
    set "PATH=C:\Users\Om\AppData\Local\ms-playwright-go\1.57.0;%PATH%"
)

:: Check if npm is in PATH, otherwise use local bundled npm
where npm >nul 2>nul
if %errorlevel% equ 0 (
    set "NPM_CMD=npm"
) else (
    set "NPM_CMD=node ..\package\bin\npm-cli.js"
)

echo [1/2] Starting CampusConnect Backend on port 5000...
start "CampusConnect Backend API (Port 5000)" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting CampusConnect Frontend on port 3000...
start "CampusConnect Frontend Web App (Port 3000)" cmd /k "cd frontend && %NPM_CMD% run dev"

echo.
echo ========================================================
echo  Both services launched!
echo  - Web Application: http://localhost:3000
echo  - Backend API:     http://localhost:5000
echo ========================================================
echo Keep this window open or press any key to close launcher prompt.
pause
