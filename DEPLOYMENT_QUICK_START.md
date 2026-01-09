# Quick Deployment Guide

## 🚀 Deploy to Render (Easiest - Recommended)

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 3. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `home-service-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`

### 4. Add Environment Variables
Click **"Environment"** and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_min_32_chars
CLIENT_URL=https://your-netlify-app.netlify.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/auth/google/callback
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

### 5. Deploy
- Click **"Create Web Service"**
- Wait 2-5 minutes
- Your server URL: `https://your-app.onrender.com`

### 6. Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Edit your OAuth client
3. Add redirect URI: `https://your-app.onrender.com/api/auth/google/callback`

### 7. Update Frontend
In Netlify, add environment variable:
```
VITE_API_URL=https://your-app.onrender.com/api
```

---

## 📋 Environment Variables Checklist

Copy these and fill in your values:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
CLIENT_URL=https://your-netlify-app.netlify.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/auth/google/callback
```

**Optional (for OTP):**
```env
VONAGE_API_KEY=your_vonage_key
VONAGE_API_SECRET=your_vonage_secret
VONAGE_FROM_NUMBER=+1234567890
```

---

## ✅ Post-Deployment Checklist

- [ ] Server is running (check `/api/health`)
- [ ] MongoDB connection works
- [ ] Google OAuth callback URL updated
- [ ] Frontend API URL updated in Netlify
- [ ] Test login/register
- [ ] Test Google OAuth (if enabled)

---

## 🔧 Troubleshooting

**Server won't start:**
- Check build logs
- Verify all env variables are set
- Ensure MongoDB URI is correct

**CORS errors:**
- Verify `CLIENT_URL` matches Netlify URL exactly
- Check for trailing slashes

**Database errors:**
- Whitelist IP `0.0.0.0/0` in MongoDB Atlas
- Check connection string format

---

For detailed instructions, see `server/DEPLOYMENT.md`

