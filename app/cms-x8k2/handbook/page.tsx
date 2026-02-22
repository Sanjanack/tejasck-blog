import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { CMS_LOGIN_PATH } from '@/app/lib/auth'
import Link from 'next/link'
import { CMS_PATH } from '@/app/lib/cms-constants'

export default async function HandbookPage() {
  if (!(await isAuthenticated())) redirect(CMS_LOGIN_PATH)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">
          Handbook
        </h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">
          Quick guide to using the CMS and writing in Markdown
        </p>
      </div>

      <div className="space-y-10">
        <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Using the CMS</h2>
          <ul className="space-y-2 text-[#4a5568] dark:text-[#9ca3af]">
            <li><strong>Dashboard</strong> — Overview of posts, comments, reactions, Ask submissions</li>
            <li><strong>Posts</strong> — Create, edit, delete posts. Slug becomes the URL (<code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">/blog/slug</code>)</li>
            <li><strong>Comments</strong> — View and delete comments. Use the Reply button on the blog to reply to comments</li>
            <li><strong>Ask Submissions</strong> — Incoming questions from the Ask form</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Post Editor</h2>
          <ul className="space-y-2 text-[#4a5568] dark:text-[#9ca3af]">
            <li><strong>Slug</strong> — Lowercase, hyphens only. Cannot change after creation</li>
            <li><strong>Series</strong> — Choose existing or add new. Groups posts on the blog</li>
            <li><strong>Cover image</strong> — Full URL. Used for social previews and post header</li>
            <li><strong>Content</strong> — Markdown. Use Preview to see rendered output. Toggle full screen for easier editing</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Markdown Quick Reference</h2>
          <div className="space-y-4 text-sm font-mono text-[#4a5568] dark:text-[#9ca3af] bg-[#faf9f7] dark:bg-[#1a1a1a] rounded-xl p-4 overflow-x-auto">
            <p><code># Heading 1</code> — <code>## Heading 2</code></p>
            <p><code>**bold**</code> — <code>*italic*</code></p>
            <p><code>[text](url)</code> — link</p>
            <p><code>![alt](url)</code> — image (see Image section below)</p>
            <p><code>- item</code> — unordered list</p>
            <p><code>1. item</code> — ordered list</p>
            <p><code>`code`</code> — inline code</p>
            <p><code>```code block```</code> — fenced code</p>
            <p><code>&gt; quote</code> — blockquote</p>
          </div>
        </section>

        <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Images</h2>
          <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">
            Two ways to add images in posts:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-2">1. Inline Markdown</h3>
              <p className="text-[#4a5568] dark:text-[#9ca3af] text-sm mb-2">
                Paste any image URL directly: <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">![description](https://example.com/image.jpg)</code>. No upload—uses external URLs (Imgur, your CDN, etc.).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-2">2. Cloudinary Upload</h3>
              <p className="text-[#4a5568] dark:text-[#9ca3af] text-sm mb-2">
                Click &quot;Upload image&quot; in the post editor. Images are stored on Cloudinary and markdown is inserted. <strong>Max 5MB</strong> per file. Requires <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">CLOUDINARY_CLOUD_NAME</code> and <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">CLOUDINARY_UPLOAD_PRESET</code> in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">.env</code>. If upload fails, set these in the Cloudinary dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Backend & Comments</h2>
          <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">
            <strong>Stack:</strong> Next.js 14 (App Router), Prisma ORM, SQLite (dev) or PostgreSQL (prod). Posts are Markdown files in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">posts/</code>.
          </p>
          <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">
            <strong>Comments:</strong> Stored in the database. <code>POST /api/comments</code> creates comments; <code>parentId</code> creates replies. Replies nest under parent comments. Use the Reply button under any comment on a blog post.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link href={CMS_PATH} className="text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
