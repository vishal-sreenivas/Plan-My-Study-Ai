# 🚀 START HERE - Quick Connection Guide

Your API keys are configured! Follow these steps to connect and run the application.

## ✅ What's Already Done

- ✅ Backend `.env` file created with your API keys
- ✅ Frontend `.env` file created
- ✅ All code files are ready

## ⚠️ IMPORTANT: Update Database Password

**You MUST update the PostgreSQL password before starting!**

1. Open `backend/.env` file
2. Find this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"
   ```
3. Replace `YOUR_PASSWORD` with your actual PostgreSQL password

**Example:** If your password is `mypassword123`:
```
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/planmystudy?schema=public"
```

---

## 📋 Quick Setup Steps

### Step 1: Create PostgreSQL Database

**Using pgAdmin:**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `planmystudy`
4. Click "Save"

**Using Command Line:**
```bash
psql -U postgres
```
Then:
```sql
CREATE DATABASE planmystudy;
\q
```

---

### Step 2: Set Up Backend

Open **Terminal/PowerShell** and run:

```bash
cd "C:\Users\Vivek S\projects\PlanMyStudy AI\backend"
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
```

**✅ Keep this terminal open!**

---

### Step 3: Set Up Frontend

Open a **NEW Terminal/PowerShell** window and run:

```bash
cd "C:\Users\Vivek S\projects\PlanMyStudy AI\frontend"
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 4: Open Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the PlanMyStudy AI homepage!

---

### Step 5: Create Account & Test

1. Click **"Sign Up"**
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: (at least 6 characters)
3. Click **"Sign Up"**
4. Click **"Create New Course"**
5. Fill in:
   - Topic: "React Development" (or any topic)
   - Level: Beginner
   - Days: 7
   - Time per day: 60
6. Click **"Generate Course"**
7. Wait 10-30 seconds for AI to generate your course!

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check DATABASE_URL in `backend/.env` has correct password
- Verify database `planmystudy` exists

### "Missing required environment variables"
- Check `backend/.env` file exists
- Verify all variables are set (no empty values)

### "Port 5000 already in use"
- Change PORT in `backend/.env` to 5001
- Update `VITE_API_URL` in `frontend/.env` to match

### "OpenAI API error"
- Check you have credits in OpenAI account
- Verify API key is correct

---

## ✅ Checklist

Before starting, make sure:
- [ ] PostgreSQL is installed and running
- [ ] Database `planmystudy` is created
- [ ] PostgreSQL password updated in `backend/.env`
- [ ] Node.js is installed (v18+)

---

## 🎉 You're Ready!

Follow the steps above and you'll be running in minutes!

**Need help?** See:
- [STEP_BY_STEP_SETUP.md](./STEP_BY_STEP_SETUP.md) - Detailed guide
- [CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md) - Connection troubleshooting

---

## ⚠️ Security Reminder

**After testing, regenerate your API keys:**
- OpenAI: https://platform.openai.com/api-keys
- YouTube: https://console.cloud.google.com/

Then update the `.env` files with new keys.

