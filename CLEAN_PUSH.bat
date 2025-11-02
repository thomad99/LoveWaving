@echo off
echo ========================================
echo Clean Push to GitHub
echo ========================================
echo.
echo Removing token file and fixing commit...
echo.

REM Remove token file if it still exists
if exist DELETE_TOKEN.txt del DELETE_TOKEN.txt

echo Adding all files...
git add .

echo Committing...
git commit -m "Add LoveWaving digital waiver management system"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done!
echo ========================================
echo.
pause

