# Quick Deployment Commands

## Deploy Backend to Render

1. Push to GitHub:
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

2. Go to [render.com](https://dashboard.render.com)
3. New + → Web Service → Connect GitHub repo
4. Render auto-detects `render.yaml`
5. Add environment variable: `CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app`

## Deploy Frontend to Vercel

### Option 1: CLI (Recommended)
```bash
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

### Option 2: Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo
3. Root Directory: `frontend`
4. Framework: Vite
5. Add environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`

## Update CORS After Deployment

1. Get your Vercel URL: `https://your-app.vercel.app`
2. Update Render environment variable:
   - `CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app`
3. Render will auto-redeploy

## Test Deployment

- Backend health: `https://your-backend.onrender.com/health`
- Frontend: `https://your-app.vercel.app`
- Check browser console for WebSocket connection

## Important Notes

⚠️ **Render Free Tier**: Service spins down after 15 min of inactivity (30s cold start)
✅ **Vercel Free Tier**: Always on, global CDN
📝 **See DEPLOYMENT.md for detailed guide**
