# Tejas CK Studio · Letters Network

A multi-series publishing hub for Tejas CK. The first live series is **Letters from Schmalkalden**, a vlog-style study-abroad diary, and the platform is structured so more blogs (Rail Diaries, Bytes, etc.) can plug in with the same codebase.

## Features

- ✨ Multi-series landing page (Tejas CK Studio + Letters spotlight)
- 📝 Markdown-based blog posts per series
- 🎨 Light/dark theming with quick palette swaps
- 📱 Fully responsive mobile-first design
- 🚀 Optimized for Vercel / Next.js hosting
- 🔍 SEO-friendly metadata + Open Graph

## Tech Stack

- **Next.js 14** with App Router
- **Tailwind CSS** for styling + theming
- **@tailwindcss/typography** for letter content
- **gray-matter** + **remark** for Markdown parsing
- **TypeScript** for type safety
- **Prisma + SQLite** for Ask submissions
- **Resend** for transactional email delivery

## Project Overview (BTech-friendly)

| Layer | What it does | Key files |
| --- | --- | --- |
| UI shell | `app/layout.tsx` wires the navbar, footer, fonts, and theme provider. | `app/layout.tsx`, `app/components/Navbar.tsx` |
| Landing experience | `app/page.tsx` renders the Tejas CK Studio hero, the series grid, and callouts. | `app/page.tsx` |
| Blog engine | Markdown files in `posts/` are read via `app/lib/posts.ts`, converted to HTML with `remark`, and displayed in `app/blog`. | `posts/`, `app/blog/*` |
| Ask facility | Client form at `app/ask/page.tsx` posts to `app/api/ask/route.ts`; Prisma stores data and Resend forwards emails. | `app/ask/page.tsx`, `app/api/ask/route.ts`, `prisma/schema.prisma` |
| Theming | `ThemeProvider` toggles `data-theme` + `dark` class; Tailwind tokens + CSS variables shift colors instantly. | `app/components/ThemeProvider.tsx`, `app/globals.css`, `tailwind.config.js` |

**Dev workflow:** update Markdown → run `npm run dev` → preview at `localhost:3000`. The same build can host multiple “series” by adjusting copy/links in `app/page.tsx` and adding new post folders.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd letters-from-schmalkalden
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding New Posts

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter with title, date, and excerpt:
```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "A short description of your post"
---

Your content here...
```

3. The post will automatically appear on the blog page!

## 🚀 Quick Deployment

**Want to go live in 5 minutes?** See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

**For detailed instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Want to make it unique?** See [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) for 40+ feature ideas!

This project is optimized for Vercel deployment:

### Environment Variables

1. **Create a `.env` file in the root directory** (same level as `package.json`):

```bash
# Copy the example file
cp env.example .env
```

2. **Edit `.env` with your values**:

```
DATABASE_URL="file:./dev.db"
RESEND_API_KEY="your_resend_api_key_here"
ASK_RECIPIENT_1="sanjanack874@gmail.com"
ASK_RECIPIENT_2="your-brothers-email@example.com"
```

3. **Install dependencies and setup database**:

```bash
# Install all dependencies
npm install

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Optional: View your database
npx prisma studio
```

4. **Get Resend API Key**:
   - Sign up at [resend.com](https://resend.com)
   - Create an API key in your dashboard
   - Add it to your `.env` file

## Hosting Options

| Tier | Platform | Why use it | Notes |
| --- | --- | --- | --- |
| Free (recommended) | **Vercel Hobby** | One-click Next.js deploys, automatic HTTPS, preview URLs. | Works with SQLite for small sites. For higher volume, point Prisma to a hosted Postgres (Neon/Railway free tiers). |
| Free alternative | **Netlify** | Supports Next.js through their adapter. | You’ll need to configure the `next.config.js` adapter and handle Prisma on a serverless Postgres. |
| Paid / scalable | **Vercel Pro** | More bandwidth, team features, faster builds, analytics. | Keep using Resend + upgrade DB (Planetscale/Neon). |
| Paid alternative | **DigitalOcean App Platform / Render** | Full control of build + background jobs. | You provision a managed Postgres + custom domains. |

**Recommended path:** start on Vercel Hobby. Steps:
1. Push this repo to GitHub (see workflow below) and import it on [Vercel](https://vercel.com).
2. Add `RESEND_API_KEY`, `ASK_RECIPIENT_*`, and `DATABASE_URL` as Vercel environment variables.
3. If you outgrow SQLite, switch `DATABASE_URL` to a hosted Postgres connection string, run `npx prisma migrate deploy`, and redeploy.
4. Set up a custom domain (e.g., `tejasck.blog`) via Vercel’s dashboard once you’re ready to go public.

### Features Added

- ✅ **Ask Form**: Secure email delivery to your inboxes
- ✅ **Comments System**: Users can comment on posts (moderated)
- ✅ **Admin Panel**: Manage comments at `/admin/comments`
- ✅ **Mobile Menu**: Functional hamburger navigation
- ✅ **Search**: Real-time blog post search
- ✅ **Multiple Color Themes**: 6 German-inspired color schemes

### Color Themes

The project includes 6 meaningful color themes inspired by German culture:

1. **Aurora Studio** (current) - Emerald, teal, and lilac gradients
2. **Bavarian Forest** - Deep greens and warm browns
3. **Rhine River** - Cool blues and silvers
4. **Black Forest** - Rich purples and deep grays
5. **Alpine Snow** - Clean whites and cool grays
6. **German Flag** - Black, red, and gold patriotic theme

To switch themes, update the color classes in your components:
- Replace `primary-*` with `forest-*`, `rhine-*`, `blackforest-*`, `alpine-*`, or `flag-*`
- Replace `gradient-hero` with `gradient-forest`, `gradient-rhine`, etc.
- Replace `gradient-accent` with `gradient-forest-accent`, `gradient-rhine-accent`, etc.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration!

## Project Structure

```
letters-from-schmalkalden/
├── app/
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions
│   ├── blog/               # Blog pages
│   ├── about/              # About page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── posts/                  # Markdown blog posts
├── public/                 # Static assets
└── ...config files
```

## Customization

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Fonts**: Update the font imports in `app/globals.css`
- **Content**: Modify the sample post in `posts/first-letter.md`
- **Metadata**: Update SEO information in `app/layout.tsx`

## Ask Facility & Email Backend

The `/ask` page is wired to a fully server-side workflow so viewer questions reach you securely and can be reused in future posts.

### Visitor experience
1. A visitor fills out the form at `/ask`. Only `subject` and `message` are required; `name` and `email` stay optional.
2. The form calls `POST /api/ask`, which validates lengths, sanitizes input, and blocks malformed emails before anything is stored.
3. They see live feedback (`Sending…`, success, or error) without leaving the page.

### Backend flow
1. The API route (`app/api/ask/route.ts`) creates a record in the Prisma model `AskSubmission`. Every message is archived locally in your SQLite (or any Prisma-supported) database so you can reference it later or feature it in a vlog/blog.
2. After saving, the route uses [Resend](https://resend.com) to fan out an email to every `ASK_RECIPIENT_*` address set in `.env`. The visitor’s email is only included in the email body, never exposed client-side.
3. Because the email lands in your personal inbox, you can simply hit “Reply” to answer them directly. If they didn’t share an address, copy the question from Prisma (`npx prisma studio`) and answer it publicly in a post.

### Configure it
1. Set `RESEND_API_KEY` plus at least one `ASK_RECIPIENT_*` variable in `.env`. These recipients are hidden from the browser.
2. Run `npx prisma migrate dev` so the `AskSubmission` table exists in your configured database.
3. Optional: customise the `from` address in `app/api/ask/route.ts` (line with `Ask Bot <noreply@yourdomain.dev>`). Use a domain verified in Resend for better deliverability.

### Posting Q&As later
- Open Prisma Studio (`npx prisma studio`) or query the database to copy any submission.
- Turn the message into a blog article or part of a vlog script, and credit the sender if they left a name/city.
- Mark answered questions externally (e.g., keep a Notion or update the blog post). Because everything is stored in `AskSubmission`, you can also build an admin UI later without changing the current flow.

## GitHub Workflow & Deploying to Vercel

1. **Initialize git (if not already a repo):**
   ```bash
   git init
   git add .
   git commit -m "Initial Tejas CK Studio setup"
   ```
2. **Create a GitHub repo:** visit github.com → New Repository → follow the instructions. Usually:
   ```bash
   git remote add origin https://github.com/<your-username>/tejas-ck-studio.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable deployments:** Import the repository into Vercel, connect the `main` branch, and set environment variables under *Project Settings → Environment Variables*.
4. **Ship updates:** For every change run `npm run lint`/`npm run build`, commit, and push. Vercel will build previews for pull requests and redeploy production when `main` updates.

## License

This project is open source and available under the [MIT License](LICENSE).
