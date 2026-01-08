# 🔧 Error Fix Guide

If you're seeing errors, follow these steps:

## Common Errors & Solutions

### 1. "Cannot find module 'framer-motion'"

**Solution:**
```bash
cd frontend
npm install framer-motion
```

### 2. "useAuth must be used within AuthProvider"

**Solution:** Make sure `main.jsx` wraps App with AuthProvider:
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

### 3. "useTheme must be used within ThemeProvider"

**Solution:** Make sure `main.jsx` wraps App with ThemeProvider:
```jsx
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

### 4. Import Errors

**Check these files exist:**
- `src/contexts/ThemeContext.jsx`
- `src/contexts/AuthContext.jsx`
- `src/components/Navbar.jsx`
- `src/components/ThemeToggle.jsx`
- `src/components/SidebarHistory.jsx`

### 5. Build/Runtime Errors

**Try:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 6. Dark Theme Not Working

**Check:**
- `tailwind.config.js` has `darkMode: 'class'`
- `index.css` has dark theme styles
- ThemeContext is working (check localStorage for 'theme')

## Quick Fix Checklist

- [ ] Run `npm install` in frontend folder
- [ ] Check browser console for specific errors
- [ ] Verify all context files exist
- [ ] Restart dev server
- [ ] Clear browser cache

## Still Having Issues?

Share the **exact error message** from:
1. Browser console (F12)
2. Terminal where `npm run dev` is running

This will help identify the specific issue!

