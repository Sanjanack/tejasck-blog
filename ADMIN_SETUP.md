# CMS Setup (Obscure URL)

The management panel uses an **obscure URL** so it cannot be guessed:

- **URL**: `https://yoursite.com/cms-x8k2` or `http://localhost:3000/cms-x8k2`
- **Login**: `https://yoursite.com/cms-x8k2/login`

There are **no links** to this URL from any public page. You must bookmark it or type it manually.

---

## Environment Variables

Add to `.env`:

```bash
# Required for CMS login (username + password)
ADMIN_USERNAME="your-username"
ADMIN_PASSWORD="your-secure-password"
ADMIN_SESSION_SECRET="random-long-secret-string"

# Database
DATABASE_URL="file:./dev.db"
```

---

## Login

1. Go to `https://yoursite.com/cms-x8k2/login`
2. Enter **username** (from `ADMIN_USERNAME`)
3. Enter **password** (from `ADMIN_PASSWORD`)
4. Click **Sign in**

---

## Sections

| Section | URL |
|---------|-----|
| Dashboard | `/cms-x8k2` |
| Posts | `/cms-x8k2/posts` |
| Comments | `/cms-x8k2/comments` |
| Ask Submissions | `/cms-x8k2/ask` |

---

## Redirects

Old `/admin` URLs redirect to `/cms-x8k2` for backwards compatibility.
