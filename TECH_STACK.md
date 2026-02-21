# Tech Stack & Backend Guide

This document explains the tech stack used for the blog and how each backend feature works.

---

## Tech Stack Overview

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + @tailwindcss/typography |
| **Database** | Prisma ORM + SQLite (local) / PostgreSQL (production) |
| **Markdown** | gray-matter, remark, remark-html, remark-gfm |
| **Email** | Resend (optional, for notifications) |
| **Images** | Cloudinary (optional, for admin uploads) |
| **Hosting** | Vercel |

---

## Backend Features

### 1. Comments & Replies
- **API**: `POST /api/comments` (create), `GET /api/comments?postSlug=...` (list)
- **Database**: `Comment` model with `parentId` for nested replies
- **Flow**: Comments and replies appear instantly (no moderation)
- **Auth**: None required for readers

### 2. Comment Reactions
- **API**: `POST /api/comments/[id]/reactions`, `GET /api/comments/[id]/reactions`
- **Database**: `CommentReaction` model (like, love, laugh, wow, sad, angry)
- **Flow**: Users can react with emojis; one reaction per user per comment
- **Auth**: Identified via `user_id` cookie (anonymous)

### 3. Post Reactions
- **API**: `POST /api/posts/[slug]/reactions`, `GET /api/posts/[slug]/reactions`
- **Database**: `PostReaction` model
- **Flow**: Emoji reactions on posts; optional display name
- **Auth**: Via `user_id` cookie

### 4. Ask a Question
- **API**: `POST /api/ask`
- **Database**: `AskSubmission` model
- **Flow**: Stores in DB; optionally emails via Resend
- **Auth**: None for submission

### 5. Post Likes (Legacy)
- **API**: `POST /api/posts/[slug]/like`, `GET /api/posts/[slug]/like`
- **Database**: `PostLike` model
- **Note**: PostReactions are preferred; PostLike kept for backwards compatibility

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Prisma connection (SQLite or PostgreSQL) |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `ADMIN_SESSION_SECRET` | Yes (prod) | Session token for admin auth |
| `RESEND_API_KEY` | No | Email for Ask notifications |
| `ASK_RECIPIENT_1` | No | Email address for Ask submissions |
| `CLOUDINARY_CLOUD_NAME` | No | For admin image uploads |
| `CLOUDINARY_UPLOAD_PRESET` | No | For admin image uploads |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Full site URL for RSS, OG images |

---

## Making the Backend Work

### Local Development
1. Add `.env` with at least:
   ```
   DATABASE_URL="file:./dev.db"
   ADMIN_PASSWORD="your-secure-password"
   ADMIN_SESSION_SECRET="random-secret-string"
   ```
2. Run migrations: `npx prisma migrate dev`
3. Start dev server: `npm run dev`

### Production (Vercel)
1. Use **Vercel Postgres** or **Neon** for `DATABASE_URL` (PostgreSQL)
2. Run `npx prisma migrate deploy` after first deploy
3. Set all env vars in Vercel dashboard

### Common Issues
- **Comments/replies not saving**: Check `DATABASE_URL` and that migrations are applied
- **Upload fails**: Set `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET`
- **Ask emails not sent**: Set `RESEND_API_KEY` and `ASK_RECIPIENT_1`

---

## Admin Area

- **URL**: `/admin` (not linked from any public page)
- **Login**: `/admin/login` — password from `ADMIN_PASSWORD`
- **Sections**: Dashboard, Posts, Comments, Ask Submissions
- **robots.txt**: Disallows `/admin/` so search engines don’t index it
