# 🔧 Troubleshooting: Course Generation Failed

If you're seeing "Failed to generate course plan" error, follow these steps:

## ✅ Quick Fixes

### 1. Check Backend Terminal Logs

**Look at your backend terminal** (where you ran `npm run dev`). You should see detailed error messages like:

```
OpenAI attempt 1 failed: { message: '...', status: 401, ... }
```

**Common errors:**
- `401` = Invalid API key
- `429` = Rate limit exceeded
- `402` or `insufficient_quota` = No credits
- `model_not_found` = Model name issue

### 2. Verify API Key

1. Open `backend/.env`
2. Check `OPENAI_API_KEY` starts with `sk-`
3. Make sure there are no extra spaces or quotes
4. The key should be on one line

### 3. Check OpenAI Account

1. Go to https://platform.openai.com/
2. Check your account has credits
3. Verify the API key is active
4. Check usage limits

### 4. Try Different Model

The code now uses `gpt-3.5-turbo` by default. If you want to use GPT-4:

1. Open `backend/src/services/openaiService.js`
2. Find line with `model: 'gpt-3.5-turbo'`
3. Change to `model: 'gpt-4'` or `model: 'gpt-4-turbo-preview'`
4. Restart backend server

### 5. Restart Backend Server

After making changes:

1. Stop backend (Ctrl+C)
2. Restart: `npm run dev`
3. Try generating course again

---

## 🔍 Detailed Debugging

### Check Backend Logs

The backend now logs detailed errors. Look for:

```
OpenAI attempt X failed: { message: '...', status: ..., code: ... }
```

This tells you exactly what went wrong.

### Test API Key Manually

You can test your API key using curl:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key from `.env`.

If you get `401`, the key is invalid.
If you get a list of models, the key works.

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid OpenAI API key"

**Solution:**
1. Verify key in `backend/.env` is correct
2. Make sure key starts with `sk-`
3. Check for extra spaces or newlines
4. Regenerate key at https://platform.openai.com/api-keys

### Issue: "Insufficient quota"

**Solution:**
1. Go to https://platform.openai.com/
2. Add credits to your account
3. Check billing settings

### Issue: "Rate limit exceeded"

**Solution:**
1. Wait a few minutes
2. Check your usage limits
3. Upgrade your OpenAI plan if needed

### Issue: "Model not found"

**Solution:**
1. The code now uses `gpt-3.5-turbo` which should work
2. If you changed it, make sure the model name is correct
3. Check which models your API key has access to

### Issue: "Empty response from OpenAI"

**Solution:**
1. Check your internet connection
2. Try again (might be temporary)
3. Check OpenAI status page

### Issue: "Invalid course plan structure"

**Solution:**
1. This means OpenAI returned JSON but it's missing required fields
2. The code will retry automatically (up to 3 times)
3. If it keeps failing, try a simpler topic or fewer days

---

## 📝 Updated Code

The code has been updated to:
- ✅ Use `gpt-3.5-turbo` (more reliable)
- ✅ Better error messages
- ✅ Detailed logging
- ✅ Automatic retries with better error handling

---

## 🧪 Test Steps

1. **Check backend is running:**
   - Terminal shows: `🚀 Server running on http://localhost:5000`

2. **Check API key:**
   ```bash
   cd backend
   Get-Content .env | Select-String "OPENAI"
   ```

3. **Try generating a simple course:**
   - Topic: "Python Basics"
   - Level: Beginner
   - Days: 3
   - Time: 30 minutes

4. **Watch backend terminal** for error messages

5. **Check browser console** (F12) for any frontend errors

---

## 💡 Still Not Working?

1. **Share the backend terminal error** - This shows the exact issue
2. **Check OpenAI dashboard** - Verify credits and API key status
3. **Try a different topic** - Some topics might be too complex
4. **Reduce days/time** - Try smaller courses first

---

## ✅ Success Indicators

When it works, you'll see:
- Backend terminal: No errors, just normal logs
- Frontend: Course page loads with modules and lessons
- YouTube videos appear under lessons

---

**Need more help?** Check the backend terminal logs - they now show detailed error information!

