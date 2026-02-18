# Blog Editing Guide (Markdown + Images)

Your blog posts live as Markdown files in `posts/`. Each file becomes a page at `/blog/<filename>`.

You can edit posts in two ways:

- **Recommended (works everywhere, including Vercel)**: edit the Markdown files directly in `posts/`
- **Optional (local/self-hosted only)**: use the **Admin Post Editor** at `/admin/posts` (it writes to the local filesystem)

---

## 1) Create or edit a post (the Markdown way)

1. Create a new file in `posts/`:
   - Example: `posts/my-first-week.md`
2. Add **frontmatter** at the top (between `---` lines):

```markdown
---
title: "My First Week in Schmalkalden"
date: "2026-02-18"
excerpt: "A short 1–2 sentence summary that appears on /blog and in previews."
series: "Letters from Schmalkalden"
tags: ["germany", "student-life", "travel"]
coverImage: "https://res.cloudinary.com/<cloud>/image/upload/...jpg"
coverImageAlt: "A cobblestone street in Schmalkalden"
---

## A good first heading

Write the post in Markdown...
```

3. Save the file. It will appear on `/blog` automatically.

### Slugs (URLs)

- Filename becomes the slug:
  - `posts/my-first-week.md` → `/blog/my-first-week`
- Use lowercase + hyphens for best results.

---

## 2) Add pictures (2 options)

### Option A (simple): add images from `public/`

1. Put images in `public/images/`
2. Reference them in Markdown:

```markdown
![Alt text that describes the image](/images/my-photo.jpg)
```

This is ideal when you want everything stored in the repo.

### Option B (recommended for performance): upload to Cloudinary

This project includes an authenticated image upload endpoint at `POST /api/upload`.

- **Local / self-hosted workflow**:
  1. Login at `/admin/login`
  2. Open `/admin/posts` → create/edit a post
  3. Use **Upload image** → it inserts Markdown like:

```markdown
![my photo](https://res.cloudinary.com/.../image/upload/...jpg)
```

- **Vercel note**: the **upload endpoint still works**, but the **admin post editor is disabled on Vercel** (because Vercel’s filesystem is not persistent). On Vercel, edit Markdown in git and paste Cloudinary URLs.

---

## 3) Make posts easy to read (layout recipe)

Use this structure for almost every post:

- **Open with a 2–4 line hook**: what happened + why it matters
- **Add a mini table-of-contents feel** with headings (reader scanning)
- **Use short sections** (2–6 paragraphs each)
- **Use lists** for facts, steps, or comparisons
- **End with a takeaway** (what you learned / what’s next)

### Headings

Prefer `##` for main sections and `###` for sub-sections:

```markdown
## What surprised me most
### The weather
### The food
```

### Highlight important notes

Blockquotes look great in this project:

```markdown
> Tip: Buy a local SIM on day one — it saves time everywhere.
```

### Captions (simple pattern)

Markdown doesn’t have “native” captions, but this reads well:

```markdown
![The town square at sunset](/images/sunset.jpg)

*Schmalkalden’s town square — 6:10pm.*
```

---

## 4) Cover images (recommended)

If you set `coverImage` in frontmatter, it will show:

- on the **blog listing cards**
- at the top of the **post page**
- in social previews (Open Graph) when possible

Frontmatter example:

```markdown
coverImage: "https://res.cloudinary.com/.../image/upload/...jpg"
coverImageAlt: "Snow on rooftops in Schmalkalden"
```

---

## 5) Common mistakes (quick fixes)

- **Post not showing up**:
  - file must be in `posts/`
  - extension must be `.md`
  - frontmatter must start and end with `---`
- **Image not showing**:
  - if using `public/`, ensure the path starts with `/images/...`
  - if using a URL, ensure it starts with `https://`
- **Weird formatting**:
  - leave a blank line before/after headings, lists, and images

---

## 6) Database features (comments, likes, ask)

These features rely on Prisma + your `DATABASE_URL`.

Local setup (first time):

```bash
npm install
npx prisma migrate dev
npm run dev
```

If you deploy to production, set `DATABASE_URL` (Postgres recommended) and run:

```bash
npx prisma migrate deploy
```

