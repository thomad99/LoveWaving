# How to Create GitHub Personal Access Token

## Step-by-Step Instructions

### Step 1: Go to GitHub Settings
1. **Log into GitHub** at: https://github.com
2. Click your **profile picture** (top right)
3. Click **"Settings"**

### Step 2: Go to Developer Settings
1. Scroll down in the left sidebar
2. Find **"Developer settings"** (at the bottom)
3. Click it

### Step 3: Create Token
1. Click **"Personal access tokens"**
2. Click **"Tokens (classic)"**
3. Click **"Generate new token"**
4. Click **"Generate new token (classic)"**

### Step 4: Configure Token
Fill in the form:

**Note:** `LoveWaving` (or any name you want)

**Expiration:** Choose:
- 30 days
- 60 days  
- 90 days
- Or No expiration (not recommended)

**Scopes:** Check only:
- ✅ **repo** (this gives full repository access)
  - This automatically checks all sub-options

**Don't check anything else unless you need it!**

### Step 5: Generate
1. Scroll down
2. Click green **"Generate token"** button

### Step 6: COPY THE TOKEN!
1. **YOU'LL SEE IT ONCE!**
2. **COPY IT IMMEDIATELY!**
3. **SAVE IT SOMEWHERE SAFE!**

The token looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Visual Guide

```
GitHub Home
    ↓
Click Profile Picture (top right)
    ↓
Click "Settings"
    ↓
Scroll down → Click "Developer settings" (left sidebar)
    ↓
Click "Personal access tokens"
    ↓
Click "Tokens (classic)"
    ↓
Click "Generate new token" → "Generate new token (classic)"
    ↓
Fill form:
  - Note: LoveWaving
  - Expiration: 90 days
  - Scopes: ✅ repo
    ↓
Click "Generate token"
    ↓
COPY THE TOKEN! (ghp_xxxxx...)
```

---

## After You Have the Token

### Method 1: Use sync.bat
1. Double-click **sync.bat**
2. When asked for **username:** Enter `thomad99`
3. When asked for **password:** Paste your token
4. Done!

### Method 2: GitHub Desktop
- Just sign in normally with your GitHub account
- It handles tokens automatically
- No need to enter token

### Method 3: Command Line
```bash
git push -u origin main
```
When prompted:
- **Username:** thomad99
- **Password:** Paste your token

---

## Important Notes

✅ **The token IS your password** for Git operations
✅ **Use it instead of your real GitHub password**
✅ **Keep it secret** - don't share it!
✅ **You can revoke it** anytime in the same settings page
✅ **Create a new one** if this one expires

❌ **Don't commit** the token to any code
❌ **Don't share** it publicly
❌ **Don't use** your actual GitHub password

---

## If You Lose the Token

**Can't get it back!** Just create a new one:
1. Go to same settings page
2. Create new token
3. Use the new token instead

---

## Need Help?

**Can't find Developer settings?**
- Make sure you're logged in
- Scroll all the way down in left sidebar
- Look for "Developer settings" at bottom

**Token doesn't work?**
- Make sure you copied the ENTIRE token
- Verify you checked "repo" scope
- Try creating a new token

**Still having issues?**
- Use GitHub Desktop instead (it's easier!)
- Download: https://desktop.github.com/

---

## Direct Link

If you're logged in, you can go directly to:
https://github.com/settings/tokens

---

## Summary

1. Go to: https://github.com/settings/tokens
2. Click: "Generate new token (classic)"
3. Check: "repo" scope
4. Click: "Generate token"
5. Copy: The token (starts with `ghp_`)
6. Use: It as your password when pushing code

**That's it!** 🎉

