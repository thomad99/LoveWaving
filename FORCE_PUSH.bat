@echo off
echo ========================================
echo Force Push to GitHub
echo ========================================
echo.
echo This will overwrite GitHub with your local code.
echo.
echo WARNING: This replaces everything on GitHub!
echo.
pause

echo.
echo Force pushing...
git push -f origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Your code is on GitHub!
    echo Visit: https://github.com/thomad99/LoveWaving
) else (
    echo Still failed. Try GitHub Desktop.
)
echo ========================================
echo.
pause

