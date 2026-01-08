# 🔍 Check for Errors

## Step 1: Check Browser Console

1. Open your browser
2. Go to http://localhost:5173
3. Press **F12** to open Developer Tools
4. Click **Console** tab
5. Look for **red error messages**
6. Copy the error message and share it

## Step 2: Check Terminal

Look at the terminal where you ran `npm run dev`:
- Are there any error messages?
- Does it say "Compiled successfully" or errors?

## Step 3: Common Issues

### Issue: "Cannot find module"
**Fix:**
```bash
cd frontend
npm install
```

### Issue: "useAuth/useTheme must be used within Provider"
**Fix:** Check `main.jsx` has both providers wrapping App

### Issue: Import errors
**Fix:** Make sure all files exist in the correct locations

## Step 4: Quick Fix

Run these commands:
```bash
cd frontend
npm install
npm run dev
```

Then check:
1. Browser console (F12)
2. Terminal output
3. Share the exact error message

---

**Please share:**
1. The exact error message from browser console
2. Any errors from terminal
3. What page/action causes the error

This will help fix it quickly!

