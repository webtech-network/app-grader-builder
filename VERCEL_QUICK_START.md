# 🚀 Vercel Quick Deploy - Grader Builder

## Fastest Way to Deploy (Dashboard Method)

### 1️⃣ Push to GitHub
```bash
cd app-grader-builder
git init
git add .
git commit -m "Deploy to Vercel"
git remote add origin https://github.com/YOUR_USERNAME/grader-builder.git
git push -u origin main
```

### 2️⃣ Deploy on Vercel
1. Go to **https://vercel.com** and login
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Configure:
   - Framework: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Click **"Deploy"**
6. Done! 🎉

Your site will be live at: `https://your-project.vercel.app`

---

## Alternative: CLI Method

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd app-grader-builder
vercel

# For production
vercel --prod
```

---

## Files Already Created ✅

- ✅ `vercel.json` - Vercel configuration
- ✅ `VERCEL_DEPLOYMENT.md` - Complete guide
- ✅ `vercel-setup.sh` - Automated setup script

---

## Quick Setup Script

Run this to prepare for deployment:
```bash
cd app-grader-builder
./vercel-setup.sh
```

This script will:
- Check dependencies
- Install packages
- Build the project
- Optionally install Vercel CLI

---

## Environment Variables (Optional)

If you need to add API URLs later:

**In Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-api-url.com`
3. Redeploy

---

## Automatic Deployments

Once connected to GitHub:
- Push to `main` → **Production deployment**
- Push to other branches → **Preview deployment**
- Every commit gets a unique preview URL

---

## Custom Domain (Optional)

1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Configure DNS:
   ```
   Type: CNAME
   Name: @  (or subdomain)
   Value: cname.vercel-dns.com
   ```

---

## Troubleshooting

**Build fails?**
```bash
npm run build  # Test locally first
```

**Routes not working?**
- Make sure `vercel.json` exists (✅ already created)

**Need help?**
- See full guide: `VERCEL_DEPLOYMENT.md`

---

## Monitoring

- **Analytics:** Vercel Dashboard → Your Project → Analytics
- **Logs:** Deployments → Select deployment → View Logs
- **Rollback:** Deployments → Select previous → Promote to Production

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Connected to Vercel
- [ ] Deployment successful
- [ ] Tested live site
- [ ] Custom domain (optional)

That's it! Your React app is now deployed globally on Vercel's CDN! 🌍
