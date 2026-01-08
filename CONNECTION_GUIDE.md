# 🔌 Connection Guide - Quick Setup

Your API keys have been configured! Now let's connect everything.

## ⚠️ Important Security Note

**You've shared your API keys publicly.** After testing, please:
1. Regenerate your OpenAI API key at https://platform.openai.com/api-keys
2. Regenerate your YouTube API key at https://console.cloud.google.com/
3. Update the `.env` files with new keys

---

## ✅ Step 1: Set Up PostgreSQL Database

### Option A: Using pgAdmin (GUI - Recommended)

1. Open **pgAdmin** (installed with PostgreSQL)
2. Enter your PostgreSQL password
3. Expand **"Servers"** → **"PostgreSQL [version]"**
4. Right-click on **"Databases"** → **"Create"** → **"Database"**
5. Name: `planmystudy`
6. Click **"Save"**

### Option B: Using Command Line

```bash
psql -U postgres
```

Enter your password, then:
```sql
CREATE DATABASE planmystudy;
\q
```

---

## ✅ Step 2: Update Database URL

**You need to update the DATABASE_URL in `backend/.env`:**

1. Open `backend/.env` file
2. Find this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"
   ```
3. Replace `YOUR_PASSWORD` with your actual PostgreSQL password

**Example:**
If your PostgreSQL password is `mypassword123`, change it to:
```
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/planmystudy?schema=public"
```

---

## ✅ Step 3: Install Dependencies & Set Up Backend

Open Terminal/Command Prompt and run:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
```

**Expected output:**
- Packages installed
- Prisma client generated
- Database tables created

---

## ✅ Step 4: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

**✅ Backend is connected!** Keep this terminal open.

**Test it:** Open http://localhost:5000/health in your browser. You should see:
```json
{"status":"ok","timestamp":"..."}
```

---

## ✅ Step 5: Set Up Frontend

**Open a NEW terminal window** (keep backend running!)

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**✅ Frontend is connected!**

---

## ✅ Step 6: Test the Connection

1. **Open browser:** http://localhost:5173
2. **You should see:** PlanMyStudy AI homepage
3. **Click "Sign Up"** and create an account
4. **Create a course** to test AI integration

---

## 🧪 Test API Keys

### Test OpenAI Connection

The backend will test OpenAI when you create a course. If you see an error:
- Check you have credits in your OpenAI account
- Verify the API key is correct

### Test YouTube Connection

YouTube API will be tested when generating courses. If videos don't appear:
- Check YouTube Data API v3 is enabled in Google Cloud Console
- Verify API key is correct
- Check API quota limits

---

## ✅ Connection Checklist

- [ ] PostgreSQL database `planmystudy` created
- [ ] DATABASE_URL updated in `backend/.env` with your password
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database migrations run (`npx prisma migrate dev`)
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can register an account
- [ ] Can create a course (tests OpenAI)
- [ ] Course shows YouTube videos (tests YouTube API)

---

## 🐛 Troubleshooting

### "Cannot connect to database"

**Solution:**
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in `backend/.env`
3. Verify password is correct
4. Make sure database `planmystudy` exists

### "Missing required environment variables"

**Solution:**
1. Check `backend/.env` file exists
2. Verify all variables are set (no empty values)
3. Make sure there are no extra spaces

### "OpenAI API error"

**Solution:**
1. Check you have credits in OpenAI account
2. Verify API key is correct (starts with `sk-proj-`)
3. Check API usage limits

### "YouTube API error"

**Solution:**
1. Verify API key is correct
2. Make sure YouTube Data API v3 is enabled
3. Check API quota in Google Cloud Console

---

## 🎉 You're Connected!

Once all steps are complete, you can:
- ✅ Create user accounts
- ✅ Generate AI-powered courses
- ✅ View learning resources
- ✅ Track your progress
- ✅ Export PDFs

**Happy Learning! 🎓**

