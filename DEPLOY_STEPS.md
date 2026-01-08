# 🚀 Step-by-Step Free Deployment

Follow these steps to deploy your app for **FREE** in 15 minutes!

---

## 📋 What You'll Need

- ✅ GitHub account (you have this!)
- ✅ Groq API key
- ✅ YouTube API key
- ✅ 15 minutes

---

## 🗄️ STEP 1: Create Database (2 minutes)

### Using Supabase (Recommended - Always Free)

1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name**: `planmystudy`
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait ~2 minutes for database to be created

7. **Get Connection String**:
   - Go to **Settings** → **Database**
   - Scroll to **"Connection string"**
   - Copy the **"URI"** (starts with `postgresql://`)
   - **Save this** - you'll need it!

---

## 🔧 STEP 2: Deploy Backend (5 minutes)

### Using Render.com

1. Go to **https://render.com**
2. Sign up with **GitHub**
3. Click **"New +"** → **"Web Service"**
4. Connect your repository:
   - Click **"Connect account"** if needed
   - Find **"Plan-My-Study-Ai"** repository
   - Click **"Connect"**

5. **Configure Service**:
   - **Name**: `planmystudy-backend`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ Important!
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```
     npm start
     ```

6. **Add Environment Variables**:
   Click **"Advanced"** → **"Add Environment Variable"** and add:

   ```
   NODE_ENV = production
   ```

   ```
   PORT = 10000
   ```

   ```
   DATABASE_URL = <paste-your-supabase-connection-string>
   ```

   ```
   JWT_SECRET = <generate-random-32-char-string>
   ```
   (You can use: `openssl rand -base64 32` or any random string generator)

   ```
   GROQ_API_KEY = <your-groq-api-key>
   ```

   ```
   YOUTUBE_API_KEY = <your-youtube-api-key>
   ```

   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```
   (We'll update this after deploying frontend - use placeholder for now)

7. **Deploy**:
   - Click **"Create Web Service"**
   - Wait ~5-10 minutes for first deployment
   - Copy your backend URL: `https://planmystudy-backend.onrender.com`

---

## 🎨 STEP 3: Deploy Frontend (3 minutes)

### Using Vercel

1. Go to **https://vercel.com**
2. Sign up with **GitHub**
3. Click **"Add New"** → **"Project"**
4. Import repository:
   - Find **"Plan-My-Study-Ai"**
   - Click **"Import"**

5. **Configure Project**:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `frontend` ⚠️ Click "Edit" and change to `frontend`
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)
   - **Install Command**: `npm install` (auto)

6. **Add Environment Variable**:
   Click **"Environment Variables"** → Add:
   ```
   VITE_API_URL = https://planmystudy-backend.onrender.com
   ```
   (Use your actual Render backend URL)

7. **Deploy**:
   - Click **"Deploy"**
   - Wait ~2-3 minutes
   - Copy your frontend URL: `https://planmystudy-ai.vercel.app`

---

## 🔄 STEP 4: Update Backend (2 minutes)

1. Go back to **Render.com** → Your backend service
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-actual-vercel-url.vercel.app
   ```
4. Click **"Save Changes"**
5. Backend will auto-redeploy (~2 minutes)

---

## ✅ STEP 5: Test Your App (3 minutes)

1. **Visit your frontend URL**: `https://your-app.vercel.app`
2. **Test Registration**:
   - Click "Get Started Now"
   - Create an account
   - Should redirect to dashboard

3. **Test Course Creation**:
   - Click "Create New Course"
   - Fill in form and create
   - Should generate course successfully

4. **Check Activity Calendar**:
   - Go to Dashboard
   - Should see activity calendar
   - Create course → should show activity

---

## 🎉 Success!

Your app is now live and accessible worldwide!

### Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://planmystudy-backend.onrender.com`
- **Database**: Supabase dashboard

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails
- **Check**: Build command is correct
- **Check**: Root directory is `backend`
- **Check**: All environment variables are set

**Problem**: Database connection fails
- **Check**: DATABASE_URL is correct (use Supabase URI)
- **Check**: Database password is correct
- **Check**: Database is created and running

**Problem**: Backend sleeps (free tier)
- **Solution**: First request takes ~30 seconds (normal for free tier)
- **Upgrade**: Paid tier ($7/month) for always-on

### Frontend Issues

**Problem**: Can't connect to backend
- **Check**: VITE_API_URL matches backend URL
- **Check**: Backend is running (visit `/health` endpoint)
- **Check**: CORS is configured (should be automatic)

**Problem**: Build fails
- **Check**: Node version (Vercel uses 18+ automatically)
- **Check**: All dependencies in package.json

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Supabase (Database)**:
- ✅ 500MB database storage
- ✅ 50,000 API requests/month
- ✅ Always free (no expiration)

**Render (Backend)**:
- ✅ 750 hours/month (enough for always-on)
- ⚠️ Sleeps after 15 min inactivity (free tier)
- 💰 $7/month for always-on (optional)

**Vercel (Frontend)**:
- ✅ 100GB bandwidth/month
- ✅ Unlimited builds
- ✅ Always on (no sleep)
- ✅ Free forever

**Total Cost**: **$0/month** (or $7/month if you want always-on backend)

---

## 📝 Quick Reference

### Environment Variables Checklist

**Backend (Render)**:
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `DATABASE_URL=<supabase-uri>`
- [ ] `JWT_SECRET=<random-32-chars>`
- [ ] `GROQ_API_KEY=<your-key>`
- [ ] `YOUTUBE_API_KEY=<your-key>`
- [ ] `FRONTEND_URL=<vercel-url>`

**Frontend (Vercel)**:
- [ ] `VITE_API_URL=<render-backend-url>`

---

## 🎯 Next Steps After Deployment

1. ✅ Test all features
2. ✅ Add custom domain (free in Vercel)
3. ✅ Set up monitoring
4. ✅ Configure backups
5. ✅ Share your app!

---

**Your app is ready to go live!** 🚀

Follow the steps above and you'll have your app deployed in 15 minutes!

