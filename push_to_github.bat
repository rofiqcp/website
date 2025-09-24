@echo off
echo ========================================
echo  Pushing SCADA ESP32 Control System to GitHub
echo ========================================
echo.

REM Add remote repository
echo Adding remote repository...
git remote add origin https://github.com/rofiqcp/website.git

REM Check if remote was added successfully
git remote -v

echo.
echo Pushing to GitHub repository: rofiqcp/website
echo.

REM Push to GitHub
git push -u origin main

echo.
echo ========================================
echo  Push Complete!
echo ========================================
echo.
echo Your SCADA ESP32 Control System is now available at:
echo https://github.com/rofiqcp/website
echo.
echo Next steps:
echo 1. Go to GitHub repository
echo 2. Enable GitHub Pages (if needed)
echo 3. Configure deployment settings
echo 4. Test the deployed application
echo.
pause
