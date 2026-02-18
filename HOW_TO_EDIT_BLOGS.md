# How to Edit Blogs Easily

This guide shows you the **easiest ways** to edit your blog posts and add images.

---

## 🎯 **Quick Answer: Where to Edit**

You have **two options**:

### **Option 1: Edit Markdown Files Directly** ⭐ (Recommended)
- **Location**: `posts/` folder in your project
- **Files**: Each `.md` file is a blog post
- **Works**: Everywhere (local, Vercel, any hosting)

### **Option 2: Admin Editor** (Local/self-hosted only)
- **Location**: `/admin/posts` (after logging in)
- **Works**: Only on your local machine or self-hosted servers
- **Note**: Disabled on Vercel (filesystem is read-only there)

---

## 📝 **Method 1: Edit Markdown Files** (Best for Everyone)

### Step-by-Step:

1. **Open your project folder** in any code editor (VS Code, Cursor, etc.)

2. **Navigate to `posts/` folder**

3. **Open any `.md` file** (e.g., `first-letter.md`)

4. **Edit the file**:
   - **Frontmatter** (top section between `---` lines): Edit title, date, excerpt, tags, cover image
   - **Content** (below frontmatter): Write your post in Markdown

5. **Save the file**

6. **If running locally**: Changes appear immediately (hot reload)
7. **If on Vercel**: Push to git → Vercel auto-deploys

### Example Post Structure:

```markdown
---
title: "My First Week in Schmalkalden"
date: "2026-02-18"
excerpt: "A short description that shows on the blog listing"
tags: ["germany", "student-life", "travel"]
coverImage: "https://res.cloudinary.com/.../image.jpg"
coverImageAlt: "Schmalkalden town square"
---

# My First Week in Schmalkalden

*February 18, 2026*

Your content here in **Markdown**...

## Section Heading

- Bullet points
- More points

![Image description](/images/my-photo.jpg)
```

---

## 🖼️ **How to Add Images**

### **Method A: Images in Your Repo** (Simple)

1. **Create folder**: `public/images/` (if it doesn't exist)

2. **Add your image**: Put image files here (e.g., `public/images/snow.jpg`)

3. **In your Markdown**, add:
   ```markdown
   ![Snow in Schmalkalden](/images/snow.jpg)
   ```

4. **That's it!** The image will appear in your post with nice styling.

### **Method B: Cloudinary** (Best for Many Photos)

1. **Set up Cloudinary** (one-time):
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Create an **unsigned upload preset**
   - Add to `.env`:
     ```env
     CLOUDINARY_CLOUD_NAME="your_cloud_name"
     CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
     ```

2. **Upload images**:
   - **Option A**: Upload via Cloudinary dashboard, copy URL, paste in Markdown
   - **Option B**: Use admin editor at `/admin/posts` → "Upload image" button (local only)

3. **In your Markdown**, add:
   ```markdown
   ![Description](https://res.cloudinary.com/.../image.jpg)
   ```

---

## 🎨 **Cover Images** (Hero Images)

Cover images show:
- On blog listing cards
- At the top of the post page
- In social media previews

**How to add:**

In your post's frontmatter:
```markdown
---
title: "My Post"
date: "2026-02-18"
coverImage: "https://res.cloudinary.com/.../image.jpg"
coverImageAlt: "A beautiful view of Schmalkalden"
---
```

---

## 📋 **Frontmatter Fields Explained**

| Field | Required? | Example | What It Does |
|-------|-----------|---------|--------------|
| `title` | Yes | `"My First Week"` | Post title |
| `date` | Yes | `"2026-02-18"` | Publication date |
| `excerpt` | Recommended | `"A short description..."` | Shows on blog listing |
| `tags` | Optional | `["germany", "travel"]` | For filtering |
| `series` | Optional | `"Letters from Schmalkalden"` | Groups posts |
| `coverImage` | Optional | `"https://..."` | Hero image URL |
| `coverImageAlt` | Optional | `"Description"` | Accessibility text |

---

## 🔧 **Method 2: Admin Editor** (Local Only)

**When to use**: When editing locally and you want a visual editor.

**Steps**:

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Login**: Go to `http://localhost:3000/admin/login`
   - Password: Set in `.env` as `ADMIN_PASSWORD`

3. **Go to Posts**: Click "Manage Posts" or visit `/admin/posts`

4. **Edit or Create**:
   - Click "Edit" on any post
   - Or click "+ New Post" to create

5. **Use the editor**:
   - Left side: Frontmatter fields (title, date, tags, etc.)
   - Right side: Markdown content editor
   - "Upload image" button: Uploads to Cloudinary and inserts Markdown

6. **Save**: Click "Save" button

**Note**: This **doesn't work on Vercel** because Vercel's filesystem is read-only. On Vercel, always edit Markdown files directly.

---

## ✅ **Quick Checklist**

- [ ] Post file is in `posts/` folder
- [ ] File has `.md` extension
- [ ] Frontmatter starts and ends with `---`
- [ ] Title and date are set
- [ ] Images are in `public/images/` OR use Cloudinary URLs
- [ ] Save the file
- [ ] Push to git (if deploying)

---

## 🆘 **Common Issues**

**Post not showing up?**
- Check file is in `posts/` folder
- Check file ends with `.md`
- Check frontmatter has `---` on both sides

**Image not showing?**
- If using `/images/...`, make sure file is in `public/images/`
- If using URL, make sure it starts with `https://`
- Check image file exists and isn't corrupted

**Changes not appearing?**
- **Local**: Restart dev server (`npm run dev`)
- **Vercel**: Push changes to git, wait for deployment

---

## 📚 **Markdown Tips**

- **Headers**: `#` for H1, `##` for H2, `###` for H3
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Links**: `[text](https://url.com)`
- **Images**: `![alt](url)`
- **Lists**: Use `-` or `1.` for bullets/numbers
- **Code**: Wrap with backticks: `` `code` ``

---

**Questions?** Check `BLOG_EDITING_GUIDE.md` for more details!
