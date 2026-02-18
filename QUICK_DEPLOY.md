# Quick Deployment Guide 🚀

Get your blog live in **5 minutes** using Vercel (free and easiest for Next.js).

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready to deploy"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/letters-from-schmalkalden.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login (use GitHub)
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Vercel auto-detects Next.js** - just click "Deploy"
5. **Wait 2-3 minutes** - your site is live! 🎉

## Step 3: Set Environment Variables

After deployment, go to **Project Settings → Environment Variables** and add:

```
DATABASE_URL=file:./dev.db
RESEND_API_KEY=your_resend_api_key_here
ASK_RECIPIENT_1=your-email@example.com
ASK_RECIPIENT_2=optional-second-email@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=generate-random-string-here
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Important:** After adding env vars, redeploy (Settings → Deployments → Redeploy)

## Step 4: Get Your Live URL

Your blog will be live at: `https://your-project-name.vercel.app`

Share this link with anyone! 📢

## Step 5: Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your domain (e.g., `tejasck.blog`)
3. Follow DNS instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Alternative Hosting Options

### Netlify (Free)
- Similar to Vercel
- Connect GitHub repo
- Auto-deploys on push

### Railway (Free tier)
- Good for databases
- Connect GitHub
- Auto-detects Next.js

### Self-Hosted (VPS)
- DigitalOcean, AWS, etc.
- More control but requires server management
- See `DEPLOYMENT.md` for details

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Site is accessible via link
- [ ] Tested all features (blog, comments, ask form)
- [ ] Custom domain configured (optional)

## Troubleshooting

**Build fails?**
- Check environment variables are set
- Ensure `DATABASE_URL` is correct
- Check build logs in Vercel dashboard

**Database issues?**
- For production, consider PostgreSQL (see `DEPLOYMENT.md`)
- SQLite works but has limitations on serverless

**Email not working?**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors

---

**That's it!** Your blog is now live and shareable! 🎉




