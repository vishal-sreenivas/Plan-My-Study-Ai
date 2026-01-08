# Backend Environment Setup

## Create .env file

Create a file named `.env` in the `backend/` directory with the following content:

```env
PORT=5000
NODE_ENV=development

# Database - Replace with your PostgreSQL credentials
# Format: postgresql://username:password@host:port/database?schema=public
DATABASE_URL="postgresql://username:password@localhost:5432/planmystudy?schema=public"

# JWT Secret - Generate a random string (minimum 32 characters)
# You can generate one using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Groq API Key (Fastest AI inference - zero lag!)
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_your-groq-api-key-here

# YouTube Data API Key
# Get from: https://console.cloud.google.com/
# Enable "YouTube Data API v3" first
YOUTUBE_API_KEY=your-youtube-api-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Steps to Get API Keys

### 1. Groq API Key (NEW - Replaces OpenAI)

1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)
6. **Free tier available** with generous limits!

**Benefits of Groq:**
- ⚡ Ultra-fast inference (10-20x faster than OpenAI)
- 🚀 Zero lag responses
- 💰 Free tier available
- 🎯 High quality outputs

### 2. YouTube Data API Key

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to Credentials
5. Create Credentials → API Key
6. (Optional) Restrict the key to YouTube Data API v3
7. Copy the API key

### 3. PostgreSQL Database

1. Install PostgreSQL if not already installed
2. Create a database:
   ```sql
   CREATE DATABASE planmystudy;
   ```
3. Note your connection details:
   - Username (usually `postgres`)
   - Password
   - Host (usually `localhost`)
   - Port (usually `5432`)

### 4. JWT Secret

Generate a secure random string:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use an online generator: https://www.random.org/strings/

---

## Verification

After creating `.env`, verify it's correct:

1. All variables are set
2. No quotes around values (except DATABASE_URL which needs quotes)
3. Database URL format is correct
4. API keys are valid

Then run:
```bash
npm run dev
```

If you see "❌ Missing required environment variables", check your `.env` file.

---

## Migration from OpenAI to Groq

If you were using OpenAI before:

1. **Remove** `OPENAI_API_KEY` from `.env`
2. **Add** `GROQ_API_KEY` to `.env`
3. **Get Groq API key** from https://console.groq.com/
4. **Restart backend** server

That's it! The code has been updated to use Groq automatically.
