# Admin Authentication Setup

The admin area (`/admin/comments`) is now protected with password-based authentication.

## 🔐 Setup Instructions

### 1. Set Environment Variables

Add these to your `.env` file:

```env
# Admin Authentication
ADMIN_PASSWORD="your-secure-password-here"
ADMIN_SESSION_SECRET="your-random-session-secret-here"
```

**Important:**
- `ADMIN_PASSWORD`: The password you'll use to login
- `ADMIN_SESSION_SECRET`: A random string for session validation (generate with: `openssl rand -hex 32`)

### 2. Default Values (Development Only)

If you don't set these variables, the system uses:
- Password: `admin123` (⚠️ **Change this in production!**)
- Session Secret: `change-me-in-production` (⚠️ **Change this in production!**)

### 3. Generate Secure Secrets

**On Mac/Linux:**
```bash
openssl rand -hex 32
```

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Or use an online generator:**
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" or "Fort Knox Passwords"

## 🚀 How to Use

### Login
1. Visit `/admin/login`
2. Enter your admin password
3. You'll be redirected to `/admin/comments`

### Logout
1. Click the "Logout" button in the top-right of the admin page
2. You'll be redirected to the login page

### Session Duration
- Sessions last **7 days**
- You'll stay logged in even after closing the browser
- To force logout, click the logout button

## 🔒 Security Features

- **HTTP-only cookies**: Session tokens can't be accessed via JavaScript
- **Secure cookies**: In production, cookies only sent over HTTPS
- **Server-side validation**: All admin routes check authentication
- **Protected API routes**: Approve/delete actions require authentication

## 🛡️ Protected Routes

The following routes now require authentication:

- `/admin/comments` - Comment management page
- `/api/admin/comments/[id]/approve` - Approve comment API
- `/api/admin/comments/[id]/delete` - Delete comment API

Unauthenticated users are redirected to `/admin/login`.

## 🔧 Troubleshooting

### Can't login?
- Check that `ADMIN_PASSWORD` is set correctly in `.env`
- Restart your dev server after changing `.env`
- Clear browser cookies and try again

### Session expires too quickly?
- Default is 7 days - this is set in `/app/api/admin/login/route.ts`
- Change `maxAge` value if needed

### Want stronger security?
Consider upgrading to:
- **NextAuth.js** for OAuth providers (Google, GitHub, etc.)
- **JWT tokens** instead of simple session cookies
- **Rate limiting** on login attempts
- **2FA** (Two-Factor Authentication)

## 📝 Production Checklist

Before deploying to production:

- [ ] Set a strong `ADMIN_PASSWORD` (20+ characters, mix of letters/numbers/symbols)
- [ ] Set a random `ADMIN_SESSION_SECRET` (32+ characters)
- [ ] Ensure `NODE_ENV=production` (enables secure cookies)
- [ ] Use HTTPS (required for secure cookies)
- [ ] Consider adding rate limiting
- [ ] Consider adding login attempt logging

## 🎯 Quick Start

1. **Add to `.env`:**
   ```env
   ADMIN_PASSWORD="MySecurePassword123!"
   ADMIN_SESSION_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Visit `/admin/login` and login!**

---

**Note:** This is a simple password-based auth system suitable for personal blogs. For high-traffic sites or sensitive data, consider implementing more robust authentication (NextAuth.js, OAuth, etc.).



