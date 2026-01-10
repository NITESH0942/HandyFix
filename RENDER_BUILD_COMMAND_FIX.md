# 🔧 Fix: Build Command Error on Render

## ❌ Current Problem

Your **Build Command** in Render is set to:
```
server/ $ npm install; npm run build
```

This is **WRONG** because:
- The backend server doesn't have a `build` script
- It's trying to run `npm run build` which doesn't exist
- Backend servers don't need to build - just install dependencies

## ✅ Fix - Update Build Command

### Step 1: Edit Build Command
1. In Render dashboard, go to **Settings** → **Build & Deploy**
2. Find **"Build Command"** section
3. Click **"Edit"** button

### Step 2: Change Build Command To:
```
npm install
```

**OR** (if Render requires the prefix):
```
server/ $ npm install
```

### Step 3: Remove `npm run build`
- **DELETE** the `; npm run build` part
- **ONLY KEEP** `npm install` (or `server/ $ npm install`)

### Step 4: Save and Redeploy
1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**

## ✅ Correct Configuration

**Root Directory:** `server` ✅ (Already correct)

**Build Command:** 
```
npm install
```
OR
```
server/ $ npm install
```
(Remove `; npm run build`)

**Start Command:** 
```
npm start
```
OR
```
server/ $ npm start
```
✅ (Already correct)

## 📋 Why This Happens

- Backend servers (Node.js/Express) don't need a build step
- They just need dependencies installed (`npm install`)
- Then they start with `npm start`
- Frontend apps need `npm run build`, but backend doesn't

## ✅ Expected Result After Fix

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

## 🚨 Quick Fix Summary

**Current (WRONG):**
```
server/ $ npm install; npm run build
```

**Should Be (CORRECT):**
```
npm install
```

**OR**
```
server/ $ npm install
```

---

**The key:** Remove `; npm run build` from the Build Command!

