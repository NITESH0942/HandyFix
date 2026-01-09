# 🚀 Render Deployment Guide

Complete guide to deploy your Home Service backend to Render.

## ✅ Pre-Deployment Checklist

- [x] Code is pushed to GitHub
- [x] MongoDB Atlas cluster created
- [x] Environment variables documented
- [x] Security features implemented
- [x] Render configuration file ready

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository: `NITESH0942/HandyFiX.online` (or your repo name)

### Step 4: Configure Service Settings

**Basic Settings:**
- **Name:** `home-service-backend` (or your preferred name)
- **Environment:** `Node`
- **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (we'll use `cd server` in commands)

**Build & Deploy:**
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Auto-Deploy:** `Yes` (deploys on every push to main branch)

**Advanced Settings (Optional):**
- **Health Check Path:** `/api/health`
- **Dockerfile Path:** Leave empty

### Step 5: Set Environment Variables

Click **"Environment"** tab and add these variables:

#### Required Variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_random_string
CLIENT_URL=https://your-frontend-app.netlify.app
```

#### Optional Variables (if using features):

**Google OAuth:**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/auth/google/callback
```

**Vonage (OTP/SMS):**
```env
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=+1234567890
VONAGE_APPLICATION_ID=your_vonage_app_id
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----"
VONAGE_WHATSAPP_NUMBER=14155552671
```

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Run the build command
   - Start your server
3. Wait 2-5 minutes for deployment
4. Your server will be available at: `https://your-app-name.onrender.com`

### Step 7: Verify Deployment

1. **Check Health Endpoint:**
   ```bash
   curl https://your-app-name.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Check Logs:**
   - Go to your service dashboard
   - Click **"Logs"** tab
   - Verify no errors

3. **Test API:**
   ```bash
   curl https://your-app-name.onrender.com/api/health
   ```

### Step 8: Update External Services

#### Update Google OAuth (if using):

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URI:
   ```
   https://your-app-name.onrender.com/api/auth/google/callback
   ```
5. Save changes

#### Update Frontend (Netlify/Vercel):

Add environment variable in your frontend deployment:

```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

## 🔧 Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:

1. The file is already configured at `server/render.yaml`
2. In Render dashboard:
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repo
   - Render will automatically detect `render.yaml`
   - Review and deploy

**Note:** You'll still need to set environment variables manually in the dashboard (the `sync: false` ones).

## 📊 Monitoring & Logs

### View Logs:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. View real-time logs

### Monitor Health:
- Health check endpoint: `/api/health`
- Render automatically monitors this endpoint
- Service restarts if health check fails

## 🔄 Auto-Deploy

Render automatically deploys when you push to your main branch:
1. Push code to GitHub
2. Render detects the push
3. Runs build command
4. Deploys new version
5. Zero-downtime deployment (if healthy)

## 🛠️ Troubleshooting

### Server Won't Start

**Check:**
1. Build logs for errors
2. All environment variables are set
3. MongoDB URI is correct
4. Port is set to `10000` (Render's default)

**Common Issues:**
```bash
# Error: Cannot find module
# Solution: Check build command includes 'cd server'

# Error: MongoDB connection failed
# Solution: 
# - Verify MONGODB_URI is correct
# - Whitelist IP 0.0.0.0/0 in MongoDB Atlas
# - Check username/password in connection string

# Error: Port already in use
# Solution: Use PORT=10000 (Render's default)
```

### CORS Errors

**Symptoms:** Frontend can't connect to API

**Solution:**
1. Verify `CLIENT_URL` matches your frontend URL exactly
2. No trailing slashes
3. Include protocol (https://)
4. Check CORS logs in server logs

### Rate Limiting Issues

If you're hitting rate limits:
1. Check rate limit settings in `server/middleware/security.js`
2. Adjust limits if needed
3. Check logs for rate limit violations

### Health Check Failing

**Symptoms:** Service keeps restarting

**Check:**
1. Health endpoint: `/api/health`
2. Server logs for errors
3. Database connection
4. Environment variables

## 📝 Environment Variables Reference

### Required:
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your_random_secret_key` |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-app.netlify.app` |

### Optional:
| Variable | Description | Required For |
|----------|-------------|--------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Google Login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Google Login |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | Google Login |
| `VONAGE_API_KEY` | Vonage API key | OTP/SMS |
| `VONAGE_API_SECRET` | Vonage API secret | OTP/SMS |
| `VONAGE_FROM_NUMBER` | Vonage phone number | OTP/SMS |
| `VONAGE_APPLICATION_ID` | Vonage app ID | WhatsApp OTP |
| `VONAGE_PRIVATE_KEY` | Vonage private key | WhatsApp OTP |
| `VONAGE_WHATSAPP_NUMBER` | WhatsApp number | WhatsApp OTP |

## 🔒 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **HTTPS is automatic** - Render provides SSL certificates
4. **Security headers are enabled** - See `server/middleware/security.js`
5. **Rate limiting is active** - Protects against abuse

## 💰 Render Free Tier

**Limitations:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for always-on service)
- Automatic SSL certificates
- Custom domains supported

**Upgrade if you need:**
- Always-on service (no spin-down)
- More resources
- Better performance

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Security Documentation](./server/SECURITY.md)

## ✅ Post-Deployment Checklist

- [ ] Server is running (check `/api/health`)
- [ ] MongoDB connection works (check logs)
- [ ] Google OAuth callback URL updated (if using)
- [ ] Frontend API URL updated
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test Google OAuth (if enabled)
- [ ] Test OTP functionality (if enabled)
- [ ] Verify CORS is working
- [ ] Check security headers (use browser DevTools)
- [ ] Monitor logs for errors

## 🎉 Success!

Your server is now deployed and ready to use!

**Your API URL:** `https://your-app-name.onrender.com/api`

**Next Steps:**
1. Update frontend to use the new API URL
2. Test all functionality
3. Monitor logs for any issues
4. Set up custom domain (optional)

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review server logs.

