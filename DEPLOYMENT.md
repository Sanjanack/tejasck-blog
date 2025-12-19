# Deployment Guide

This guide will help you deploy **Letters from Schmalkalden** to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   DATABASE_URL=file:./dev.db
   RESEND_API_KEY=your_resend_api_key
   ASK_RECIPIENT_1=your-email@example.com
   ASK_RECIPIENT_2=optional-second-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ADMIN_SESSION_SECRET=generate-random-string-here
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Update Database for Production**
   For production, consider using PostgreSQL instead of SQLite:
   - Update `prisma/schema.prisma` datasource to `postgresql`
   - Update `DATABASE_URL` to your PostgreSQL connection string
   - Run `npx prisma migrate deploy` after deployment

### Option 2: Other Platforms

#### Netlify
- Use Netlify's Next.js plugin
- Configure build command: `npm run build`
- Publish directory: `.next`

#### Railway
- Connect your GitHub repo
- Railway auto-detects Next.js
- Add environment variables in dashboard

#### Self-Hosted (VPS)
1. Build the project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm run start
   ```

3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "letters-blog" -- start
   pm2 save
   pm2 startup
   ```

## 📋 Pre-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Set secure `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
- [ ] Configure `RESEND_API_KEY` for email functionality
- [ ] Update email recipients in `ASK_RECIPIENT_1` and `ASK_RECIPIENT_2`
- [ ] Test admin login at `/admin/login`
- [ ] Verify all posts display correctly
- [ ] Check that comments system works
- [ ] Test the Ask form submission
- [ ] Verify robots.txt and sitemap.xml are accessible

## 🔧 Environment Variables

Create a `.env` file (or set in your hosting platform):

```env
# Required
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
ASK_RECIPIENT_1=your-email@example.com
ASK_RECIPIENT_2=optional-second-email@example.com

# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here
ADMIN_SESSION_SECRET=your-random-session-secret-here

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🗄️ Database Setup

### For Production (PostgreSQL Recommended)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### For SQLite (Development/Simple Deployments)

SQLite works fine for small sites, but has limitations:
- File-based (needs persistent storage)
- Not ideal for serverless environments
- Consider PostgreSQL for production

## 📧 Email Configuration

1. **Sign up for Resend**: [resend.com](https://resend.com)
2. **Get API Key**: Dashboard → API Keys
3. **Verify Domain** (optional): For better deliverability
4. **Set Environment Variables**: Add `RESEND_API_KEY` and recipient emails

## 🔒 Security Notes

- Never commit `.env` files to git
- Use strong passwords for `ADMIN_PASSWORD`
- Generate random `ADMIN_SESSION_SECRET` (use: `openssl rand -base64 32`)
- Keep dependencies updated: `npm audit` and `npm update`
- Enable HTTPS (automatic on Vercel/Netlify)

## 🎨 Custom Domain

1. **Vercel**: Settings → Domains → Add Domain
2. **Update Environment**: Set `NEXT_PUBLIC_SITE_URL` to your domain
3. **DNS**: Follow platform-specific instructions
4. **SSL**: Automatic with most platforms

## 📊 Monitoring & Analytics

Consider adding:
- **Vercel Analytics**: Built-in with Vercel
- **Google Analytics**: Add tracking code
- **Sentry**: Error tracking
- **Uptime Monitoring**: UptimeRobot, Pingdom

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors: `npm run build`

### Database Issues
- Ensure `DATABASE_URL` is set correctly
- Run `npx prisma generate` before building
- For PostgreSQL: Check connection string format

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Ensure recipient emails are valid

### Admin Login Not Working
- Verify `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are set
- Check browser cookies are enabled
- Clear browser cache and try again

## 📝 Post-Deployment

After deployment:
1. Test all features (blog, comments, ask form, admin)
2. Submit sitemap to Google Search Console
3. Set up monitoring and alerts
4. Configure backup strategy for database
5. Document your deployment process

## 🆘 Need Help?

- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Prisma docs: [prisma.io/docs](https://prisma.io/docs)

---

**Happy Deploying! 🚀**

