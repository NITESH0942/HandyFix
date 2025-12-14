# Server Deployment Guide

This guide will help you deploy the Home Service backend server to a cloud platform.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. **GitHub Repository**
   - Push your code to GitHub (if not already done)

3. **Netlify Frontend URL**
   - Your deployed frontend URL (e.g., `https://your-app.netlify.app`)

---

## Option 1: Deploy to Render (Recommended)

Render offers a free tier with automatic deployments from GitHub.

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository containing your code

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `home-service-backend` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)

**Build & Deploy:**
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Root Directory:** Leave empty (or set to root of your repo)

### Step 4: Set Environment Variables

Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
CLIENT_URL=https://your-app.netlify.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-render-app.onrender.com/api/auth/google/callback
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=+1234567890
VONAGE_APPLICATION_ID=your_vonage_app_id
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
VONAGE_WHATSAPP_NUMBER=14155552671
```

**Important Notes:**
- Replace `your-render-app.onrender.com` with your actual Render URL
- For `VONAGE_PRIVATE_KEY`, keep the entire key on one line with `\n` for newlines
- You can skip Vonage variables if not using OTP functionality

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your app
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your server will be available at: `https://your-app.onrender.com`

### Step 6: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client
3. Add authorized redirect URI:
   - `https://your-app.onrender.com/api/auth/google/callback`
4. Save changes

### Step 7: Update Frontend API URL

Update your frontend `.env` or Netlify environment variables:

```env
VITE_API_URL=https://your-app.onrender.com/api
```

---

## Option 2: Deploy to Railway

Railway offers a simple deployment process with a free tier.

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository

### Step 3: Configure Service

1. Railway will auto-detect Node.js
2. Set **Root Directory** to `server` (if deploying from root)
3. Or set **Start Command** to `cd server && npm start`

### Step 4: Set Environment Variables

Click on your service → **"Variables"** tab → Add all environment variables (same as Render above)

### Step 5: Deploy

1. Railway will automatically deploy
2. Click **"Settings"** → **"Generate Domain"** to get your public URL
3. Update Google OAuth and frontend API URL with the Railway domain

---

## Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI

```bash
# Windows (using Chocolatey)
choco install heroku-cli

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
cd "C:\html css java\PROJECT\Homeservice\home-service"
heroku create your-app-name
```

### Step 4: Set Buildpack

```bash
heroku buildpacks:set heroku/nodejs
```

### Step 5: Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLIENT_URL=https://your-app.netlify.app
# ... add all other variables
```

### Step 6: Deploy

```bash
git push heroku main
```

---

## Post-Deployment Checklist

- [ ] Server is accessible at the deployment URL
- [ ] Health check endpoint works: `https://your-server.com/api/health`
- [ ] MongoDB connection is working
- [ ] Google OAuth callback URL is updated in Google Cloud Console
- [ ] Frontend API URL is updated in Netlify environment variables
- [ ] CORS is allowing requests from Netlify frontend
- [ ] All environment variables are set correctly

---

## Troubleshooting

### Server won't start
- Check build logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### CORS errors
- Verify `CLIENT_URL` matches your Netlify URL exactly
- Check that CORS middleware is configured correctly

### Google OAuth not working
- Verify callback URL in Google Cloud Console matches deployment URL
- Check that `GOOGLE_CALLBACK_URL` environment variable is set correctly

### Database connection issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Check MongoDB connection string format
- Ensure database user has proper permissions

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (production/development) | Yes |
| `PORT` | Server port (usually auto-set by platform) | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLIENT_URL` | Frontend URL (Netlify) | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | Optional |
| `VONAGE_API_KEY` | Vonage API key for OTP | Optional |
| `VONAGE_API_SECRET` | Vonage API secret | Optional |
| `VONAGE_FROM_NUMBER` | Vonage phone number | Optional |
| `VONAGE_APPLICATION_ID` | Vonage application ID | Optional |
| `VONAGE_PRIVATE_KEY` | Vonage private key | Optional |
| `VONAGE_WHATSAPP_NUMBER` | Vonage WhatsApp number | Optional |

---

## Support

If you encounter issues, check:
1. Server logs in your deployment platform
2. Network tab in browser DevTools
3. MongoDB Atlas connection logs
4. Google Cloud Console OAuth settings

