@echo off
echo ========================================
echo   Starting Aviral Dubey Portfolio
echo ========================================
echo.

echo [1/2] Starting Backend (port 8000)...
cd /d "%~dp0backend"
start "Portfolio Backend" cmd /c "python -m uvicorn main:app --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend (port 5173)...
cd /d "%~dp0frontend"
start "Portfolio Frontend" cmd /c "npm run dev"

timeout /t 3 >nul
echo.
echo ========================================
echo   Both servers are running!
echo   Open: http://localhost:5173
echo ========================================
echo.
echo Press any key to stop both servers...
pause >nul

echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Portfolio Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Portfolio Frontend" /F >nul 2>&1
echo Done!
