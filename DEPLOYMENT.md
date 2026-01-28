# Deployment Guide: Render + Vercel

## 🚀 Quick Start Deployment

### Prerequisites
- GitHub account
- Render account (free tier)
- Vercel account (free tier)
- Code pushed to GitHub repository

---

## 📦 Backend Deployment (Render)

### Step 1: Prepare Your Repository

Your code already has `render.yaml` configured. Just push to GitHub:

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `Live_Bidding` repository
5. Render will auto-detect `render.yaml`
6. Click **"Apply"** to create the service

### Step 3: Configure Environment Variables

After deployment starts:

1. Go to your service dashboard
2. Click **"Environment"** tab
3. Add environment variable:
   - **Key**: `CORS_ORIGIN`
   - **Value**: `http://localhost:3000` (temporary, will update after Vercel deployment)
4. Click **"Save Changes"**

### Step 4: Get Your Backend URL

After deployment completes (2-3 minutes):
- Your backend URL will be: `https://live-bidding-backend.onrender.com`
- Test it: Visit `https://live-bidding-backend.onrender.com/health`
- You should see: `{"status":"OK","serverTime":"..."}`

**✅ Backend deployed!** Copy this URL for the next step.

---

## 🌐 Frontend Deployment (Vercel)

### Step 5: Deploy on Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `live-bidding` (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → Yes
- **Build Command?** → `npm run build`
- **Output Directory?** → `dist`
- **Development Command?** → `npm run dev`

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**

### Step 6: Add Environment Variables on Vercel

1. Go to your project settings
2. Click **"Environment Variables"**
3. Add these variables:

   **Variable 1:**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://live-bidding-backend.onrender.com` (your Render URL)
   - **Environment**: Production

   **Variable 2:**
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: `https://live-bidding-backend.onrender.com` (same as above)
   - **Environment**: Production

4. Click **"Save"**
5. Redeploy: Go to **"Deployments"** → Click **"..."** on latest → **"Redeploy"**

### Step 7: Get Your Frontend URL

After deployment completes:
- Your frontend URL will be: `https://live-bidding-xxx.vercel.app`
- Copy this URL

**✅ Frontend deployed!**

---

## 🔧 Final Configuration

### Step 8: Update Backend CORS

Now that you have your Vercel URL, update the backend:

1. Go to Render dashboard
2. Open your web service
3. Click **"Environment"** tab
4. Update `CORS_ORIGIN`:
   - **Old value**: `http://localhost:3000`
   - **New value**: `http://localhost:3000,https://live-bidding-xxx.vercel.app`
   - (Replace with your actual Vercel URL)
5. Click **"Save Changes"**
6. Service will auto-redeploy (takes ~2 minutes)

---

## ✅ Testing Your Deployment

### Test Backend

Visit: `https://live-bidding-backend.onrender.com/health`

Expected response:
```json
{
  "status": "OK",
  "serverTime": "2026-01-29T..."
}
```

### Test Frontend

1. Visit: `https://live-bidding-xxx.vercel.app`
2. Open browser console (F12)
3. Check for:
   - ✅ "Connected to server: [socket-id]"
   - ✅ "Received server time: ..."
   - ❌ No CORS errors
4. Try placing a bid
5. Open in another tab/browser to test real-time sync

---

## 🎯 Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check works
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on Vercel
- [ ] CORS updated with Vercel URL
- [ ] Backend redeployed with new CORS
- [ ] Frontend loads without errors
- [ ] WebSocket connection successful
- [ ] Bidding works
- [ ] Real-time updates work across tabs

---

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Check `CORS_ORIGIN` on Render includes your Vercel URL
2. Ensure no trailing slash in URL
3. Redeploy backend after changing

### Issue 2: WebSocket Connection Failed

**Error**: "WebSocket connection failed"

**Solution**:
1. Check `VITE_SOCKET_URL` uses `https://` (not `http://`)
2. Ensure backend is running (check `/health`)
3. Check browser console for detailed error

### Issue 3: Backend Cold Start (Render Free Tier)

**Symptom**: First request takes 30+ seconds

**Explanation**: Render free tier spins down after 15 minutes of inactivity

**Solutions**:
- Wait for cold start (30-60 seconds)
- Upgrade to paid plan ($7/month for always-on)
- Use cron job to ping `/health` every 10 minutes

### Issue 4: Environment Variables Not Working

**Solution**:
1. Ensure variable names are exact: `VITE_API_URL` (not `VITE_API_URL `)
2. Redeploy after adding variables
3. Check build logs for errors

---

## 🔄 Updating Your Deployment

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will auto-deploy on push.

### Update Frontend

```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will auto-deploy on push.

Or manually:
```bash
cd frontend
vercel --prod
```

---

## 📊 Monitoring

### Render Dashboard
- View logs: Service → Logs
- Check metrics: Service → Metrics
- Monitor deployments: Service → Events

### Vercel Dashboard
- View deployments: Project → Deployments
- Check logs: Click on deployment → View Function Logs
- Monitor analytics: Project → Analytics

---

## 💰 Cost Breakdown

### Free Tier (Current Setup)

**Render Free Tier:**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 minutes
- ⚠️ 512 MB RAM
- ⚠️ Shared CPU

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

**Total Cost**: $0/month

### Recommended Paid Tier

**Render Starter ($7/month):**
- ✅ Always on (no cold starts)
- ✅ 512 MB RAM
- ✅ Better performance

**Vercel Pro ($20/month):**
- Only needed if you exceed free tier limits

**Total Cost**: $7/month (Render only)

---

## 🎉 Success!

Your Live Bidding application is now deployed:

- **Frontend**: https://live-bidding-xxx.vercel.app
- **Backend**: https://live-bidding-backend.onrender.com

Share the frontend URL with others to test real-time bidding!

---

## 📚 Next Steps

1. **Custom Domain**: Add custom domain on Vercel
2. **Database**: Migrate to MongoDB Atlas (free tier)
3. **Authentication**: Add user login
4. **Monitoring**: Set up Sentry for error tracking
5. **Analytics**: Add Google Analytics
6. **CI/CD**: Already set up! (auto-deploy on push)
