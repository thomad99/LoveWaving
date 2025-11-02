Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LoveWaving - GitHub Sync Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    git --version | Out-Null
    Write-Host "Git found! Proceeding with sync..." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win"
    Write-Host "OR use GitHub Desktop instead: https://desktop.github.com/"
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""

# Initialize if not already done
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit - LoveWaving digital waiver management system"

# Check for remote origin
try {
    git remote get-url origin | Out-Null
    Write-Host "Remote origin found" -ForegroundColor Green
} catch {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/thomad99/LoveWaving.git
}

Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to push to GitHub!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You will now be asked for your GitHub credentials." -ForegroundColor Yellow
Write-Host "IMPORTANT: Use a Personal Access Token, not your password!" -ForegroundColor Red
Write-Host ""
Write-Host "Get token from: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "Generate new token with 'repo' scope" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Code is now on GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Visit: https://github.com/thomad99/LoveWaving" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "PUSH FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication failed - use Personal Access Token"
    Write-Host "2. Repository not found - check GitHub repository exists"
    Write-Host "3. No permission - verify you have write access"
    Write-Host ""
    Write-Host "Consider using GitHub Desktop instead:" -ForegroundColor Cyan
    Write-Host "https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host ""
}

Read-Host "Press Enter to exit"

