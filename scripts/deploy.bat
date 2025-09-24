@echo off
echo ========================================
echo  SCADA ESP32 Control System - Deploy
echo ========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git tidak ditemukan!
    echo Install Git dari https://git-scm.com/
    pause
    exit /b 1
)

echo ✓ Git terdeteksi
echo.

REM Check if this is a git repository
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: SCADA ESP32 Control System"
    echo.
    echo Repository initialized!
    echo Tambahkan remote repository:
    echo   git remote add origin https://github.com/username/scada-esp32-control.git
    echo   git push -u origin main
    echo.
    pause
    exit /b 0
)

echo Current repository status:
git status --porcelain
echo.

REM Check for uncommitted changes
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo Ada perubahan yang belum di-commit.
    echo.
    set /p commit="Commit changes sekarang? (y/n): "
    if /i "%commit%"=="y" (
        set /p message="Commit message: "
        git add .
        git commit -m "%message%"
        echo ✓ Changes committed
    ) else (
        echo Deployment dibatalkan - commit changes terlebih dahulu
        pause
        exit /b 1
    )
)

echo.
echo Pilih deployment target:
echo 1. GitHub Pages (Static)
echo 2. Netlify (Recommended)
echo 3. Heroku (Full Stack)
echo 4. Build Only
echo.
set /p choice="Pilihan (1-4): "

if "%choice%"=="1" goto github_pages
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto heroku
if "%choice%"=="4" goto build_only

echo Invalid choice
pause
exit /b 1

:github_pages
echo.
echo Deploying to GitHub Pages...
echo.
echo Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Installing gh-pages...
npm install -g gh-pages

echo Deploying to GitHub Pages...
npx gh-pages -d client/build

echo.
echo ✓ Deployed to GitHub Pages!
echo Your site will be available at:
echo https://username.github.io/scada-esp32-control
goto end

:netlify
echo.
echo Deploying to Netlify...
echo.
echo Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Installing Netlify CLI...
npm install -g netlify-cli

echo Login to Netlify (browser will open)...
netlify login

echo Deploying to Netlify...
netlify deploy --prod --dir=client/build

echo.
echo ✓ Deployed to Netlify!
echo Check your Netlify dashboard for the URL
goto end

:heroku
echo.
echo Deploying to Heroku...
echo.

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Heroku CLI tidak ditemukan!
    echo Install dari https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo Login to Heroku...
heroku login

set /p appname="Enter Heroku app name (or press Enter for auto-generated): "
if "%appname%"=="" (
    heroku create
) else (
    heroku create %appname%
)

echo Setting up environment variables...
heroku config:set NODE_ENV=production
heroku config:set NPM_CONFIG_PRODUCTION=false

echo Deploying to Heroku...
git push heroku main

echo.
echo ✓ Deployed to Heroku!
heroku open
goto end

:build_only
echo.
echo Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo ✓ Production build completed!
echo Files are in the 'dist' directory
echo.
echo To deploy manually:
echo 1. Upload 'dist' folder to your server
echo 2. Install dependencies: npm install --production
echo 3. Start server: node server/index.js
goto end

:end
echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Don't forget to:
echo 1. Update ESP32_IP in production environment
echo 2. Configure HTTPS for production
echo 3. Set up monitoring and backups
echo 4. Test all functionality in production
echo.
pause
