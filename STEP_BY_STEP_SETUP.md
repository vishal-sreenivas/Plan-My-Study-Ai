# 📋 Step-by-Step Setup Guide - PlanMyStudy AI

Follow these steps in order to get your application running.

---

## ✅ Step 1: Install Prerequisites

### 1.1 Install Node.js

1. Go to https://nodejs.org/
2. Download the LTS version (v18 or higher)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers.

### 1.2 Install PostgreSQL

1. Go to https://www.postgresql.org/download/
2. Download PostgreSQL for your operating system
3. Run the installer
4. **Remember your PostgreSQL password!** (You'll need it later)
5. Verify installation:
   ```bash
   psql --version
   ```

### 1.3 Verify Git (Optional)

```bash
git --version
```

---

## ✅ Step 2: Get API Keys

### 2.1 Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Click "Sign Up" or "Log In"
3. Once logged in, click on your profile (top right)
4. Click "View API keys"
5. Click "Create new secret key"
6. **Copy the key immediately** (starts with `sk-`)
7. **Save it somewhere safe** - you won't see it again!
8. Add credits to your account (Settings → Billing)

### 2.2 Get YouTube Data API Key

1. Go to https://console.cloud.google.com/
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Enter project name: "PlanMyStudy" (or any name)
5. Click "Create"
6. Wait for project to be created, then select it
7. Click "☰" (hamburger menu) → "APIs & Services" → "Library"
8. Search for "YouTube Data API v3"
9. Click on it → Click "Enable"
10. Go to "APIs & Services" → "Credentials"
11. Click "Create Credentials" → "API Key"
12. **Copy the API key**
13. (Optional) Click "Restrict Key" → Select "YouTube Data API v3" → Save

---

## ✅ Step 3: Set Up PostgreSQL Database

### 3.1 Open PostgreSQL

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Enter your PostgreSQL password when prompted
3. Expand "Servers" → "PostgreSQL [version]"
4. Right-click on "Databases" → "Create" → "Database"
5. Name: `planmystudy`
6. Click "Save"

**Option B: Using Command Line**
1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Run:
   ```bash
   psql -U postgres
   ```
3. Enter your PostgreSQL password
4. Run:
   ```sql
   CREATE DATABASE planmystudy;
   ```
5. Verify:
   ```sql
   \l
   ```
   You should see `planmystudy` in the list
6. Exit:
   ```sql
   \q
   ```

### 3.2 Note Your Database Credentials

Write down:
- **Host**: `localhost` (usually)
- **Port**: `5432` (default)
- **Database**: `planmystudy`
- **Username**: `postgres` (usually)
- **Password**: (the one you set during installation)

---

## ✅ Step 4: Set Up Backend

### 4.1 Navigate to Backend Folder

Open Terminal/Command Prompt and navigate to the project:

```bash
cd "C:\Users\Vivek S\projects\PlanMyStudy AI\backend"
```

Or if you're already in the project root:
```bash
cd backend
```

### 4.2 Install Backend Dependencies

```bash
npm install
```

This will take 1-2 minutes. You'll see packages being installed.

**Expected output:**
```
added 150 packages, and audited 151 packages in 30s
```

### 4.3 Create Backend .env File

**On Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**On Mac/Linux:**
```bash
touch .env
```

**Or manually:**
1. Open the `backend` folder in your file explorer
2. Create a new file named `.env` (note the dot at the beginning)
3. Open it in a text editor

### 4.4 Add Content to Backend .env

Copy and paste this into your `.env` file, then **replace the values**:

```env
PORT=5000
NODE_ENV=development

# Database - REPLACE username and password with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"

# JWT Secret - Generate a random string (32+ characters)
# You can use this online tool: https://www.random.org/strings/
# Or run: openssl rand -base64 32
JWT_SECRET=change-this-to-a-random-string-at-least-32-characters-long

# OpenAI API Key - REPLACE with your actual key (starts with sk-)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# YouTube Data API Key - REPLACE with your actual key
YOUTUBE_API_KEY=your-actual-youtube-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `YOUR_PASSWORD` → Your PostgreSQL password
- `JWT_SECRET` → A random string (32+ characters)
- `sk-your-actual-openai-api-key-here` → Your OpenAI API key
- `your-actual-youtube-api-key-here` → Your YouTube API key

**Example of what it should look like:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/planmystudy?schema=public"
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
OPENAI_API_KEY=sk-proj-abc123xyz789...
YOUTUBE_API_KEY=AIzaSyB1234567890abcdefghijklmnop
```

### 4.5 Generate Prisma Client

```bash
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client
```

### 4.6 Run Database Migrations

```bash
npx prisma migrate dev --name init
```

**Expected output:**
```
✔ Prisma Migrate applied the following migration(s):
  migrations/20240101000000_init/migration.sql
```

This creates all the database tables (User, Course, Progress).

### 4.7 Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

**✅ Backend is now running!** Keep this terminal open.

**Test it:** Open http://localhost:5000/health in your browser. You should see:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

---

## ✅ Step 5: Set Up Frontend

### 5.1 Open a NEW Terminal Window

**Important:** Keep the backend terminal running! Open a **new terminal window**.

### 5.2 Navigate to Frontend Folder

```bash
cd "C:\Users\Vivek S\projects\PlanMyStudy AI\frontend"
```

Or from project root:
```bash
cd frontend
```

### 5.3 Install Frontend Dependencies

```bash
npm install
```

This will take 1-2 minutes.

**Expected output:**
```
added 200 packages, and audited 201 packages in 45s
```

### 5.4 Create Frontend .env File

**On Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**On Mac/Linux:**
```bash
touch .env
```

**Or manually:**
1. Open the `frontend` folder
2. Create a new file named `.env`
3. Open it in a text editor

### 5.5 Add Content to Frontend .env

Copy and paste this:

```env
VITE_API_URL=http://localhost:5000
```

That's it! Just one line.

### 5.6 Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend is now running!**

---

## ✅ Step 6: Access the Application

### 6.1 Open Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:5173**

You should see the **PlanMyStudy AI** homepage!

---

## ✅ Step 7: Create Your First Account

### 7.1 Register

1. Click **"Get Started"** or **"Sign Up"** button
2. Fill in the registration form:
   - **Name**: Your name (e.g., "John Doe")
   - **Email**: Your email (e.g., "john@example.com")
   - **Password**: At least 6 characters (e.g., "password123")
   - **Confirm Password**: Same as password
3. Click **"Sign Up"**

**Expected result:**
- You'll see a success message
- You'll be automatically redirected to the Dashboard
- You'll see "My Courses" page (empty for now)

---

## ✅ Step 8: Create Your First Course

### 8.1 Navigate to Create Course

1. Click **"Create New Course"** button (top right)

### 8.2 Fill in Course Details

Fill in the form:

- **What do you want to learn?**
  - Example: `React Development`
  - Or: `Machine Learning`, `Spanish Language`, `Python Programming`

- **Your Skill Level**
  - Select: `Beginner` (or Intermediate/Advanced)

- **Total Days**
  - Example: `7` (or any number between 1-365)

- **Time per Day (minutes)**
  - Example: `60` (or any number between 15-480)

### 8.3 Generate Course

1. Click **"Generate Course"** button
2. You'll see a loading spinner: "Generating your course..."
3. **Wait 10-30 seconds** (AI is working!)

**What's happening:**
- Backend sends request to OpenAI
- AI generates structured course plan
- Backend fetches YouTube videos
- Course is saved to database

### 8.4 View Your Course

**Expected result:**
- Course page loads automatically
- You'll see:
  - Course title and description
  - Learning objectives
  - Course modules
  - Day-wise study plan
  - YouTube videos for each lesson

---

## ✅ Step 9: Explore Your Course

### 9.1 View Daily Plan

1. Scroll down to "Daily Study Plan"
2. Click on **"Day 1"** to expand it
3. You'll see lessons for that day

### 9.2 Watch Learning Videos

1. Under each lesson, you'll see **"📺 Learning Resources"**
2. Click on any video thumbnail
3. It opens YouTube in a new tab

### 9.3 Mark Lessons Complete

1. Click **"Mark Complete"** button next to any lesson
2. The button changes to **"✓ Completed"**
3. Progress bar at the top updates

### 9.4 Export as PDF

1. Click **"📄 Export PDF"** button (top right)
2. PDF downloads automatically
3. Open it to see your complete course plan

---

## ✅ Step 10: Verify Everything Works

### Checklist:

- [ ] Backend server running (terminal shows "Server running")
- [ ] Frontend server running (terminal shows "Local: http://localhost:5173")
- [ ] Can access http://localhost:5173 in browser
- [ ] Can register a new account
- [ ] Can log in
- [ ] Can create a course
- [ ] Course generates successfully
- [ ] Can see YouTube videos
- [ ] Can mark lessons complete
- [ ] Can export PDF

**If all checked ✅, you're all set!**

---

## 🐛 Troubleshooting Common Issues

### Issue: "Cannot connect to database"

**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in backend/.env
3. Make sure database `planmystudy` exists
4. Check username/password are correct

### Issue: "OpenAI API error"

**Solution:**
1. Verify API key is correct (starts with `sk-`)
2. Check you have credits in OpenAI account
3. Make sure key has proper permissions

### Issue: "Port 5000 already in use"

**Solution:**
1. Change PORT in backend/.env to 5001
2. Update VITE_API_URL in frontend/.env to match
3. Restart both servers

### Issue: "Module not found"

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### Issue: "CORS error"

**Solution:**
1. Check FRONTEND_URL in backend/.env
2. Make sure it matches exactly: `http://localhost:5173`
3. Restart backend server

---

## 📝 Quick Reference Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Stop Servers
Press `Ctrl + C` in each terminal

### Reset Database (⚠️ Deletes all data)
```bash
cd backend
npx prisma migrate reset
```

### View Database (Prisma Studio)
```bash
cd backend
npx prisma studio
```

---

## 🎉 Congratulations!

You've successfully set up and run PlanMyStudy AI! 

**Next steps:**
- Create more courses
- Explore different topics
- Track your learning progress
- Share your courses with others

**Happy Learning! 🎓**

