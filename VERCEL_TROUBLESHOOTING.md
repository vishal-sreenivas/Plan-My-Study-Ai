# 🔧 Vercel Deployment Troubleshooting

## ✅ Fixed Configuration

I've updated `vercel.json` to use the standard Vite configuration that Vercel expects.

---

## 🚨 Common Vercel Deployment Errors

### Error 1: "Build Command Not Found"

**Symptoms**: Build fails immediately

**Fix**:
1. Go to Vercel Dashboard → Your Project → Settings
2. Under "Build & Development Settings"
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (or leave auto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Error 2: "Cannot find module"

**Symptoms**: Build fails with module not found errors

**Fix**:
1. Check Root Directory is set to `frontend`
2. Verify `package.json` exists in `frontend/` folder
3. Check build logs for specific missing module

### Error 3: "404 on all routes"

**Symptoms**: Homepage works, but routes return 404

**Fix**:
- The `vercel.json` now has correct rewrites
- Make sure `vercel.json` is in the **root** directory (not in frontend/)
- Redeploy after pushing the fix

### Error 4: "Environment variable not found"

**Symptoms**: API calls fail, console shows undefined API URL

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend.onrender.com`
3. Make sure to add for **Production** environment
4. Redeploy

### Error 5: "Build timeout"

**Symptoms**: Build starts but times out

**Fix**:
- Check Node version (Vercel uses 18+ by default)
- Reduce build time by optimizing dependencies
- Check for infinite loops in build process

---

## ✅ Correct Vercel Project Settings

### In Vercel Dashboard:

1. **General Settings**:
   - Root Directory: `frontend` ⚠️ **IMPORTANT**
   - Framework: Vite (auto-detected)

2. **Build & Development Settings**:
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)
   - Install Command: `npm install` (auto)

3. **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`

---

## 🔍 How to Check What's Wrong

### Step 1: Check Build Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the failed deployment
5. Click "View Build Logs"
6. Look for red error messages
7. Copy the error and share it

### Step 2: Verify Settings

1. Go to Project Settings
2. Check Root Directory = `frontend`
3. Check Environment Variables are set
4. Check Build Command is correct

### Step 3: Test Locally

```bash
cd frontend
npm install
npm run build
```

If this fails locally, fix it first before deploying.

---

## 🚀 Quick Fix Steps

1. **Update Vercel Settings**:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

2. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com`

3. **Redeploy**:
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger auto-deploy

---

## 📋 Deployment Checklist

Before deploying, verify:

- [ ] `vercel.json` is in root directory (not frontend/)
- [ ] Root Directory in Vercel = `frontend`
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Environment Variable `VITE_API_URL` is set
- [ ] Local build works (`cd frontend && npm run build`)
- [ ] No errors in build logs

---

## 🐛 Still Not Working?

**Share these details:**

1. **Build Log Error** (from Vercel dashboard)
2. **Root Directory setting** (from Vercel settings)
3. **Environment Variables** (list what you have set)
4. **Local build result** (does `npm run build` work?)

With this info, I can provide a specific fix!

---

## ✅ Current Configuration

The `vercel.json` is now configured correctly:
- Uses standard Vite setup
- Has rewrites for React Router
- Points to `frontend/dist` output

**Next Step**: Update Vercel project settings to match!

