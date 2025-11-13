# 🚀 Deployment Guide

This guide walks you through deploying the Shipment Operations Dashboard to production.

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Git installed locally
- [ ] Project pushed to GitHub repository
- [ ] ParcelMonkey API credentials (optional)

## 🎯 Deployment Options

### Option 1: GitHub Pages + Render (Recommended)
- ✅ Free
- ✅ Easy to set up
- ✅ Automatic deployments
- ✅ Custom domain support

### Option 2: Vercel (All-in-One)
- ✅ Free hobby tier
- ✅ Automatic HTTPS
- ✅ Excellent performance
- ⚠️ Requires slight restructuring

### Option 3: Railway
- ✅ $5 free credit
- ✅ Simple setup
- ✅ Built-in monitoring

---

## 📦 Option 1: GitHub Pages + Render

### Part A: Deploy Backend to Render

#### Step 1: Prepare Backend for Deployment

1. **Create a `.env.example` file** in `parcelmonkey-backend/`:

```bash
PM_USER_ID=your_user_id_here
PM_API_KEY=your_api_key_here
PORT=3001
```

2. **Update `server.js`** to use PORT from environment:

Already done! Line 354 has: `const PORT = process.env.PORT || 3001;`

#### Step 2: Deploy to Render

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```
Name: shipment-dashboard-api
Region: Choose closest to you
Branch: main
Root Directory: parcelmonkey-backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

5. **Add Environment Variables** (Optional):
   - Click "Environment" tab
   - Add `PM_USER_ID` and `PM_API_KEY` if you have them

6. Click **"Create Web Service"**

7. Wait for deployment (2-3 minutes)

8. Copy your backend URL (e.g., `https://shipment-dashboard-api.onrender.com`)

⚠️ **Note**: Free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

### Part B: Update Frontend with Backend URL

1. **Open your HTML file** and find this section (search for `API_URL`):

```javascript
const API_URL = 'http://localhost:3001/api/shipping-rates';
```

2. **Replace with your Render URL**:

```javascript
const API_URL = 'https://shipment-dashboard-api.onrender.com/api/shipping-rates';
```

3. **Save the file**

### Part C: Deploy Frontend to GitHub Pages

#### Step 3: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Shipment Operations Dashboard"

# Create repository on GitHub (do this via GitHub website)
# Then link it:
git remote add origin https://github.com/YOUR-USERNAME/shipment-operations-dashboard.git

# Push
git branch -M main
git push -u origin main
```

#### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-3 minutes

Your site will be live at:
```
https://YOUR-USERNAME.github.io/shipment-operations-dashboard/Shipment%20Operations%20Dashboard.html
```

#### Step 5: (Optional) Rename HTML for Cleaner URL

Rename your HTML file:
```bash
mv "Shipment Operations Dashboard.html" index.html
git add .
git commit -m "Rename to index.html for cleaner URL"
git push
```

Now accessible at:
```
https://YOUR-USERNAME.github.io/shipment-operations-dashboard/
```

---

## 📦 Option 2: Deploy Everything to Vercel

### Step 1: Restructure Project

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "parcelmonkey-backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "parcelmonkey-backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 2: Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then:
vercel --prod
```

---

## 📦 Option 3: Deploy to Railway

### Step 1: Deploy Backend

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - Root Directory: `parcelmonkey-backend`
   - Start Command: `npm start`
5. Add environment variables if needed
6. Deploy

### Step 2: Deploy Frontend

Same as GitHub Pages method above, but use Railway's URL for the backend.

---

## 🔒 Security Best Practices

### 1. Environment Variables

**Never commit API keys!** Always use environment variables:

```bash
# Backend .env file (add to .gitignore)
PM_USER_ID=your_actual_user_id
PM_API_KEY=your_actual_api_key
```

### 2. CORS Configuration

Your backend already has CORS enabled, but you can restrict it in production:

```javascript
// In server.js
app.use(cors({
    origin: 'https://yourusername.github.io'
}));
```

### 3. Rate Limiting

Consider adding rate limiting for production:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🧪 Testing Your Deployment

### Backend Health Check

```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "ParcelMonkey Proxy",
  "timestamp": "2024-11-13T..."
}
```

### Frontend Check

1. Open your deployed URL
2. Try uploading a sample Excel file
3. Check browser console for errors
4. Test getting shipping rates

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Fix**: Ensure backend has `app.use(cors())` enabled

### Issue 2: Backend URL Not Working

**Error**: `Failed to fetch` or `Network Error`

**Fix**: 
1. Check backend is deployed and running
2. Verify URL in frontend HTML (no trailing slash)
3. Check Render logs for errors

### Issue 3: GitHub Pages 404

**Error**: Page not found

**Fix**:
1. Wait 2-3 minutes after enabling Pages
2. Check file name matches URL exactly
3. Use `index.html` for root URL access

### Issue 4: Environment Variables Not Working

**Error**: API returns errors about missing credentials

**Fix**:
1. Add env vars in Render dashboard
2. Restart the service after adding variables
3. Check spelling of variable names

---

## 📊 Monitoring

### Render Dashboard
- View logs: Render Dashboard → Your Service → Logs
- Monitor uptime and requests
- Check for errors

### GitHub Pages
- Check build status: Repository → Actions
- View traffic: Repository → Insights → Traffic

---

## 🔄 Updating Your Deployment

### Backend Updates

```bash
# Make changes to code
git add .
git commit -m "Update: description of changes"
git push

# Render auto-deploys on push!
```

### Frontend Updates

```bash
# Make changes to HTML
git add .
git commit -m "Update: description of changes"
git push

# GitHub Pages auto-deploys on push!
```

---

## 🎉 Next Steps

- [ ] Add custom domain (optional)
- [ ] Set up analytics (Google Analytics)
- [ ] Add error monitoring (Sentry)
- [ ] Create demo video
- [ ] Add to your portfolio website

---

Need help? Open an issue on GitHub!

