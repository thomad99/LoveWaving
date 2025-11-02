@echo off
echo ========================================
echo Final Fix - Remove Token from History
echo ========================================
echo.

REM Check if we have commits
git log --oneline | findstr /C:"Initial" >nul
if %ERRORLEVEL% EQU 0 (
    echo Found commits with token. Resetting...
    echo.
    REM Remove last commit
    git reset --soft HEAD~1
    echo.
)

REM Delete token file
if exist DELETE_TOKEN.txt del DELETE_TOKEN.txt

echo Adding files...
git add .

echo Creating fresh commit...
git commit -m "Add LoveWaving digital waiver management system"

echo.
echo Pushing to GitHub...
git push -f origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Your code is on GitHub!
) else (
    echo Push failed. Try GitHub Desktop instead.
    echo https://desktop.github.com/
)
echo ========================================
echo.
pause

