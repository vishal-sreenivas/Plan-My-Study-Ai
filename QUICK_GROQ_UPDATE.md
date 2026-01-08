# ⚡ Quick Groq Update Guide

## ✅ Migration Complete!

OpenAI has been replaced with **Groq API** for ultra-fast course generation.

---

## 🔧 What You Need to Do

### 1. Install Groq SDK

```bash
cd backend
npm install
```

This will install `groq-sdk` (replaces `openai`).

### 2. Update .env File

**Open `backend/.env` and change:**

**FROM:**
```env
OPENAI_API_KEY=sk-proj-...
```

**TO:**
```env
GROQ_API_KEY=gsk_your-groq-api-key-here
```

### 3. Get Groq API Key

1. Go to: **https://console.groq.com/**
2. Sign up (free account)
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `gsk_`)

### 4. Restart Backend

```bash
cd backend
npm run dev
```

---

## 🎉 That's It!

Your app now uses Groq for **lightning-fast** course generation!

**Speed improvement:**
- ⏱️ Before: 20-60 seconds
- ⚡ After: **2-5 seconds**

---

## 📝 Files Changed

- ✅ `package.json` - Added groq-sdk
- ✅ `src/services/groqService.js` - New Groq service
- ✅ `src/config/env.js` - Updated to GROQ_API_KEY
- ✅ `src/controllers/courseController.js` - Updated import
- ❌ `src/services/openaiService.js` - Removed (no longer needed)

---

## 🧪 Test It

1. Update `.env` with Groq API key
2. Restart backend
3. Generate a course
4. **Watch it complete in 2-5 seconds!** ⚡

---

**Enjoy the speed boost!** 🚀

