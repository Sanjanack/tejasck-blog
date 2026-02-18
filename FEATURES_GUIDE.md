# Complete Features Guide - Tejas C.K Studio

This guide explains every feature of your blog platform and how to use them effectively.

---

## 🎨 **Theme System**

### Light/Dark Mode Toggle
- **Location**: Top-right corner of the navbar (sun/moon icon)
- **How it works**: Click to switch between light and dark themes
- **Persistence**: Your preference is saved in browser localStorage
- **Auto-detection**: On first visit, it uses your system preference

### Color Palette
- **Light Mode**: Warm off-white background (`#faf9f7`) with soft slate grays
- **Dark Mode**: Warm dark gray (`#1a1a1a`) with soft light text
- **Accent Colors**: Muted sage green (`#6b8e6b`) and soft blue (`#5b7c99`)
- **Design Philosophy**: Easy on the eyes, professional, minimal

---

## 📝 **Blog Post System**

### Creating Posts
1. **Create a Markdown file** in the `posts/` directory
2. **Add frontmatter** at the top:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2024-01-15"
   excerpt: "A short description that appears on the blog listing"
   ---
   
   Your content here in Markdown...
   ```
3. **Save the file** - it automatically appears on `/blog`

### Post Features
- **Automatic slug generation**: Filename becomes the URL (e.g., `my-post.md` → `/blog/my-post`)
- **Markdown support**: Full Markdown syntax (headers, lists, links, images, code blocks)
- **Reading time**: Automatically calculated (200 words per minute)
- **Date formatting**: Human-readable dates (e.g., "January 15, 2024")

### Post Structure
```
posts/
  ├── first-letter.md
  ├── second-post.md
  └── ...
```

---

## 💬 **Comments System**

### For Readers
- **Location**: Bottom of every blog post
- **How to comment**:
  1. Click "Add a Comment"
  2. Fill in name (required) and email (optional)
  3. Write your comment
  4. Submit - it goes to moderation queue

### For You (Admin)
- **Authentication Required**: Visit `/admin/login` first to login
- **Moderation**: Visit `/admin/comments` to approve/delete comments
- **Approval workflow**: 
  - Comments start as "Pending"
  - Click "Approve" to make them visible
  - Click "Delete" to remove permanently
- **Logout**: Click "Logout" button in top-right of admin page
- **Email notifications**: (Optional - can be added) Get notified of new comments

### Comment Features
- **Moderation**: All comments require approval before appearing
- **Email optional**: Readers can comment without email
- **Post association**: Each comment is linked to its post slug
- **Timestamps**: Shows when comment was posted

---

## 🔍 **Search Functionality**

### How It Works
- **Location**: Top of the `/blog` page
- **Real-time search**: Filters posts as you type
- **Search scope**: Searches both post titles and excerpts
- **Case-insensitive**: Works regardless of capitalization

### Usage
1. Type in the search box
2. Posts filter instantly
3. Click a result to open the post
4. Clear search to see all posts again

---

## ✉️ **Ask Facility**

### For Readers
- **Location**: `/ask` page (linked in navbar)
- **Purpose**: Submit questions, story ideas, or feedback
- **Required fields**: Subject and Message
- **Optional fields**: Name and Email
- **Privacy**: Email is never exposed publicly, only sent to your inbox

### For You (Admin)
- **Email delivery**: Questions go to emails in `.env` (`ASK_RECIPIENT_1`, `ASK_RECIPIENT_2`)
- **Database storage**: All submissions saved in Prisma database
- **Reply workflow**:
  1. Receive email in your inbox
  2. Click "Reply" to respond directly (if they provided email)
  3. Or copy question from database to answer in a blog post

### Ask Features
- **Pre-filled links**: Can link from blog posts (e.g., "Ask about this post" button)
- **Reference tracking**: Includes post URL in submission
- **Validation**: Subject (3-200 chars), Message (10-5000 chars)
- **Email format checking**: Validates email if provided

### Viewing Submissions
```bash
# Open Prisma Studio to view all submissions
npx prisma studio
```

---

## 🏗️ **Multi-Series Architecture (Build Future Series)**

### What Is This?

The platform is designed so **Tejas C.K Studio** can host multiple blog series under one website. Currently, "Letters from Schmalkalden" is the live series, but you can add more.

### How It Works

**Current Structure:**
```
Tejas C.K Studio (Main Hub)
  └── Letters from Schmalkalden (Live Series)
      └── Blog posts, comments, Ask form
```

**Future Structure (Example):**
```
Tejas C.K Studio (Main Hub)
  ├── Letters from Schmalkalden (Live)
  ├── Rail Diaries (Coming Soon)
  └── Tejas C.K Bytes (Idea)
```

### What "Shared CMS" Means

- **Markdown posts per series**: Each series can have its own folder of posts
- **Same codebase**: All series use the same Next.js app
- **Unified features**: Comments, Ask, search work across all series
- **Easy to add**: Just create a new post folder and route

### What "Custom Palette" Means

- **Tailwind tokens**: Colors are defined in `tailwind.config.js`
- **Quick swaps**: Change accent colors by updating CSS variables
- **Per-series styling**: Each series can have its own color scheme
- **Example**: Letters uses sage green, Rail Diaries could use blue

### How to Add a New Series

**Step 1: Create a new post folder**
```bash
mkdir posts-rail-diaries
```

**Step 2: Update routing** (in `app/page.tsx`)
- Add new series to `futureSeries` array
- Set `locked: false` when ready
- Add `href: '/rail-diaries'`

**Step 3: Create new route** (optional)
- Duplicate `app/blog/` to `app/rail-diaries/`
- Update page titles and metadata

**Step 4: Update colors** (optional)
- Change accent colors in `app/globals.css`
- Or use Tailwind classes directly

**Step 5: Update navigation**
- Add link in `app/components/Navbar.tsx`

### Why This Architecture?

- **Scalable**: Easy to add new series without rebuilding
- **Maintainable**: One codebase, multiple channels
- **Consistent**: Same features across all series
- **Flexible**: Each series can have its own vibe

---

## 📧 **Email Backend (Resend)**

### Setup
1. **Sign up** at [resend.com](https://resend.com)
2. **Create API key** in dashboard
3. **Add to `.env`**: `RESEND_API_KEY="your_key_here"`
4. **Add recipients**: `ASK_RECIPIENT_1="your@email.com"`

### How It Works
- **Ask submissions**: Emails sent to all recipients in `.env`
- **From address**: Currently `Ask Bot <noreply@yourdomain.dev>`
- **Custom domain**: (Optional) Verify domain in Resend for better deliverability

### Email Content
Each Ask submission email includes:
- Subject line
- Sender name (if provided)
- Sender email (if provided)
- Reference URL (if linked from a post)
- Full message
- Database ID and timestamp

---

## 🗄️ **Database (Prisma + SQLite)**

### What's Stored
- **Ask Submissions**: All questions from `/ask` page
- **Comments**: All comments (approved and pending)

### Viewing Data
```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Database Schema
- `AskSubmission`: name, email, subject, message, ref, createdAt
- `Comment`: name, email, message, postSlug, approved, createdAt

### Migrations
```bash
# Create new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

---

## 🎯 **Navigation Structure**

### Main Pages
- **`/`**: Home page (Tejas C.K Studio hub)
- **`/blog`**: Letters from Schmalkalden blog listing
- **`/blog/[slug]`**: Individual blog post
- **`/about`**: About page
- **`/ask`**: Ask form page
- **`/admin/comments`**: Comment moderation (no auth yet - add later)

### Navigation Links
- **Home**: Returns to hub
- **Series**: Scrolls to series section on home page
- **Letters**: Goes to blog listing
- **About**: Creator info
- **Ask**: Question submission form

---

## 🔧 **Development Workflow**

### Running Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Adding Content
1. Create/edit Markdown files in `posts/`
2. Save - changes appear immediately (hot reload)
3. No build step needed for content

### Building for Production
```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📱 **Responsive Design**

- **Mobile-first**: Designed for phones, scales up
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Touch-friendly**: Large buttons, easy navigation
- **Hamburger menu**: Mobile navigation drawer

---

## 🚀 **Deployment**

### Recommended: Vercel (Free)
1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variables:
   - `RESEND_API_KEY`
   - `ASK_RECIPIENT_1`
   - `ASK_RECIPIENT_2`
   - `DATABASE_URL` (for production, use hosted Postgres)
4. Deploy - automatic on every push

### Environment Variables
```env
DATABASE_URL="file:./dev.db"  # SQLite for local, Postgres for production
RESEND_API_KEY="your_key"
ASK_RECIPIENT_1="your@email.com"
ASK_RECIPIENT_2="optional@email.com"
```

---

## 🎨 **Customization Guide**

### Changing Colors
1. **Global colors**: Edit `app/globals.css` CSS variables
2. **Tailwind colors**: Edit `tailwind.config.js`
3. **Component colors**: Update Tailwind classes directly

### Changing Fonts
- **Current**: Inter (sans), Georgia (serif for headings)
- **Location**: `app/globals.css` and `tailwind.config.js`
- **Google Fonts**: Already imported, just change font-family

### Adding Features
- **New pages**: Create folder in `app/` with `page.tsx`
- **New components**: Add to `app/components/`
- **New API routes**: Add to `app/api/`

---

## 🔐 **Admin Authentication**

### Setup
1. **Add to `.env`**:
   ```env
   ADMIN_PASSWORD="your-secure-password"
   ADMIN_SESSION_SECRET="your-random-secret"
   ```
2. **Restart server** after adding variables
3. **Login** at `/admin/login`

### Features
- **Password-based**: Simple, secure authentication
- **Session cookies**: Stay logged in for 7 days
- **Protected routes**: All admin pages and APIs require auth
- **Logout**: Button in admin panel

See `ADMIN_AUTH_SETUP.md` for detailed setup instructions.

---

## 📊 **Feature Summary**

| Feature | Location | Purpose |
|---------|----------|---------|
| Blog Posts | `/blog` | Main content display |
| Comments | Post pages | Reader engagement |
| Search | `/blog` | Find posts quickly |
| Ask Form | `/ask` | Question submission |
| Admin Panel | `/admin/comments` | Comment moderation (🔒 Protected) |
| Admin Login | `/admin/login` | Authentication |
| Theme Toggle | Navbar | Light/dark mode |
| Multi-Series | Home page | Future blog channels |

---

## 🎓 **Best Practices**

### For Content
- **Regular posts**: Keep a consistent schedule
- **Engaging titles**: Make them descriptive and interesting
- **Good excerpts**: First 1-2 sentences should hook readers
- **Images**: Use Markdown image syntax, store in `public/`

### For Engagement
- **Reply to comments**: Builds community
- **Answer Ask questions**: Turn into blog posts
- **Link between posts**: Create a web of content

### For Maintenance
- **Backup database**: Regularly export Prisma data
- **Monitor comments**: Check `/admin/comments` regularly
- **Update content**: Keep About page current

---

## 🆘 **Troubleshooting**

### Posts not appearing?
- Check file is in `posts/` directory
- Verify frontmatter format (must have `---` on both sides)
- Check file extension is `.md`

### Comments not showing?
- Visit `/admin/comments` to approve them (login required)
- Check database connection (`npx prisma studio`)

### Can't login to admin?
- Check `ADMIN_PASSWORD` is set in `.env`
- Restart dev server after changing `.env`
- Clear browser cookies and try again
- See `ADMIN_AUTH_SETUP.md` for details

### Emails not sending?
- Verify `RESEND_API_KEY` in `.env`
- Check Resend dashboard for errors
- Ensure recipients are set correctly

### Theme not switching?
- Clear browser cache
- Check browser console for errors
- Verify `ThemeProvider` is in `layout.tsx`

---

## 📚 **Next Steps**

1. **Add authentication** to `/admin/comments` (currently open)
2. **Set up email notifications** for new comments
3. **Add RSS feed** for blog posts
4. **Create sitemap** for SEO
5. **Add analytics** (Google Analytics, Plausible, etc.)
6. **Custom domain** setup on Vercel
7. **Add more series** when ready

---

**Questions?** Use the `/ask` page to submit them! 😊

