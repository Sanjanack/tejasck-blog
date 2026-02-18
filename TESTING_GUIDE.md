# Testing Guide: Ask & Comments 📧

This guide explains how **Ask** and **Comments** work and how to test them.

## 📧 How Ask Section Works

### Flow:
1. **User submits form** at `/ask` page
2. **Data is validated** (subject & message required)
3. **Saved to database** (`AskSubmission` table in Prisma)
4. **Email sent** to `ASK_RECIPIENT_1` and `ASK_RECIPIENT_2` via Resend
5. **Success message** shown to user

### Email Configuration:
- **Service:** Resend (resend.com)
- **Recipients:** Set in `.env` as `ASK_RECIPIENT_1` and `ASK_RECIPIENT_2`
- **From:** `Ask Bot <noreply@yourdomain.dev>`
- **Subject:** `New Ask submission: [subject]`

### How to Test:

1. **Set up Resend:**
   ```bash
   # Sign up at resend.com
   # Get API key from dashboard
   # Add to .env:
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ASK_RECIPIENT_1=your-email@example.com
   ASK_RECIPIENT_2=optional-second@example.com
   ```

2. **Test the form:**
   - Go to `/ask` page
   - Fill out form (subject & message required)
   - Click "Send"
   - Check your email inbox!

3. **Check database:**
   ```bash
   npx prisma studio
   # Navigate to AskSubmission table
   # See all submissions stored there
   ```

4. **Check Resend dashboard:**
   - Go to resend.com → Logs
   - See email delivery status
   - Check for any errors

### Troubleshooting:

**Email not received?**
- ✅ Check `RESEND_API_KEY` is set correctly
- ✅ Verify `ASK_RECIPIENT_1` email is correct
- ✅ Check Resend dashboard for delivery status
- ✅ Check spam folder
- ✅ Verify Resend account is verified

**Form submission fails?**
- ✅ Check browser console for errors
- ✅ Verify database is set up (`npx prisma migrate dev`)
- ✅ Check server logs in terminal

---

## 💬 How Comments Section Works

### Flow:
1. **User submits comment** on a blog post
2. **Data is validated** (name & message required)
3. **Saved to database** (`Comment` table) with `approved: false`
4. **Email notification sent** to admin (NEW!)
5. **Comment hidden** until approved
6. **Admin approves** via `/admin/comments`
7. **Comment appears** on the post

### Email Configuration:
- **Service:** Resend (same as Ask)
- **Recipient:** `ASK_RECIPIENT_1` (admin email)
- **From:** `Comments Bot <noreply@yourdomain.dev>`
- **Subject:** `New comment on: [post-slug]`

### How to Test:

1. **Submit a comment:**
   - Go to any blog post (e.g., `/blog/first-letter`)
   - Scroll to Comments section
   - Fill out name and message
   - Click "Post Comment"
   - See success message

2. **Check email:**
   - You should receive email notification
   - Email contains comment details and link to approve

3. **Check database:**
   ```bash
   npx prisma studio
   # Navigate to Comment table
   # See comment with approved: false
   ```

4. **Approve comment:**
   - Go to `/admin/login`
   - Login with `ADMIN_PASSWORD`
   - Go to `/admin/comments`
   - Click "Approve" on the comment
   - Go back to blog post - comment should appear!

### Troubleshooting:

**Comment not appearing?**
- ✅ Check if comment is approved (`approved: true`)
- ✅ Verify you're logged in as admin
- ✅ Check database directly

**Email notification not received?**
- ✅ Check `RESEND_API_KEY` is set
- ✅ Verify `ASK_RECIPIENT_1` is set
- ✅ Check Resend dashboard logs
- ✅ Email is sent even if comment isn't approved yet

**Can't approve comments?**
- ✅ Make sure you're logged in at `/admin/login`
- ✅ Check `ADMIN_PASSWORD` is set correctly
- ✅ Verify session is active

---

## 🔍 Quick Test Checklist

### Ask Form:
- [ ] Form submits successfully
- [ ] Success message appears
- [ ] Email received in inbox
- [ ] Submission appears in database (`npx prisma studio`)

### Comments:
- [ ] Comment submits successfully
- [ ] Success message appears
- [ ] Email notification received
- [ ] Comment appears in database (unapproved)
- [ ] Can approve via admin panel
- [ ] Approved comment appears on post

---

## 📊 Database Viewing

**View all submissions:**
```bash
npx prisma studio
```

This opens a web interface where you can:
- View all Ask submissions
- View all Comments
- See approval status
- Delete entries
- Edit data

**Direct database access:**
- SQLite file: `prisma/dev.db`
- Use any SQLite viewer

---

## 🚨 Common Issues

### Issue: "Failed to submit"
**Solution:**
- Check `.env` file exists
- Verify `DATABASE_URL` is set
- Run `npx prisma generate`
- Check terminal for error messages

### Issue: Email not sending
**Solution:**
- Verify Resend API key is correct
- Check Resend account is active
- Verify recipient emails are valid
- Check Resend dashboard for errors
- Make sure domain is verified (for production)

### Issue: Comments not showing
**Solution:**
- Comments need approval first
- Go to `/admin/comments` to approve
- Check `approved` field in database
- Verify you're viewing the correct post

---

## 🎯 Production Checklist

Before going live:
- [ ] `RESEND_API_KEY` is set
- [ ] `ASK_RECIPIENT_1` is your real email
- [ ] `ADMIN_PASSWORD` is strong and secure
- [ ] `ADMIN_SESSION_SECRET` is random string
- [ ] Test Ask form works
- [ ] Test Comments work
- [ ] Test email notifications
- [ ] Test admin approval workflow
- [ ] Verify Resend domain (for production)

---

**Need help?** Check the error messages in:
- Browser console (F12)
- Terminal/server logs
- Resend dashboard logs
- Prisma Studio database viewer




