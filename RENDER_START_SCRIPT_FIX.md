# 🔧 Fix: "Missing script: start" Error on Render

## ❌ Current Error

```
npm error Missing script: "start"
==> Running 'npm start'
==> Exited with status 1
```

## 🔍 Problem

Render is trying to run `npm start` but can't find the `start` script. This usually means:
1. Root Directory is not set correctly, OR
2. Start Command is not running from the correct directory

## ✅ Solution

### Check Your Render Configuration

Go to Render Dashboard → Settings → Build & Deploy and verify:

#### 1. Root Directory
- **Must be set to:** `server`
- This tells Render to work in the `server/` folder

#### 2. Start Command
Since Root Directory is set to `server`, your Start Command should be:
```
npm start
```

**NOT:**
- ❌ `server/ $ npm start` (wrong - already in server directory)
- ❌ `cd server && npm start` (wrong - already in server directory)
- ✅ `npm start` (correct)

#### 3. Build Command
Should be:
```
npm install
```

**NOT:**
- ❌ `npm install; npm run build` (wrong - no build needed)
- ✅ `npm install` (correct)

## 📋 Complete Correct Configuration

**Root Directory:** `server`

**Build Command:** 
```
npm install
```

**Start Command:**
```
npm start
```

## 🔍 Verify server/package.json

Make sure `server/package.json` has the start script:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

## 🆘 If Root Directory Doesn't Work

If setting Root Directory to `server` doesn't work, use explicit paths:

**Build Command:**
```
cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

**Root Directory:** Leave empty

## ✅ Expected Result

After fixing, you should see in logs:
```
==> Running 'npm start'
> node index.js
Server running on port 10000
API URL: http://localhost:10000/api
```

## 📝 Quick Fix Checklist

1. **Root Directory = `server`** ✅
2. **Build Command = `npm install`** ✅ (no `npm run build`)
3. **Start Command = `npm start`** ✅ (not `cd server && npm start`)
4. **Save Changes** ✅
5. **Redeploy** ✅

## 🔄 Alternative: Check Root Directory Setting

If the error persists:
1. Delete the service on Render
2. Create a new service
3. Set Root Directory to `server` from the start
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`

---

**The key:** Make sure Root Directory is `server` AND Start Command is just `npm start` (not with `cd server`).

