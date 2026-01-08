# 🚨 Quick Fix: Registration Failed

## Most Common Issue: Missing Environment Variables

### ✅ Fix in 2 Steps:

---

## Step 1: Add Frontend Environment Variable (Vercel)

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (replace with your actual backend URL)
   - **Environment**: Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. **Redeploy** your frontend (or it will auto-redeploy)

---

## Step 2: Add Backend Environment Variable (Render)

1. Go to **Render Dashboard** → Your Backend Service
2. Click **Environment** tab
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.vercel.app` (replace with your actual Vercel URL)
5. Click **Save Changes**
6. **Redeploy** backend (or it will auto-redeploy)

---

## ✅ Verify It Works

1. **Check Backend Health**:
   - Visit: `https://your-backend.onrender.com/health`
   - Should see: `{"status":"ok"}`

2. **Check Frontend**:
   - Open browser console (F12)
   - Try to register
   - Should NOT see CORS errors or "Network Error"

3. **Test Registration**:
   - Fill registration form
   - Submit
   - Should redirect to dashboard (not show error)

---

## 🔍 If Still Not Working

### Check Browser Console (F12):

**Error: "Network Error" or "Failed to fetch"**
- Backend URL is wrong or backend is down
- Check `VITE_API_URL` is correct
- Check backend `/health` endpoint works

**Error: "CORS policy blocked"**
- Backend `FRONTEND_URL` is wrong
- Update `FRONTEND_URL` in Render to match your Vercel URL
- Redeploy backend

**Error: "404 Not Found"**
- API URL is wrong
- Check `VITE_API_URL` has no trailing slash
- Should be: `https://backend.onrender.com` (NOT `https://backend.onrender.com/`)

**Error: "500 Internal Server Error"**
- Backend error (check Render logs)
- Database connection issue
- Missing API keys

---

## 📋 Quick Checklist

- [ ] `VITE_API_URL` set in Vercel = your backend URL
- [ ] `FRONTEND_URL` set in Render = your Vercel URL
- [ ] Backend health check works (`/health`)
- [ ] Both services redeployed after adding variables
- [ ] No CORS errors in browser console
- [ ] Registration form submits successfully

---

**After adding these environment variables and redeploying, registration should work!**

