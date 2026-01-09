# 🔧 Fix: Rollup Error on Render Deployment

## Problem
Render is trying to build the frontend (Vite/Rollup) instead of just the backend server.

## Root Cause
Render is detecting the root `package.json` (which contains Vite/React) and trying to build it, instead of only building the backend in the `server/` directory.

## ✅ Solution

### Option 1: Set Root Directory in Render Dashboard (Recommended)

1. Go to your Render service dashboard
2. Click **"Settings"**
3. Scroll to **"Build & Deploy"** section
4. Set **"Root Directory"** to: `server`
5. Update commands:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Save and redeploy

### Option 2: Update render.yaml (Already Done)

The `render.yaml` has been updated with `rootDir: server`. If you're using Blueprint deployment, this should work automatically.

### Option 3: Manual Build Command (If above doesn't work)

If setting root directory doesn't work, use explicit path:

**Build Command:**
```bash
cd server && npm install --production
```

**Start Command:**
```bash
cd server && npm start
```

## 🔍 Verify Configuration

Make sure in Render dashboard:
- ✅ **Root Directory:** `server` (or leave empty and use `cd server` in commands)
- ✅ **Build Command:** `npm install` (if rootDir is set) OR `cd server && npm install`
- ✅ **Start Command:** `npm start` (if rootDir is set) OR `cd server && npm start`
- ✅ **Environment:** `Node`

## 📝 Updated render.yaml

The `server/render.yaml` file has been updated with:
```yaml
rootDir: server
buildCommand: npm install
startCommand: npm start
```

## 🚀 Redeploy

After making changes:
1. Save settings in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch the build logs - it should only install backend dependencies

## ✅ Expected Build Output

You should see:
```
Installing dependencies...
added 197 packages...
```

**NOT:**
```
Building frontend...
Rollup error...
```

## 🆘 Still Getting Error?

If you still see Rollup errors:

1. **Check Root Directory:**
   - Render Settings → Root Directory should be `server`

2. **Clear Build Cache:**
   - Render Settings → Clear build cache
   - Redeploy

3. **Verify Commands:**
   - Build: `npm install` (from server directory)
   - Start: `npm start` (from server directory)

4. **Check Logs:**
   - Look at build logs to see which directory it's building from
   - Should show: `Installing in /opt/render/project/src/server`

## 📋 Quick Checklist

- [ ] Root Directory set to `server` in Render dashboard
- [ ] Build Command: `npm install` (no `cd server` needed if rootDir is set)
- [ ] Start Command: `npm start` (no `cd server` needed if rootDir is set)
- [ ] Redeployed after changes
- [ ] Build logs show backend dependencies only

---

**Status:** ✅ Configuration updated. Set Root Directory to `server` in Render dashboard and redeploy.

