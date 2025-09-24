@echo off
echo ========================================
echo  Building SCADA ESP32 Control System
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

echo Building production version...
echo.

REM Build the client
echo [1/2] Building React client...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Gagal build client
    pause
    exit /b 1
)

cd ..

echo [2/2] Preparing production files...

REM Create production directory if it doesn't exist
if not exist dist mkdir dist

REM Copy server files
xcopy server dist\server\ /E /I /Y
xcopy client\build dist\client\build\ /E /I /Y
copy package.json dist\
copy .env.example dist\

echo.
echo ========================================
echo  Build Complete!
echo ========================================
echo.
echo Production files tersedia di folder 'dist'
echo.
echo Untuk menjalankan production build:
echo   cd dist
echo   npm install --production
echo   node server/index.js
echo.
echo Atau upload folder 'dist' ke server Anda
echo.
pause
