# 🔧 Fix: "Missing script: build" Error

## Problem
Render is trying to run `npm run build` but the backend server doesn't have a build script (which is correct - it's a Node.js server, not a frontend app).

## ✅ Solution

### In Render Dashboard:

1. **Go to Settings** → **Build & Deploy**

2. **Build Command:**
   ```
   npm install
   ```
   (NOT `npm run build` - just install dependencies)

3. **Start Command:**
   ```
   npm start
   ```

4. **Root Directory:**
   ```
   server
   ```

5. **Save and Redeploy**

## 📋 Correct Configuration

**Build Command:** `npm install`
- This only installs dependencies
- No build step needed for Node.js backend

**Start Command:** `npm start`
- This runs `node index.js` (from server/package.json)

**Root Directory:** `server`
- Tells Render to work in the server folder

## ❌ Wrong Configuration

**Build Command:** `npm run build` ❌
- This tries to find a "build" script that doesn't exist
- Backend servers don't need to build

## ✅ Expected Build Output

You should see:
```
Installing dependencies...
added 197 packages...
```

Then:
```
Server running on port 10000
API URL: http://localhost:10000/api
```

## 🆘 If Still Not Working

1. **Clear Build Cache:**
   - Settings → Clear build cache
   - Redeploy

2. **Verify package.json:**
   - Make sure `server/package.json` has `"start": "node index.js"`

3. **Check Root Directory:**
   - Must be exactly: `server` (not `./server` or `/server`)

---

**The key:** Build Command should be `npm install`, NOT `npm run build`!

