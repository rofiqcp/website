@echo off
echo ========================================
echo  SCADA ESP32 Control System
echo ========================================
echo.

REM Check if dependencies are installed
if not exist node_modules (
    echo ERROR: Dependencies belum diinstall!
    echo Jalankan install.bat terlebih dahulu
    pause
    exit /b 1
)

if not exist client\node_modules (
    echo ERROR: Client dependencies belum diinstall!
    echo Jalankan install.bat terlebih dahulu
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo WARNING: File .env tidak ditemukan!
    echo Menggunakan konfigurasi default...
    echo.
)

echo Starting SCADA ESP32 Control System...
echo.
echo Frontend akan berjalan di: http://localhost:3000
echo Backend akan berjalan di:  http://localhost:5000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

REM Start the application
call npm run dev
