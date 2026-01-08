# 🔗 Connect Frontend to Backend (Vite + Vercel)

## Quick Setup Guide

This guide will help you connect your Vercel-deployed frontend to your Render-deployed backend.

---

## ✅ Step 1: Get Your Backend URL

1. Go to **Render Dashboard** → Your Backend Service
2. Copy the **Service URL** (e.g., `https://planmystudy-backend.onrender.com`)
3. Test it works: Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`

---

## ✅ Step 2: Add Environment Variable in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"** button
4. Fill in:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (paste your backend URL here)
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
5. Click **Save**
6. **Important**: Redeploy your frontend
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment → **Redeploy**
   - Or push a new commit to trigger auto-deploy

---

## ✅ Step 3: Update Backend CORS (Render)

1. Go to **Render Dashboard** → Your Backend Service
2. Click **Environment** tab
3. Check if `FRONTEND_URL` exists
4. If not, add it:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.vercel.app` (your Vercel URL)
5. Click **Save Changes**
6. Backend will auto-redeploy

---

## ✅ Step 4: Verify Connection

### Test 1: Check Environment Variable
1. Open your deployed Vercel app
2. Open Browser Console (F12)
3. Type: `console.log(import.meta.env.VITE_API_URL)`
4. Should show your backend URL (not `undefined`)

### Test 2: Check Backend Health
1. Visit: `https://your-backend.onrender.com/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### Test 3: Test Registration
1. Go to your Vercel app
2. Try to register a new account
3. Open Browser Console (F12) → Network tab
4. Look for request to `/api/auth/register`
5. Should be: `https://your-backend.onrender.com/api/auth/register`
6. Status should be `200` or `201` (not `404` or `CORS error`)

---

## 🔍 How It Works

### Frontend (Vite)
- Uses `import.meta.env.VITE_API_URL` to get backend URL
- Defined in `frontend/src/services/api.js`:
  ```javascript
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  ```
- Environment variables starting with `VITE_` are exposed to the frontend

### Backend (Express)
- CORS is configured to allow requests from `FRONTEND_URL`
- Defined in `backend/src/server.js`
- Allows requests from your Vercel domain

---

## 🐛 Troubleshooting

### Issue 1: "Network Error" or "Failed to fetch"

**Cause**: Backend URL not set or incorrect

**Fix**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it's `https://your-backend.onrender.com` (no trailing slash)
3. Redeploy frontend after adding variable

### Issue 2: "CORS policy blocked"

**Cause**: Backend `FRONTEND_URL` not set correctly

**Fix**:
1. Check `FRONTEND_URL` in Render environment variables
2. Should be: `https://your-frontend.vercel.app` (exact match)
3. Redeploy backend

### Issue 3: "404 Not Found"

**Cause**: Wrong API endpoint or backend not running

**Fix**:
1. Check backend health: `https://your-backend.onrender.com/health`
2. Check `VITE_API_URL` has no trailing slash
3. Verify backend is deployed and running

### Issue 4: Environment Variable Not Working

**Cause**: Variable not exposed or not redeployed

**Fix**:
1. Make sure variable name starts with `VITE_`
2. Redeploy frontend after adding variable
3. Check in browser console: `import.meta.env.VITE_API_URL`

---

## 📋 Environment Variables Summary

### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (Render):
```env
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-key
YOUTUBE_API_KEY=your-youtube-key
NODE_ENV=production
PORT=10000
```

---

## ✅ Success Checklist

- [ ] Backend URL copied from Render
- [ ] `VITE_API_URL` added in Vercel (all environments)
- [ ] Frontend redeployed after adding variable
- [ ] `FRONTEND_URL` added in Render
- [ ] Backend health check works (`/health`)
- [ ] Browser console shows correct API URL
- [ ] Registration/login works without errors
- [ ] No CORS errors in browser console

---

## 🚀 Quick Commands

### Test Backend Health:
```bash
curl https://your-backend.onrender.com/health
```

### Test Registration Endpoint:
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## 📝 Code Reference

### Frontend API Configuration:
**File**: `frontend/src/services/api.js`
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Backend CORS Configuration:
**File**: `backend/src/server.js`
```javascript
app.use(cors({
  origin: env.frontendUrl, // Uses FRONTEND_URL from environment
  credentials: true,
}));
```

---

**After completing these steps, your frontend and backend will be connected!**

