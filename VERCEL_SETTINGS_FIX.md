# 🔧 Vercel Settings Fix - Build Commands Locked

## Problem

The Build and Output Settings are locked/uneditable in Vercel dashboard.

## Solution

This happens when Vercel auto-detects the framework. You need to set the **Root Directory** first, then the build commands will update automatically.

---

## ✅ Step-by-Step Fix

### Step 1: Set Root Directory

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** tab
3. Scroll to **"General"** section
4. Find **"Root Directory"**
5. Click **"Edit"** button
6. Set to: `frontend`
7. Click **"Save"**

### Step 2: Verify Build Settings Update

After setting Root Directory to `frontend`, the build commands should automatically update to:

- **Build Command**: `npm run build` (NOT `cd frontend && npm run build`)
- **Output Directory**: `dist` (NOT `frontend/dist`)
- **Install Command**: `npm install` (NOT `cd frontend && npm install`)

### Step 3: If Still Locked

If settings are still locked after setting Root Directory:

1. **Option A: Delete and Re-import Project**
   - Delete the project in Vercel
   - Re-import from GitHub
   - **During import**, set Root Directory to `frontend`
   - Build commands will be correct from the start

2. **Option B: Use vercel.json Override**
   - The `vercel.json` I just updated should override settings
   - Push the changes and redeploy
   - Vercel will use `vercel.json` settings

---

## 📝 Correct Settings

### When Root Directory = `frontend`:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### When Root Directory = `.` (root):

- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

---

## 🎯 Recommended Approach

**Set Root Directory to `frontend`** - This is the cleanest approach:

1. Settings → General → Root Directory = `frontend`
2. Build commands auto-update to correct values
3. No need for `cd frontend &&` in commands

---

## ✅ Updated vercel.json

I've updated `vercel.json` to work with Root Directory = `frontend`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [...]
}
```

This will override the locked settings once you push and redeploy.

---

## 🚀 Next Steps

1. **Set Root Directory** to `frontend` in Vercel settings
2. **Push the updated vercel.json** (already done)
3. **Redeploy** - Vercel will use the correct settings
4. **Add Environment Variable**: `VITE_API_URL`

---

**The key is setting Root Directory first, then everything else falls into place!**

