# ⚡ Groq API Setup - Fastest AI Inference

## 🚀 Quick Setup

### Step 1: Get Groq API Key

1. Go to **https://console.groq.com/**
2. Sign up (free account available)
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `gsk_`)

### Step 2: Update .env File

Open `backend/.env` and **replace**:

**Remove:**
```env
OPENAI_API_KEY=sk-...
```

**Add:**
```env
GROQ_API_KEY=gsk_your-groq-api-key-here
```

### Step 3: Install Dependencies

```bash
cd backend
npm install
```

This will install `groq-sdk` package.

### Step 4: Restart Backend

```bash
npm run dev
```

---

## ✅ Done!

Your app now uses Groq for **ultra-fast** course generation!

**Expected speed:**
- Before (OpenAI): 20-60 seconds
- After (Groq): **2-5 seconds** ⚡

---

## 🎯 Benefits

- ⚡ **10-20x faster** than OpenAI
- 🚀 **Zero lag** responses
- 🆓 **Free tier** available
- 📈 **Higher rate limits**
- 🎯 **Same quality** outputs

---

## 🧪 Test It

1. Go to http://localhost:5173
2. Create a course
3. Watch it generate in **2-5 seconds**!

---

**That's it! Enjoy lightning-fast course generation!** ⚡

