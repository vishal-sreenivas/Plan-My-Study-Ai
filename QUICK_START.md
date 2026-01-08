# 🚀 Quick Start - How to Run PlanMyStudy AI

Follow these steps to get the application running on your machine.

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher) - [Download](https://nodejs.org/)
- ✅ PostgreSQL installed and running - [Download](https://www.postgresql.org/download/)
- ✅ OpenAI API Key - [Get it here](https://platform.openai.com/api-keys)
- ✅ YouTube Data API Key - [Get it here](https://console.cloud.google.com/)

---

## Step 1: Set Up Database

1. Open PostgreSQL (pgAdmin or command line)
2. Create a new database:

```sql
CREATE DATABASE planmystudy;
```

3. Note your database credentials:
   - Username (usually `postgres`)
   - Password
   - Host (usually `localhost`)
   - Port (usually `5432`)

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages (Express, Prisma, OpenAI, etc.)

### 2.3 Create Environment File

Create a file named `.env` in the `backend/` folder with this content:

```env
PORT=5000
NODE_ENV=development

# Replace with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/planmystudy?schema=public"

# Generate a random string (min 32 characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Your OpenAI API Key (starts with sk-)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Your YouTube Data API Key
YOUTUBE_API_KEY=your-youtube-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace:
- `username` and `password` with your PostgreSQL credentials
- `JWT_SECRET` with a random string (32+ characters)
- `OPENAI_API_KEY` with your actual OpenAI key
- `YOUTUBE_API_KEY` with your actual YouTube key

### 2.4 Set Up Database Schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates all the database tables.

### 2.5 Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

**Keep this terminal open!** The backend needs to keep running.

---

## Step 3: Frontend Setup

### 3.1 Open a New Terminal

**Important:** Keep the backend terminal running, open a NEW terminal window.

### 3.2 Navigate to Frontend

```bash
cd frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

### 3.4 Create Environment File

Create a file named `.env` in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

### 3.5 Start Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the PlanMyStudy AI homepage!

---

## Step 5: Test the Application

### 5.1 Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: (at least 6 characters)
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### 5.2 Create Your First Course

1. Click "Create New Course"
2. Fill in the form:
   - **Topic**: "React Development" (or any topic)
   - **Level**: Beginner
   - **Days**: 7
   - **Time per day**: 60 minutes
3. Click "Generate Course"
4. Wait 10-30 seconds (AI is generating your course!)
5. Your course plan will appear!

### 5.3 Explore Your Course

- View day-wise lessons
- Click on YouTube video links
- Mark lessons as completed
- Export as PDF

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Missing required environment variables"**
- Check your `.env` file exists in `backend/` folder
- Verify all variables are set (no empty values)

**Error: "Database connection failed"**
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify database `planmystudy` exists

**Error: "Port 5000 already in use"**
- Change PORT in `.env` to another number (e.g., 5001)
- Or stop the process using port 5000

### Frontend won't start

**Error: "Cannot find module"**
- Run `npm install` again
- Delete `node_modules` and reinstall

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

### API Errors

**OpenAI API Error:**
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Ensure key has proper permissions

**YouTube API Error:**
- Verify your API key is correct
- Make sure YouTube Data API v3 is enabled
- Check API quota limits

---

## 📝 Quick Reference

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

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Stop Servers
- Press `Ctrl + C` in each terminal

---

## 🎯 What's Running?

When everything is set up correctly, you should have:

1. **PostgreSQL** - Database running
2. **Backend Server** - Running on port 5000
3. **Frontend Server** - Running on port 5173
4. **Browser** - Open to http://localhost:5173

---

## 📚 Need More Help?

- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Concepts**: See [CONCEPTS_GUIDE.md](./CONCEPTS_GUIDE.md)
- **Environment Setup**: See [backend/ENV_SETUP.md](./backend/ENV_SETUP.md)

---

**Happy Learning! 🎓**

