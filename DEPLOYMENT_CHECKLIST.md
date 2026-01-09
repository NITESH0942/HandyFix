# 🚀 Deployment Checklist

Quick checklist to ensure your app is ready for Render deployment.

## Pre-Deployment

### Code Preparation
- [x] All code committed to Git
- [x] Code pushed to GitHub
- [x] No sensitive data in code (API keys, passwords, etc.)
- [x] `.env` files in `.gitignore`
- [x] `node_modules` in `.gitignore`

### Configuration Files
- [x] `server/render.yaml` configured
- [x] `Procfile` exists (for Heroku compatibility)
- [x] `server/package.json` has correct start script
- [x] Build and start commands verified

### Security
- [x] Security middleware implemented
- [x] Environment variables documented
- [x] CORS configured
- [x] Rate limiting enabled
- [x] Input validation added

## Render Setup

### Account & Repository
- [ ] Render account created
- [ ] GitHub account connected
- [ ] Repository selected in Render

### Service Configuration
- [ ] Service name set: `home-service-backend`
- [ ] Environment: `Node`
- [ ] Region selected
- [ ] Branch: `main`
- [ ] Build Command: `cd server && npm install`
- [ ] Start Command: `cd server && npm start`
- [ ] Health Check Path: `/api/health`
- [ ] Auto-Deploy: Enabled

### Environment Variables (Required)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `MONGODB_URI` (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` (min 32 characters, random)
- [ ] `CLIENT_URL` (frontend URL)

### Environment Variables (Optional)
- [ ] `GOOGLE_CLIENT_ID` (if using Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
- [ ] `GOOGLE_CALLBACK_URL` (if using Google OAuth)
- [ ] `VONAGE_API_KEY` (if using OTP/SMS)
- [ ] `VONAGE_API_SECRET` (if using OTP/SMS)
- [ ] `VONAGE_FROM_NUMBER` (if using OTP/SMS)
- [ ] `VONAGE_APPLICATION_ID` (if using WhatsApp)
- [ ] `VONAGE_PRIVATE_KEY` (if using WhatsApp)
- [ ] `VONAGE_WHATSAPP_NUMBER` (if using WhatsApp)

## External Services

### MongoDB Atlas
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] Network access configured (IP: `0.0.0.0/0`)
- [ ] Connection string obtained
- [ ] Connection string tested locally

### Google OAuth (if using)
- [ ] Google Cloud Console project created
- [ ] OAuth 2.0 credentials created
- [ ] Authorized JavaScript origins added
- [ ] Redirect URI added: `https://your-app.onrender.com/api/auth/google/callback`
- [ ] Client ID and Secret obtained

### Vonage (if using OTP)
- [ ] Vonage account created
- [ ] API credentials obtained
- [ ] Phone number purchased (if using SMS)
- [ ] Application created (if using WhatsApp)
- [ ] Private key downloaded

## Frontend Configuration

### Netlify/Vercel
- [ ] Frontend deployed
- [ ] Environment variable added: `VITE_API_URL=https://your-app.onrender.com/api`
- [ ] Frontend rebuilt with new API URL
- [ ] CORS tested

## Post-Deployment

### Verification
- [ ] Server is running (check Render dashboard)
- [ ] Health check passes: `https://your-app.onrender.com/api/health`
- [ ] Logs show no errors
- [ ] MongoDB connection successful (check logs)
- [ ] API responds correctly

### Testing
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test Google OAuth (if enabled)
- [ ] Test OTP functionality (if enabled)
- [ ] Test protected routes
- [ ] Test CORS from frontend
- [ ] Test rate limiting

### Security Verification
- [ ] Security headers present (check with browser DevTools)
- [ ] HTTPS working (automatic on Render)
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] Input validation working

## Monitoring

### Setup
- [ ] Logs accessible in Render dashboard
- [ ] Health check monitoring enabled
- [ ] Error alerts configured (optional)

### Ongoing
- [ ] Monitor logs regularly
- [ ] Check for rate limit violations
- [ ] Monitor database connections
- [ ] Review security logs

## Documentation

- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide available

## Quick Commands

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Test Health Endpoint
```bash
curl https://your-app.onrender.com/api/health
```

### Test API
```bash
curl https://your-app.onrender.com/api/health
```

### View Logs
```bash
# In Render dashboard → Logs tab
```

## Common Issues & Solutions

### Issue: Service won't start
- Check build logs
- Verify all environment variables
- Check MongoDB connection string
- Verify PORT is set to 10000

### Issue: CORS errors
- Verify CLIENT_URL matches frontend URL exactly
- Check for trailing slashes
- Verify CORS configuration

### Issue: Database connection failed
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify username/password in connection string

### Issue: Health check failing
- Check server logs
- Verify /api/health endpoint exists
- Check for startup errors

---

**Ready to deploy?** Follow the [Render Deployment Guide](./RENDER_DEPLOYMENT.md)

