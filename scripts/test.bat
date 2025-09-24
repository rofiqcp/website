@echo off
echo ========================================
echo  SCADA ESP32 Control System - Test Suite
echo ========================================
echo.

REM Check if server is running
echo [1/5] Checking if server is running...
curl -s http://localhost:5000/api/info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server tidak berjalan di port 5000
    echo Jalankan 'npm run dev' terlebih dahulu
    pause
    exit /b 1
)
echo ✅ Server berjalan normal

REM Test API endpoints
echo.
echo [2/5] Testing API endpoints...

echo Testing /api/status...
curl -s -f http://localhost:5000/api/status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ API status endpoint failed
) else (
    echo ✅ API status endpoint OK
)

echo Testing /api/info...
curl -s -f http://localhost:5000/api/info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ API info endpoint failed
) else (
    echo ✅ API info endpoint OK
)

echo Testing /api/sensors...
curl -s -f http://localhost:5000/api/sensors >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ API sensors endpoint failed
) else (
    echo ✅ API sensors endpoint OK
)

REM Test ESP32 endpoints
echo.
echo [3/5] Testing ESP32 endpoints...

echo Testing /esp32/config...
curl -s -f http://localhost:5000/esp32/config >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ESP32 config endpoint failed
) else (
    echo ✅ ESP32 config endpoint OK
)

echo Testing /esp32/test...
curl -s http://localhost:5000/esp32/test >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  ESP32 connection test failed (normal if ESP32 not connected)
) else (
    echo ✅ ESP32 connection test OK
)

REM Test control endpoints
echo.
echo [4/5] Testing control endpoints...

echo Testing toggle control...
curl -s -X POST -H "Content-Type: application/json" -d "{\"value\":true}" http://localhost:5000/api/toggle/0 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Toggle control failed
) else (
    echo ✅ Toggle control OK
)

echo Testing button control...
curl -s -X POST http://localhost:5000/api/button/0 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Button control failed
) else (
    echo ✅ Button control OK
)

echo Testing slider control...
curl -s -X POST -H "Content-Type: application/json" -d "{\"value\":50}" http://localhost:5000/api/slider/0 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Slider control failed
) else (
    echo ✅ Slider control OK
)

REM Test frontend
echo.
echo [5/5] Testing frontend...

echo Testing frontend accessibility...
curl -s -f http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend tidak dapat diakses di port 3000
    echo Pastikan React development server berjalan
) else (
    echo ✅ Frontend accessible di http://localhost:3000
)

echo.
echo ========================================
echo  Test Summary
echo ========================================
echo.
echo ✅ Basic functionality tests completed
echo ⚠️  ESP32 hardware tests require physical device
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:5000
echo.
echo Manual tests to perform:
echo 1. Open web interface
echo 2. Test toggle switches
echo 3. Test push buttons  
echo 4. Test sliders
echo 5. Check Settings panel
echo 6. Verify real-time updates
echo.
pause
