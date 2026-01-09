# ⚡ Quick Start: Deploy to Render in 5 Minutes

## 🚀 Fast Deployment Steps

### 1. Push to GitHub (if not done)
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Create Render Service
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `NITESH0942/HandyFiX.online`
4. Configure:
   - **Name:** `home-service-backend`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`

### 3. Add Environment Variables
Click **"Environment"** and add:

**Required (Minimum):**
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generate_with_openssl_rand_base64_32
CLIENT_URL=https://your-frontend-url.netlify.app
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### 4. Deploy
Click **"Create Web Service"** → Wait 2-5 minutes

### 5. Verify
```bash
curl https://your-app-name.onrender.com/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

### 6. Update Frontend
Add to your frontend environment variables:
```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

## ✅ Done!

Your server is now live at: `https://your-app-name.onrender.com`

---

**Need more details?** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

