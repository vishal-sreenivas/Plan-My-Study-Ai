# 🔧 Vercel Deployment Fix

## Common Issues and Solutions

### Issue 1: Build Fails - Root Directory

**Problem**: Vercel can't find the frontend files

**Solution**: In Vercel Dashboard:
1. Go to Project Settings
2. Under "General" → "Root Directory"
3. Set to: `frontend`
4. Save and redeploy

### Issue 2: Build Command Fails

**Problem**: npm install or build fails

**Solution**: Check these settings in Vercel:
- **Framework Preset**: `Vite` (auto-detected)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### Issue 3: Environment Variables Missing

**Problem**: API calls fail because VITE_API_URL is not set

**Solution**: 
1. Go to Vercel Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
3. Redeploy

### Issue 4: 404 Errors on Routes

**Problem**: React Router routes return 404

**Solution**: The `vercel.json` already has rewrites configured. Make sure:
- `vercel.json` is in the root directory
- Rewrites are configured correctly

### Issue 5: Build Timeout

**Problem**: Build takes too long and times out

**Solution**:
- Check Node version (should be 18+)
- Reduce dependencies if possible
- Check build logs for specific errors

---

## ✅ Correct Vercel Settings

### Project Settings:
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables:
- `VITE_API_URL` = `https://your-backend.onrender.com`

---

## 🚀 Quick Fix Steps

1. **Delete and Re-import Project** (if needed):
   - Go to Vercel Dashboard
   - Delete the project
   - Re-import from GitHub
   - Set Root Directory to `frontend`

2. **Check Build Logs**:
   - Go to Deployments tab
   - Click on failed deployment
   - Check "Build Logs" for errors
   - Share the error message

3. **Verify vercel.json**:
   - Make sure `vercel.json` is in root directory
   - Should have rewrites for React Router

4. **Test Locally First**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - If this fails locally, fix it first
   - Then deploy to Vercel

---

## 📋 Deployment Checklist

- [ ] Root Directory set to `frontend` in Vercel
- [ ] Framework detected as Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable `VITE_API_URL` set
- [ ] `vercel.json` in root directory
- [ ] Local build works (`npm run build`)

---

## 🔍 Debug Steps

1. **Check Build Logs**:
   - Vercel Dashboard → Deployments → Click deployment → Build Logs
   - Look for error messages

2. **Check Environment Variables**:
   - Settings → Environment Variables
   - Verify `VITE_API_URL` is set

3. **Check Root Directory**:
   - Settings → General → Root Directory
   - Should be `frontend`

4. **Test Build Locally**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

---

**Share the build error message from Vercel logs for specific help!**

