# 🔧 Setup Environment Files

Follow these steps to create the `.env` files.

## ⚠️ Security Note

**Never commit API keys to Git!** Always use placeholders in documentation.
- Get Groq API Key: https://console.groq.com/
- Get YouTube API Key: https://console.cloud.google.com/

---

## 📝 Step 1: Create Backend .env File

### Method 1: Using PowerShell (Recommended)

Open PowerShell in the `backend` folder and run:

```powershell
@"
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"

JWT_SECRET=planmystudy-secret-key-change-this-in-production-min-32-chars-long

GROQ_API_KEY=your-groq-api-key-here

YOUTUBE_API_KEY=your-youtube-api-key-here

FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

**Then edit `.env` and replace:**
- `YOUR_PASSWORD` with your PostgreSQL password
- `your-groq-api-key-here` with your actual Groq API key
- `your-youtube-api-key-here` with your actual YouTube API key

### Method 2: Manual Creation

1. Navigate to `backend` folder
2. Create a new file named `.env` (with the dot!)
3. Copy and paste this content:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"

JWT_SECRET=planmystudy-secret-key-change-this-in-production-min-32-chars-long

GROQ_API_KEY=your-groq-api-key-here

YOUTUBE_API_KEY=your-youtube-api-key-here

FRONTEND_URL=http://localhost:5173
```

4. **IMPORTANT:** Replace placeholders with your actual values

---

## 📝 Step 2: Create Frontend .env File

### Method 1: Using PowerShell

Open PowerShell in the `frontend` folder and run:

```powershell
@"
VITE_API_URL=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding utf8
```

### Method 2: Manual Creation

1. Navigate to `frontend` folder
2. Create a new file named `.env`
3. Add this single line:

```env
VITE_API_URL=http://localhost:5000
```

---

## ✅ Step 3: Verify Files Created

Check that both files exist:

**Backend:**
```powershell
cd backend
Test-Path .env
# Should return: True
```

**Frontend:**
```powershell
cd frontend
Test-Path .env
# Should return: True
```

---

## 🔍 Step 4: Update Database Password

**CRITICAL:** You must update the PostgreSQL password in `backend/.env`:

1. Open `backend/.env` in a text editor
2. Find this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planmystudy?schema=public"
   ```
3. Replace `YOUR_PASSWORD` with your actual PostgreSQL password

**Example:**
If your password is `mypassword123`, it should be:
```
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/planmystudy?schema=public"
```

---

## 🚀 Next Steps

After creating the `.env` files:

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE planmystudy;
   ```

2. **Set up backend:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```

3. **Set up frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open browser:** http://localhost:5173

---

## ✅ Verification Checklist

- [ ] `backend/.env` file exists
- [ ] `frontend/.env` file exists
- [ ] PostgreSQL password updated in `backend/.env`
- [ ] Groq API key added to `backend/.env`
- [ ] YouTube API key added to `backend/.env`
- [ ] Database `planmystudy` created
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access http://localhost:5173

---

See [CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md) for complete connection steps!
