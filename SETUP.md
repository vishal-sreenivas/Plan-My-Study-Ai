# PlanMyStudy AI - Complete Setup Guide

This guide will walk you through setting up the entire application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for version control)

### API Keys Required

1. **Groq API Key** (Ultra-fast AI inference)
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create an API key from the dashboard
   - Free tier available with generous limits
   - Get your key at: https://console.groq.com/keys

2. **YouTube Data API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "YouTube Data API v3"
   - Create credentials (API Key)
   - Restrict the key to YouTube Data API v3 for security

---

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

1. Open PostgreSQL command line or pgAdmin
2. Create a new database:

```sql
CREATE DATABASE planmystudy;
```

3. Note your database connection details:
   - Host: `localhost` (usually)
   - Port: `5432` (default)
   - Database: `planmystudy`
   - Username: Your PostgreSQL username
   - Password: Your PostgreSQL password

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Express (web framework)
- Prisma (ORM)
- JWT (authentication)
- Groq SDK
- And other dependencies

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

2. Open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# Database - Replace with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/planmystudy?schema=public"

# JWT Secret - Generate a random string (keep this secret!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Groq API Key (Ultra-fast AI inference)
GROQ_API_KEY=gsk_your-groq-api-key-here

# YouTube Data API Key
YOUTUBE_API_KEY=your-youtube-api-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- Replace `username` and `password` with your PostgreSQL credentials
- Generate a strong JWT_SECRET (you can use: `openssl rand -base64 32`)
- Add your actual API keys

### Step 4: Set Up Database Schema

1. Generate Prisma Client:

```bash
npx prisma generate
```

2. Run database migrations:

```bash
npx prisma migrate dev --name init
```

This creates all the tables (User, Course, Progress) in your database.

3. (Optional) Open Prisma Studio to view your database:

```bash
npx prisma studio
```

### Step 5: Start the Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal window** and navigate to:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios
- jsPDF (for PDF export)
- And other dependencies

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

2. Open `.env` and ensure it has:

```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Start the Frontend Development Server

```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## ✅ Verification

### Test the Setup

1. **Backend Health Check:**
   - Open browser: `http://localhost:5000/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   - Open browser: `http://localhost:5173`
   - You should see the PlanMyStudy AI homepage

3. **Create an Account:**
   - Click "Get Started" or "Sign Up"
   - Register with email and password
   - You should be redirected to the dashboard

4. **Create Your First Course:**
   - Click "Create New Course"
   - Fill in:
     - Topic: "React Development"
     - Level: Beginner
     - Days: 7
     - Time per day: 60 minutes
   - Click "Generate Course"
   - Wait for AI to generate your course (may take 10-30 seconds)
   - You should see your course plan!

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Database connection error**
- Solution: Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database name, username, and password

**Problem: Prisma migration fails**
- Solution: Make sure database exists
- Try: `npx prisma migrate reset` (⚠️ deletes all data)

**Problem: Groq API error**
- Solution: Check your API key is correct (starts with `gsk_`)
- Verify the key has proper permissions
- Check your Groq account status at https://console.groq.com/

**Problem: YouTube API error**
- Solution: Check your API key
- Ensure YouTube Data API v3 is enabled
- Check API quota limits

### Frontend Issues

**Problem: Cannot connect to backend**
- Solution: Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

**Problem: Build errors**
- Solution: Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 📁 Project Structure Explained

```
PlanMyStudy AI/
├── backend/                 # Node.js/Express backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema definition
│   ├── src/
│   │   ├── config/         # Configuration files (DB, env)
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic (AI, YouTube)
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables (create from .env.example)
│   └── package.json
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Production Deployment

### Backend Deployment (Example: Heroku/Railway)

1. Set environment variables in your hosting platform
2. Ensure PostgreSQL database is provisioned
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Frontend Deployment (Example: Vercel/Netlify)

1. Set `VITE_API_URL` to your production backend URL
2. Build: `npm run build`
3. Deploy the `dist` folder

---

## 📚 Next Steps

- Customize the AI prompts in `backend/src/services/groqService.js`
- Add more learning resource providers
- Implement email notifications
- Add social sharing features
- Enhance progress analytics

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error messages in terminal
2. Verify all environment variables are set
3. Ensure all services (PostgreSQL, backend, frontend) are running
4. Check API quotas and limits

Happy Learning! 🎓

