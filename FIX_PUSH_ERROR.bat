@echo off
echo ========================================
echo Fix Git Push Error
echo ========================================
echo.
echo The GitHub repo has files that you don't have locally.
echo We'll pull them first, then push your code.
echo.
pause

echo.
echo Pulling from GitHub...
git pull origin main --allow-unrelated-histories --no-edit

echo.
echo Adding your local files...
git add .

echo.
echo Creating commit...
git commit -m "Add LoveWaving application files"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done! Check GitHub now:
echo https://github.com/thomad99/LoveWaving
echo ========================================
echo.
pause

