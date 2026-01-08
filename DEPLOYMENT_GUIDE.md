# 🚀 Free Deployment Guide

Deploy PlanMyStudy AI for free using Render (Backend + Database) and Vercel (Frontend).

---

## 📋 Prerequisites

- GitHub account (you already have this!)
- Email address for account creation
- API keys ready (Groq, YouTube)

---

## 🗄️ Step 1: Deploy PostgreSQL Database (Free)

### Option A: Render.com PostgreSQL (Recommended)

1. **Sign up**: Go to https://render.com and sign up with GitHub

2. **Create Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `planmystudy-db`
   - Database: `planmystudy`
   - User: `planmystudy_user`
   - Region: Choose closest to you
   - Plan: **Free**
   - Click "Create Database"

3. **Get Connection String**:
   - Wait for database to be created (~2 minutes)
   - Go to database dashboard
   - Copy "Internal Database URL" (for backend)
   - Format: `postgresql://user:password@host:port/database`

### Option B: Supabase (Alternative)

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Get connection string from Settings → Database

---

## 🔧 Step 2: Deploy Backend (Render.com - Free)

1. **Connect GitHub**:
   - In Render dashboard, click "New +" → "Web Service"
   - Connect your GitHub repository: `Plan-My-Study-Ai`
   - Select the repository

2. **Configure Service**:
   - **Name**: `planmystudy-backend`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-postgresql-connection-string>
   JWT_SECRET=<generate-a-random-32-char-secret>
   GROQ_API_KEY=<your-groq-api-key>
   YOUTUBE_API_KEY=<your-youtube-api-key>
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (~5-10 minutes)
   - Note the URL: `https://planmystudy-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend (Vercel - Free)

1. **Sign up**: Go to https://vercel.com and sign up with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import `Plan-My-Study-Ai` repository
   - Select repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add this variable:
   ```
   VITE_API_URL=https://planmystudy-backend.onrender.com
   ```
   (Replace with your actual backend URL)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (~2-3 minutes)
   - Get your URL: `https://planmystudy-ai.vercel.app`

---

## 🔄 Step 4: Update Backend Environment

1. Go back to Render backend dashboard
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-actual-vercel-url.vercel.app
   ```
3. Redeploy backend (or it will auto-redeploy)

---

## ✅ Step 5: Verify Deployment

1. **Check Backend**:
   - Visit: `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok"}`

2. **Check Frontend**:
   - Visit your Vercel URL
   - Should see the landing page

3. **Test Features**:
   - Register a new account
   - Create a course
   - Check activity calendar

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Database connection fails
- **Solution**: Check DATABASE_URL is correct
- Use "Internal Database URL" from Render

**Problem**: Prisma migration fails
- **Solution**: Run migrations manually:
  ```bash
  npx prisma migrate deploy
  ```

**Problem**: Backend goes to sleep (free tier)
- **Solution**: First request takes ~30 seconds to wake up
- Consider upgrading to paid tier for always-on

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check VITE_API_URL matches backend URL
- Check CORS settings in backend

**Problem**: Build fails
- **Solution**: Check Node version (should be 18+)
- Check all dependencies in package.json

---

## 📝 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-32-chars-min
GROQ_API_KEY=your-groq-key
YOUTUBE_API_KEY=your-youtube-key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🎯 Free Tier Limits

### Render.com
- **Web Service**: 750 hours/month (enough for always-on)
- **PostgreSQL**: 90 days free, then $7/month (or use Supabase)
- **Sleep**: Free tier sleeps after 15 min inactivity

### Vercel
- **Bandwidth**: 100GB/month
- **Builds**: Unlimited
- **Always on**: Yes (no sleep)

### Supabase (Alternative Database)
- **Database**: 500MB storage
- **API requests**: 50,000/month
- **Always free**: Yes

---

## 🚀 Quick Deploy Commands

### Render CLI (Optional)
```bash
npm install -g render-cli
render login
render deploy
```

### Vercel CLI (Optional)
```bash
npm install -g vercel
cd frontend
vercel
```

---

## 📚 Additional Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] CORS configured
- [ ] Health check working
- [ ] Frontend can connect to backend
- [ ] Test user registration
- [ ] Test course creation

---

**Your app will be live and accessible worldwide!** 🌍

