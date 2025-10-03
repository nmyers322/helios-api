@echo off
REM Windows batch file to deploy Helios API via WSL
REM Usage: deploy.bat [quick|test|check|setup]

setlocal enabledelayedexpansion

echo 🚀 Helios API Deployment Helper
echo ================================

if "%1"=="setup" (
    echo 🐧 Setting up WSL deployment environment...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/setup-wsl-deploy.sh"
    goto :end
)

if "%1"=="quick" (
    echo ⚡ Running quick deployment...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/quick-deploy.sh"
    goto :end
)

if "%1"=="test" (
    echo 🧪 Running deployment with tests...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/deploy-and-test.sh"
    goto :end
)

if "%1"=="check" (
    echo 🔍 Checking order 1033...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/check-order-1033.sh"
    goto :end
)

REM Default: interactive menu
echo Please choose an option:
echo 1. Setup WSL environment (first time only)
echo 2. Quick deployment
echo 3. Deploy with health checks
echo 4. Check order 1033
echo 5. Open WSL terminal
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🐧 Setting up WSL deployment environment...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/setup-wsl-deploy.sh"
) else if "%choice%"=="2" (
    echo ⚡ Running quick deployment...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/quick-deploy.sh"
) else if "%choice%"=="3" (
    echo 🧪 Running deployment with tests...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/deploy-and-test.sh"
) else if "%choice%"=="4" (
    echo 🔍 Checking order 1033...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && ./scripts/check-order-1033.sh"
) else if "%choice%"=="5" (
    echo 🐧 Opening WSL terminal...
    wsl -d Ubuntu-24.04 bash -c "cd /mnt/f/Workspace/helios/helios-api && bash"
) else (
    echo ❌ Invalid choice. Please run the script again.
)

:end
echo.
echo Press any key to exit...
pause >nul
