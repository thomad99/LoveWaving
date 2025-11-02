@echo off
echo ========================================
echo Reset Git History - Remove Token
echo ========================================
echo.
echo This will remove ALL commit history
echo and start fresh with clean code
echo.
pause

echo.
echo Removing all commit history...
rd /s /q .git

echo.
echo Re-initializing git...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating clean commit...
git commit -m "Add LoveWaving digital waiver management system"

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/thomad99/LoveWaving.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -f origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Your code is on GitHub!
    echo Visit: https://github.com/thomad99/LoveWaving
) else (
    echo Failed. Credentials issue?
    echo Use GitHub Desktop instead:
    echo https://desktop.github.com/
)
echo ========================================
echo.
pause

