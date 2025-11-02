@echo off
REM Auto-sync LoveWaving to GitHub

cd /d "C:\Users\tomo\OneDrive\My Pet Projects\AI\6.0_Waiver"

echo ========================================
echo Auto-Syncing LoveWaving to GitHub
echo ========================================
echo.

echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Auto-sync: %date% %time%"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Code synced to GitHub!
) else (
    echo Failed. Check for errors above.
)
echo ========================================
echo.

timeout /t 3

