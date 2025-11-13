# ⚡ Quick Start Guide

Get your Shipment Operations Dashboard deployed in 15 minutes!

## 🎯 Fastest Deployment Path

### 1️⃣ Deploy Backend (5 minutes)

```bash
# 1. Go to https://render.com and sign up
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub repo
# 4. Fill in:

Name: shipment-dashboard-api
Root Directory: parcelmonkey-backend
Build Command: npm install
Start Command: npm start

# 5. Click "Create Web Service"
# 6. Copy your URL (looks like: https://shipment-dashboard-api.onrender.com)
```

### 2️⃣ Update Frontend (2 minutes)

Open `Shipment Operations Dashboard.html` and find line ~2500:

```javascript
// Change this:
const API_URL = 'http://localhost:3001/api/shipping-rates';

// To your Render URL:
const API_URL = 'https://YOUR-APP-NAME.onrender.com/api/shipping-rates';
```

### 3️⃣ Push to GitHub (3 minutes)

```bash
# Initialize and push
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### 4️⃣ Enable GitHub Pages (2 minutes)

1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. Source: `main` branch, `/ (root)`
4. Save

### 5️⃣ Rename for Clean URL (1 minute)

```bash
# Optional: Rename HTML file
mv "Shipment Operations Dashboard.html" index.html
git add .
git commit -m "Rename to index.html"
git push
```

## ✅ Done!

Your dashboard is live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## 🔧 Local Development

```bash
# Terminal 1 - Backend
cd parcelmonkey-backend
npm install
npm start

# Terminal 2 - Frontend (optional)
python -m http.server 8000
# Or just open the HTML file directly
```

## 📝 Next Steps

- [ ] Update README.md with your info
- [ ] Add project to your portfolio website
- [ ] Share on LinkedIn/Twitter
- [ ] Get feedback and iterate!

## 🆘 Troubleshooting

**Backend not responding?**
- Check Render logs in dashboard
- Free tier sleeps after 15 mins, first request takes ~30s

**Frontend can't reach backend?**
- Verify API_URL in HTML matches your Render URL exactly
- Check browser console for CORS errors
- Ensure backend service is running

**GitHub Pages showing 404?**
- Wait 2-3 minutes after enabling Pages
- Check Actions tab for build status
- Verify file name matches URL

---

That's it! 🎉 You now have a live, portfolio-ready project!

