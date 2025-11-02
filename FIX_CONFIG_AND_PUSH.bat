@echo off
echo Fixing next.config.js and pushing to GitHub...
git add next.config.js
git commit -m "Fix merge conflict in next.config.js"
git push origin main
echo Done! Render should build now.

