@echo off
chcp 65001 >nul 2>nul
setlocal

if "%~1"=="" (
    echo Usage: port-kill.bat [PORT]
    exit /b 1
)

set PORT=%~1
echo Searching port %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    echo Killing PID %%a...
    taskkill /PID %%a /F
)

echo Done.
