@echo off
echo ========================================
echo LoveWaving - GitHub Sync Script
echo ========================================
echo.

REM Check if git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo OR use GitHub Desktop instead: https://desktop.github.com/
    pause
    exit /b 1
)

echo Git found! Proceeding with sync...
echo.

REM Initialize if not already done
if not exist .git (
    echo Initializing git repository...
    git init
)

echo Adding all files...
git add .

echo Creating commit...
git commit -m "Initial commit - LoveWaving digital waiver management system"

echo Checking for remote origin...
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/thomad99/LoveWaving.git
)

echo Setting main branch...
git branch -M main

echo.
echo ========================================
echo Ready to push to GitHub!
echo ========================================
echo.
echo You will now be asked for your GitHub credentials.
echo IMPORTANT: Use a Personal Access Token, not your password!
echo.
echo Get token from: https://github.com/settings/tokens
echo Generate new token with 'repo' scope
echo.
pause

echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code is now on GitHub!
    echo ========================================
    echo.
    echo Visit: https://github.com/thomad99/LoveWaving
    echo.
) else (
    echo.
    echo ========================================
    echo PUSH FAILED!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Authentication failed - use Personal Access Token
    echo 2. Repository not found - check GitHub repository exists
    echo 3. No permission - verify you have write access
    echo.
    echo Consider using GitHub Desktop instead:
    echo https://desktop.github.com/
    echo.
)

pause

