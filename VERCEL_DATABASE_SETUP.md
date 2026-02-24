# Vercel + PostgreSQL Setup

**SQLite does not work on Vercel.** The reactions, comments, and other features need PostgreSQL.

## Quick Setup

### 1. Create a PostgreSQL database

**Option A: Vercel Postgres** (easiest)
1. In your Vercel project → Storage → Create Database → Postgres
2. Connect it to your project (adds `DATABASE_URL` automatically)
3. Copy `POSTGRES_URL` or `DATABASE_URL` for local use

**Option B: Neon** (free tier)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a project and copy the connection string
3. Use the **pooled** connection string (ends with `-pooler`) for `DATABASE_URL`
4. Add `DATABASE_URL` to Vercel environment variables

**Option C: Supabase**
1. Sign up at [supabase.com](https://supabase.com)
2. Create project → Settings → Database → Connection string (URI)
3. Use the "Transaction" pooler URL for serverless

### 2. Set environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host/db?sslmode=require` |
| `ADMIN_USERNAME` | Yes | `admin` |
| `ADMIN_PASSWORD` | Yes | your-secure-password |
| `ADMIN_SESSION_SECRET` | Yes | random-32-char-string |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://yoursite.vercel.app` |

### 3. Deploy

On each deploy, the build runs:
1. `prisma generate` – generates the client
2. `prisma migrate deploy` – applies migrations to your Postgres DB
3. `next build` – builds the app

### 4. Local development

1. Copy `DATABASE_URL` from Vercel (or your Neon/Supabase dashboard) into `.env`
2. Run: `npm run dev`
3. Migrations are already applied from the Vercel build; to run manually: `npx prisma migrate deploy`

### Troubleshooting

- **"Reactions not working"**: Ensure `DATABASE_URL` is a PostgreSQL URL, not `file:./dev.db`
- **Build fails**: Check `DATABASE_URL` is set in Vercel env vars
- **Connection limit exceeded**: Use a pooled connection string (Neon pooler, Supabase pooler)
