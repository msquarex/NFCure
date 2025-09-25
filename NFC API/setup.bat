@echo off
echo ========================================
echo    NFC Data Transfer Setup
echo ========================================
echo.

echo [1/3] Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Generating SSL certificates...
call node generate-certs.js
if %errorlevel% neq 0 (
    echo WARNING: Certificate generation failed
    echo You may need to install OpenSSL manually
    echo.
)

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Start the server: npm start
echo 2. Start the server: npm start (if not started automatically)
echo 3. Note the URL printed (e.g., https://localhost:3000 or https://<your-ip>:3000)
echo 4. Open receiver: the printed URL
echo 5. Accept SSL certificate warning
echo 6. Open sender on Android: https://<your-ip>:3000/sender (use printed IP)
echo.
echo Press any key to start the server now...
pause >nul

echo.
echo Starting NFC Data Transfer Server...
echo Server URL will be printed in the console (uses your current IP)
echo Press Ctrl+C to stop the server
echo.

call npm start

