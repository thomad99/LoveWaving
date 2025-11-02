@echo off
echo Syncing to GitHub...

git add .
git commit -m "Auto sync" 2>nul
git push origin main

echo Done!
