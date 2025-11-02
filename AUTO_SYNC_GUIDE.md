# Automatic GitHub Sync Guide

Since I can't run Git commands on your machine, here are options for automatic syncing:

## Option 1: GitHub Desktop (RECOMMENDED - Automatic!)

GitHub Desktop has automatic syncing built-in:

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and open it**
3. **Sign in** with your GitHub account
4. **File → Add Local Repository**
5. Select: `C:\Users\tomo\OneDrive\My Pet Projects\AI\6.0_Waiver`
6. **Settings → Automatically sync** (turned on by default)

**Now every time you save files:**
- GitHub Desktop detects changes
- Shows them in the UI
- You click "Commit and push"
- Code is on GitHub!

**Super easy!** No command line needed!

---

## Option 2: Git Auto-Push Script

Create a simple batch file you double-click:

```batch
@echo off
cd /d "C:\Users\tomo\OneDrive\My Pet Projects\AI\6.0_Waiver"
git add .
git commit -m "Auto-sync: %date% %time%"
git push origin main
```

**Save as:** `auto_sync.bat` in your project folder

**Usage:** Double-click when you want to sync

---

## Option 3: VS Code Source Control

If you use VS Code:

1. **Open** your project in VS Code
2. **Click** Source Control icon (left sidebar)
3. **Changes** are automatically detected
4. **Click** ✓ to commit
5. **Click** Sync Changes (or Ctrl+Shift+G)

**Even easier:** Install "GitLens" extension for auto-commit

---

## Option 4: Watch Script (Advanced)

Create a PowerShell script that watches for file changes:

```powershell
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\tomo\OneDrive\My Pet Projects\AI\6.0_Waiver"
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true

$action = {
    Start-Sleep -Seconds 5
    cd "C:\Users\tomo\OneDrive\My Pet Projects\AI\6.0_Waiver"
    git add .
    git commit -m "Auto-sync"
    git push origin main
}

Register-ObjectEvent $watcher "Changed" -Action $action
```

**Auto-syncs every time you save!**

---

## Option 5: Use GitHub Desktop + File Watcher

Best of both worlds:

1. Use **GitHub Desktop** for easy syncing
2. Enable **auto-commit** if available
3. Or manually commit when done coding

---

## My Recommendation

**Just use GitHub Desktop!**

It's:
- ✅ Free
- ✅ Easy
- ✅ Visual
- ✅ Automatic detection
- ✅ One-click sync
- ✅ No terminal needed

Download: https://desktop.github.com/

---

## For Future Updates

**Simple workflow:**

1. Code in your project
2. Open GitHub Desktop
3. See your changes
4. Type commit message
5. Click "Commit and push to origin/main"
6. **Done!** Code is on GitHub

Render will automatically:
- Detect the push
- Pull new code
- Rebuild
- Deploy!

---

## Next Steps

1. Install GitHub Desktop now
2. Add your repository
3. Make a test change
4. Commit and push
5. Watch Render deploy!

**That's it!** No more complicated commands! 🎉

