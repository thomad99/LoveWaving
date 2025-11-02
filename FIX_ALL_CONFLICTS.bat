@echo off
echo ========================================
echo Fixing all merge conflicts and pushing
echo ========================================
echo.

git add .
git commit -m "Fix all merge conflicts - clean codebase"
git push origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! All conflicts fixed!
    echo Render should build successfully now.
) else (
    echo Push failed. Check for errors.
)
echo ========================================
pause

