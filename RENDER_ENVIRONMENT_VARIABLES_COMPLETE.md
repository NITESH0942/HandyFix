# 🔧 Fix: MongoDB Connection Error - Missing Environment Variables

## ✅ Good News!
Your server is **starting successfully** now! 🎉

The build works, `npm start` works, but the server is **crashing** because environment variables are missing.

## ❌ Current Error

```
MongoDB Connection Error: The 'uri' parameter to 'openUri()' must be a string, got "undefined"
```

This means `MONGODB_URI` environment variable is **not set** in Render.

## ✅ Solution: Add Environment Variables to Render

### Step 1: Go to Render Dashboard
1. Open your Render service: **home-service-backend**
2. Click **"Environment"** (left sidebar)

### Step 2: Add Required Environment Variables

Click **"Add Environment Variable"** for each:

#### 🔴 REQUIRED (Server won't start without these):

**1. MONGODB_URI** ⚠️ **CRITICAL - Add This First!**
- **Key:** `MONGODB_URI`
- **Value:** Your MongoDB Atlas connection string
- **Format:** `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority`
- **Example:** `mongodb+srv://NITESH0942:MyPassword123@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority`
- **How to get:** MongoDB Atlas → Connect → Connect your application → Copy connection string

**2. JWT_SECRET** ⚠️ **REQUIRED**
- **Key:** `JWT_SECRET`
- **Value:** Random secret string (minimum 32 characters)
- **Generate:** `openssl rand -base64 32`
- **Or use:** `my_super_secret_jwt_key_for_production_12345678901234567890`

**3. NODE_ENV** ⚠️ **REQUIRED**
- **Key:** `NODE_ENV`
- **Value:** `production`

**4. PORT** (Usually auto-set by Render, but you can set it)
- **Key:** `PORT`
- **Value:** `10000`

**5. CLIENT_URL** ⚠️ **REQUIRED for CORS**
- **Key:** `CLIENT_URL`
- **Value:** Your frontend URL (where your React app is deployed)
- **Example:** `https://your-app.netlify.app`
- **Or temporarily:** `http://localhost:5173` (if frontend not deployed yet)

#### 🟡 OPTIONAL (For Google OAuth - Only if you want Google login):

**6. GOOGLE_CLIENT_ID**
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** Your Google OAuth Client ID from Google Cloud Console

**7. GOOGLE_CLIENT_SECRET**
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** Your Google OAuth Client Secret

**8. GOOGLE_CALLBACK_URL**
- **Key:** `GOOGLE_CALLBACK_URL`
- **Value:** `https://your-render-app.onrender.com/api/auth/google/callback`
- Replace `your-render-app` with your actual Render app name

## 📋 Step-by-Step: Add MONGODB_URI

### Step 1: Get MongoDB Connection String from Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in
3. Click **"Connect"** on your cluster
4. Select **"Connect your application"**
5. Copy the connection string:
   ```
   mongodb+srv://NITESH0942:<password>@cluster0.sgbibbg.mongodb.net/?appName=Cluster0
   ```

### Step 2: Format the Connection String

**Replace:**
- `<password>` → Your actual database password
- Add database name: `/homeservice` (or your database name)
- Add connection options: `?retryWrites=true&w=majority`

**Final format:**
```
mongodb+srv://NITESH0942:YOUR_PASSWORD@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
```

**Example:**
If your password is `MyPass123`:
```
mongodb+srv://NITESH0942:MyPass123@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
```

### Step 3: URL Encode Special Characters (If Needed)

If your password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

**Example:** Password `P@ss#123` becomes `P%40ss%23123`

### Step 4: Add to Render

1. Render Dashboard → Your Service → **Environment**
2. Click **"Add Environment Variable"**
3. Set:
   - **Key:** `MONGODB_URI`
   - **Value:** Your formatted connection string
4. Click **"Save"**

## 🔐 Generate JWT_SECRET

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Manual**
Any random string at least 32 characters:
```
my_super_secret_jwt_key_for_production_12345678901234567890
```

## ✅ Complete Minimum Setup

To get your server running, you **MUST** add these 5 environment variables:

```env
MONGODB_URI=mongodb+srv://NITESH0942:YOUR_PASSWORD@cluster0.sgbibbg.mongodb.net/homeservice?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_min_32_characters_long
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend-url.netlify.app
```

## ✅ Expected Result After Adding Variables

After adding environment variables and Render restarts, you should see:

```
✅ MongoDB Connected: cluster0.sgbibbg.mongodb.net
📊 Database Name: homeservice
Server running on port 10000
API URL: http://localhost:10000/api
```

**NOT:**
```
❌ MongoDB Connection Error: The 'uri' parameter to 'openUri()' must be a string, got "undefined"
```

## 🆘 Troubleshooting

### MongoDB Connection Still Fails?

1. **Verify connection string format:**
   - Must start with `mongodb+srv://` or `mongodb://`
   - Check username and password are correct
   - Verify database name exists

2. **Check MongoDB Atlas Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Make sure IP `0.0.0.0/0` is allowed (allows all IPs)
   - Or add Render's IP addresses

3. **Verify Database User:**
   - Go to MongoDB Atlas → Database Access
   - Check user `NITESH0942` exists and has permissions
   - Verify password is correct

4. **Test connection string locally first:**
   - Create a `.env` file in `server/` folder
   - Add `MONGODB_URI=your_connection_string`
   - Run `npm start` locally to test

### Server Still Not Starting?

1. **Check all required variables are set:**
   - `MONGODB_URI` ✅
   - `JWT_SECRET` ✅
   - `NODE_ENV` ✅
   - `CLIENT_URL` ✅

2. **Check for typos in variable names:**
   - Must be exactly: `MONGODB_URI` (case-sensitive)
   - No spaces, no extra characters

3. **Check Render logs:**
   - Look for specific error messages
   - Verify variables are being read

## 📝 Quick Checklist

- [ ] `MONGODB_URI` added (formatted correctly)
- [ ] `JWT_SECRET` added (32+ characters)
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` set to `10000` (optional)
- [ ] `CLIENT_URL` added (frontend URL)
- [ ] All variables saved in Render
- [ ] Service restarted automatically
- [ ] Check logs for success message

---

**Priority:** Add `MONGODB_URI` first - this is the critical missing variable causing the error!

