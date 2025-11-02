@echo off
echo Fixing merge conflict and pushing...
git add package.json
git commit -m "Fix merge conflict in package.json"
git push origin main
pause

