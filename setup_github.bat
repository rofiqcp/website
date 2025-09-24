@echo off
echo Setting up GitHub repository...
echo.

echo Step 1: Adding remote repository
git remote add origin https://github.com/rofiqcp/website.git

echo Step 2: Checking remote
git remote -v

echo Step 3: Pushing to GitHub
git push -u origin main

echo.
echo Done! Check https://github.com/rofiqcp/website
pause
