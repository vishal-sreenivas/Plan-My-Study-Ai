# 🔧 Registration Failed - Deployment Fix

## Problem

Registration fails after deploying to Vercel. This is usually due to:

1. **Missing `VITE_API_URL` environment variable** in Vercel
2. **Backend not accessible** or not deployed
3. **CORS configuration** blocking requests
4. **Backend `FRONTEND_URL`** not set correctly

---

## ✅ Step-by-Step Fix

### Step 1: Check Frontend Environment Variable (Vercel)

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Check if `VITE_API_URL` is set
4. If not, add it:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your actual backend URL)
   - **Environment**: Select **Production**, **Preview**, and **Development**
5. **Redeploy** after adding the variable

### Step 2: Check Backend Environment Variable (Render)

1. Go to **Render Dashboard** → Your Backend Service
2. Click **Environment** tab
3. Check if `FRONTEND_URL` is set to your Vercel URL
4. If not, add it:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.vercel.app` (your actual Vercel URL)
5. **Redeploy** backend after adding

### Step 3: Verify Backend is Running

1. Visit: `https://your-backend-url.onrender.com/health`
2. Should return: `{"status":"ok","timestamp":"..."}`
3. If it doesn't work, backend is not deployed or sleeping

### Step 4: Check Browser Console

1. Open your deployed app
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to register
5. Look for error messages:
   - `Network Error` = Backend not accessible
   - `CORS error` = CORS configuration issue
   - `404` = Wrong API URL
   - `500` = Backend error

---

## 🔍 Common Errors and Fixes

### Error 1: "Network Error" or "Failed to fetch"

**Cause**: Backend URL not set or backend not accessible

**Fix**:
1. Check `VITE_API_URL` in Vercel is set correctly
2. Check backend is deployed and running
3. Visit backend `/health` endpoint to verify

### Error 2: "CORS policy blocked"

**Cause**: Backend CORS not allowing Vercel origin

**Fix**:
1. Update backend `FRONTEND_URL` to your Vercel URL
2. Redeploy backend
3. I've updated the CORS config to be more flexible

### Error 3: "404 Not Found"

**Cause**: Wrong API URL or endpoint

**Fix**:
1. Check `VITE_API_URL` ends with no trailing slash
2. Should be: `https://your-backend.onrender.com` (NOT `https://your-backend.onrender.com/`)

### Error 4: "500 Internal Server Error"

**Cause**: Backend error (database, API keys, etc.)

**Fix**:
1. Check Render backend logs
2. Verify all environment variables are set in backend
3. Check database connection

---

## 📋 Environment Variables Checklist

### Frontend (Vercel):
- [ ] `VITE_API_URL` = `https://your-backend.onrender.com`

### Backend (Render):
- [ ] `DATABASE_URL` = PostgreSQL connection string
- [ ] `JWT_SECRET` = Random 32+ character string
- [ ] `GROQ_API_KEY` = Your Groq API key
- [ ] `YOUTUBE_API_KEY` = Your YouTube API key
- [ ] `FRONTEND_URL` = `https://your-frontend.vercel.app`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or leave default)

---

## 🧪 Test Steps

1. **Test Backend Health**:
   ```
   https://your-backend.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

2. **Test Registration Endpoint** (using curl or Postman):
   ```bash
   curl -X POST https://your-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

3. **Check Browser Network Tab**:
   - Open DevTools → Network tab
   - Try to register
   - Check the request:
     - **URL**: Should be `https://your-backend.onrender.com/api/auth/register`
     - **Status**: Should be 200 or 201 (not 404, 500, or CORS error)

---

## 🚀 Quick Fix Commands

### If Backend is on Render:

1. **Update Backend Environment**:
   - Add `FRONTEND_URL` = your Vercel URL
   - Redeploy

2. **Update Frontend Environment**:
   - Add `VITE_API_URL` = your Render backend URL
   - Redeploy

### If Backend is Local:

1. **Use ngrok or similar** to expose local backend
2. **Set `VITE_API_URL`** to ngrok URL
3. **Update backend `FRONTEND_URL`** to Vercel URL

---

## ✅ Verification

After fixing:

1. **Frontend loads** on Vercel ✅
2. **Backend health check** works ✅
3. **Registration form** submits ✅
4. **No console errors** ✅
5. **User can register and login** ✅

---

## 🐛 Still Not Working?

**Share these details:**

1. **Browser Console Error** (F12 → Console)
2. **Network Tab Request** (F12 → Network → Click failed request)
3. **Backend Health Check** (visit `/health` endpoint)
4. **Environment Variables** (list what you have set)

With this info, I can provide a specific fix!

