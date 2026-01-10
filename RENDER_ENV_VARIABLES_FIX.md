# 🔧 Fix: Missing Environment Variables on Render

## ✅ Good News!
The build is now working! But the server is failing to start because **environment variables are missing**.

## ❌ Current Errors

1. **Critical Error:** `MONGODB_URI` is undefined
   - Server cannot connect to database
   - Server exits with error

2. **Warning:** Google OAuth credentials missing
   - `GOOGLE_CLIENT_ID: Missing`
   - `GOOGLE_CLIENT_SECRET: Missing`
   - This won't prevent startup, but Google login won't work

## ✅ Solution: Add Environment Variables

### Step 1: Go to Render Dashboard
1. Open your Render service: **HandyFix**
2. Click **"Environment"** (left sidebar)

### Step 2: Add Required Environment Variables

Click **"Add Environment Variable"** for each of these:

#### 🔴 REQUIRED (Server won't start without these):

**1. MONGODB_URI**
- **Key:** `MONGODB_URI`
- **Value:** Your MongoDB Atlas connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
  - Get it from MongoDB Atlas → Connect → Connect your application

**2. JWT_SECRET**
- **Key:** `JWT_SECRET`
- **Value:** A random secret string (min 32 characters)
  - Generate with: `openssl rand -base64 32`
  - Or use any random string like: `my_super_secret_jwt_key_12345678901234567890`

**3. PORT**
- **Key:** `PORT`
- **Value:** `10000`
  - Render automatically sets this, but you can set it explicitly

**4. NODE_ENV**
- **Key:** `NODE_ENV`
- **Value:** `production`

**5. CLIENT_URL**
- **Key:** `CLIENT_URL`
- **Value:** Your frontend URL (e.g., `https://your-app.netlify.app`)
  - This is for CORS configuration
  - If you don't have frontend yet, use: `http://localhost:5173`

#### 🟡 OPTIONAL (For Google OAuth):

**6. GOOGLE_CLIENT_ID**
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** Your Google OAuth Client ID
  - Get from Google Cloud Console

**7. GOOGLE_CLIENT_SECRET**
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** Your Google OAuth Client Secret
  - Get from Google Cloud Console

**8. GOOGLE_CALLBACK_URL**
- **Key:** `GOOGLE_CALLBACK_URL`
- **Value:** `https://your-render-app.onrender.com/api/auth/google/callback`
  - Replace `your-render-app` with your actual Render app name

#### 🟡 OPTIONAL (For OTP/SMS via Vonage):

**9-14. Vonage Variables** (Only if using OTP/SMS)
- `VONAGE_API_KEY`
- `VONAGE_API_SECRET`
- `VONAGE_FROM_NUMBER`
- `VONAGE_APPLICATION_ID`
- `VONAGE_PRIVATE_KEY`
- `VONAGE_WHATSAPP_NUMBER`

### Step 3: Save Changes
1. Click **"Save Changes"** after adding all variables
2. Render will automatically restart your service

### Step 4: Verify
Check the logs - you should see:
```
✅ MongoDB Connected: ...
Server running on port 10000
API URL: http://localhost:10000/api
```

## 📋 Quick Checklist - Minimum Required

To get the server running, you **MUST** add at least:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Random secret key (32+ chars)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Set to `10000` (optional, Render sets this)
- [ ] `CLIENT_URL` - Your frontend URL (for CORS)

## 🔍 How to Get MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Click **"Connect"** on your cluster
4. Select **"Connect your application"**
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with your database name (e.g., `homeservice`)

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/homeservice?retryWrites=true&w=majority
```

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
Any random string at least 32 characters long:
```
my_super_secret_jwt_key_for_production_12345678901234567890
```

## ✅ Expected Result

After adding environment variables, you should see in logs:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database Name: homeservice
Server running on port 10000
API URL: http://localhost:10000/api
```

## 🆘 Troubleshooting

**Still seeing MongoDB error?**
- Check MONGODB_URI format - must start with `mongodb://` or `mongodb+srv://`
- Verify password doesn't have special characters that need URL encoding
- Check MongoDB Atlas → Network Access → Allow IP `0.0.0.0/0`

**Server still not starting?**
- Check all required variables are set
- Verify no typos in variable names
- Check logs for specific error messages

---

**Add the required environment variables and your server will start!** 🚀

