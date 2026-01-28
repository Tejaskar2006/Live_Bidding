# Frontend Deployment Guide for Vercel

## 🚀 Deploy Frontend to Vercel

Your backend is live at: **https://live-bidding-on3l.onrender.com**

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod
```

**When prompted, answer:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → **live-bidding** (or your choice)
- In which directory is your code located? → **./`** (press Enter)
- Want to override settings? → **Yes**
- Build Command? → **npm run build**
- Output Directory? → **dist**
- Development Command? → **npm run dev**

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Import your GitHub repository: `Tejaskar2006/Live_Bidding`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   
   **Variable 1:**
   - Name: `VITE_API_URL`
   - Value: `https://live-bidding-on3l.onrender.com`
   - Environment: Production
   
   **Variable 2:**
   - Name: `VITE_SOCKET_URL`
   - Value: `https://live-bidding-on3l.onrender.com`
   - Environment: Production

6. Click **"Deploy"**

---

## ⚙️ After Frontend Deployment

Once you get your Vercel URL (e.g., `https://live-bidding-xxx.vercel.app`):

### Update Backend CORS

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your **live-bidding-on3l** service
3. Click **"Environment"** tab
4. Add/Update environment variable:
   - **Key**: `CORS_ORIGIN`
   - **Value**: `http://localhost:3000,https://your-vercel-url.vercel.app`
   - (Replace `your-vercel-url` with your actual Vercel URL)
5. Click **"Save Changes"**
6. Service will auto-redeploy (~2 minutes)

---

## ✅ Testing Checklist

After both deployments:

- [ ] Visit: `https://live-bidding-on3l.onrender.com/health` (should return `{"status":"OK"}`)
- [ ] Visit your Vercel URL
- [ ] Open browser console (F12)
- [ ] Check for: "Connected to server: [socket-id]"
- [ ] No CORS errors in console
- [ ] Auction items display
- [ ] Countdown timers work
- [ ] Place a bid
- [ ] Open in another tab - real-time sync works

---

## 🎯 Quick Commands

**Deploy Frontend:**
```bash
cd frontend
vercel --prod
```

**Update and Redeploy:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys on push
```

---

## 📝 Your Deployment URLs

- **Backend**: https://live-bidding-on3l.onrender.com
- **Frontend**: (Will be provided after Vercel deployment)

---

## ⚠️ Important Notes

1. **Environment Variables**: Must be set on Vercel dashboard before deployment
2. **CORS Update**: Must update backend CORS after getting Vercel URL
3. **Cold Starts**: Render free tier spins down after 15 min (30s cold start)
4. **Auto Deploy**: Both Render and Vercel auto-deploy on git push

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure CORS is updated on Render
