@echo off
echo ========================================
echo Force Clean Push to GitHub
echo ========================================
echo.
echo This will overwrite GitHub with your local clean code
echo.
pause

echo.
echo Removing git history...
rd /s /q .git 2>nul

echo.
echo Initializing new git repo...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Complete LoveWaving digital waiver management system - clean build"

echo.
echo Adding remote...
git remote add origin https://github.com/thomad99/LoveWaving.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Force pushing to GitHub...
git push -f origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Clean code pushed to GitHub!
    echo Render should now build successfully.
) else (
    echo Push failed. Check your GitHub credentials.
)
echo ========================================
pause

