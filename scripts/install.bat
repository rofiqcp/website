@echo off
echo ========================================
echo  SCADA ESP32 Control System Installer
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js tidak ditemukan!
    echo Silakan install Node.js dari https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js terdeteksi
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm tidak ditemukan!
    pause
    exit /b 1
)

echo ✓ npm terdeteksi
npm --version
echo.

echo Installing dependencies...
echo.

REM Install root dependencies
echo [1/3] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Gagal menginstall server dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo [2/3] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Gagal menginstall client dependencies
    pause
    exit /b 1
)

cd ..

REM Copy environment file
echo [3/3] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✓ File .env berhasil dibuat dari .env.example
    echo.
    echo PENTING: Edit file .env untuk konfigurasi ESP32
    echo - ESP32_IP: Masukkan IP address ESP32 Anda
    echo - ESP32_PORT: Port ESP32 (default: 80)
    echo.
) else (
    echo ✓ File .env sudah ada
)

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Untuk menjalankan aplikasi:
echo   npm run dev     - Development mode
echo   npm start       - Production mode
echo.
echo Untuk build production:
echo   npm run build
echo.
echo Aplikasi akan berjalan di:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Jangan lupa untuk:
echo 1. Edit file .env dengan IP ESP32 yang benar
echo 2. Upload code Arduino ke ESP32
echo 3. Pastikan ESP32 dan PC di network yang sama
echo.
pause
