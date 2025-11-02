@echo off
echo ========================================
echo Manual GitHub Push
echo ========================================
echo.
echo This will try to push your code to GitHub
echo.
echo You'll be asked for credentials twice.
echo.
pause
echo.
echo Starting push...
git push -u origin main
echo.
echo Done!
pause

