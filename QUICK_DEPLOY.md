# ⚡ Quick Free Deployment

## 🎯 Fastest Way to Deploy (15 minutes)

### Step 1: Database (2 min)
1. Go to https://supabase.com
2. Sign up → New Project → Name: `planmystudy`
3. Copy connection string from Settings → Database

### Step 2: Backend (5 min)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo: `Plan-My-Study-Ai`
4. Settings:
   - **Root Directory**: `backend`
   - **Build**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start**: `npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=<supabase-connection-string>
   JWT_SECRET=<random-32-char-string>
   GROQ_API_KEY=<your-key>
   YOUTUBE_API_KEY=<your-key>
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Deploy → Wait ~5 min → Copy URL

### Step 3: Frontend (3 min)
1. Go to https://vercel.com
2. Import GitHub repo: `Plan-My-Study-Ai`
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Environment Variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
5. Deploy → Done!

### Step 4: Update Backend (2 min)
1. Go back to Render
2. Update `FRONTEND_URL` with your Vercel URL
3. Redeploy

### Step 5: Test (3 min)
1. Visit your Vercel URL
2. Register account
3. Create course
4. ✅ Done!

---

## 🔗 Your URLs

- **Frontend**: `https://planmystudy-ai.vercel.app`
- **Backend**: `https://planmystudy-backend.onrender.com`
- **Database**: Supabase dashboard

---

## 💡 Pro Tips

1. **Free Tier Sleep**: Render free tier sleeps after 15 min
   - First request takes ~30 seconds
   - Consider upgrading for production

2. **Database**: Supabase is always free (better than Render DB)

3. **Custom Domain**: Add in Vercel settings (free)

4. **Monitoring**: Use Render logs for debugging

---

**Total Time**: ~15 minutes  
**Cost**: $0/month  
**Status**: ✅ Live!

