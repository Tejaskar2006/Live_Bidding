# 🔧 Fixing "Failed to connect to server" Error

## Problem
Your Vercel frontend shows: **"Failed to connect to server"**

## Root Cause
The environment variables (`VITE_API_URL` and `VITE_SOCKET_URL`) are not set on Vercel, so the frontend doesn't know where to connect.

---

## ✅ Solution: Add Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **live-bidding** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### Step 2: Add Environment Variables

Add these TWO variables:

**Variable 1:**
- **Name**: `VITE_API_URL`
- **Value**: `https://live-bidding-on3l.onrender.com`
- **Environment**: Check ✅ **Production**, **Preview**, **Development**

**Variable 2:**
- **Name**: `VITE_SOCKET_URL`
- **Value**: `https://live-bidding-on3l.onrender.com`
- **Environment**: Check ✅ **Production**, **Preview**, **Development**

### Step 3: Redeploy

After adding the variables:

1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** push a new commit:
```bash
cd d:\web\Live_Bidding
git add .
git commit -m "Trigger redeploy" --allow-empty
git push origin main
```

### Step 4: Wait for Deployment

- Deployment takes ~1-2 minutes
- Watch the deployment logs for completion
- Once done, visit your Vercel URL again

---

## 🎯 Expected Result

After redeployment with environment variables:

✅ **Analytics panel shows:**
- Total Bids: 0
- Active Bidders: 0
- Active Auctions: 6

✅ **Below analytics:**
- 6 auction items display with images
- Countdown timers are running
- "Bid +$10" buttons are active

✅ **Browser console shows:**
```
Connected to server: [socket-id]
Received server time: ...
```

✅ **No red error message**

---

## 🔍 Verify Environment Variables

After adding them, you can verify:

1. Go to Vercel → Your Project → Settings → Environment Variables
2. You should see:
   ```
   VITE_API_URL = https://live-bidding-on3l.onrender.com
   VITE_SOCKET_URL = https://live-bidding-on3l.onrender.com
   ```

---

## 📝 Quick Checklist

- [ ] Added `VITE_API_URL` on Vercel
- [ ] Added `VITE_SOCKET_URL` on Vercel
- [ ] Both variables have value: `https://live-bidding-on3l.onrender.com`
- [ ] Both variables are enabled for Production
- [ ] Redeployed the frontend
- [ ] Waited for deployment to complete
- [ ] Visited Vercel URL and checked for connection

---

## 🆘 Still Not Working?

### Check Browser Console

1. Open your Vercel URL
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for error messages
5. Share the error message for further help

### Common Errors

**Error: "ERR_NAME_NOT_RESOLVED"**
- Backend URL is wrong
- Check `VITE_SOCKET_URL` spelling

**Error: "CORS policy"**
- CORS not configured on Render
- Check `CORS_ORIGIN` on Render includes your Vercel URL

**Error: "WebSocket connection failed"**
- Backend might be sleeping (Render free tier)
- Visit backend health check to wake it up
- Wait 30 seconds and refresh

---

## 🎉 Success Indicator

When it works, you'll see:

1. **No red error message**
2. **6 auction items** displayed
3. **Countdown timers** running
4. **Browser console**: "Connected to server: [id]"
5. **Can place bids** successfully

---

## 📸 Screenshot Comparison

**Before (Current - Error):**
- ❌ "Failed to connect to server" in red
- ❌ No auction items below
- ❌ Analytics shows 0 Active Auctions

**After (Fixed):**
- ✅ No error message
- ✅ 6 auction items with images
- ✅ Analytics shows 6 Active Auctions
- ✅ Countdown timers running
- ✅ Can place bids
