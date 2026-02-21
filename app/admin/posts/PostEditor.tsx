'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

type EditorMode = 'new' | 'edit'

export type PostEditorInitial = {
  slug: string
  frontmatter: {
    title: string
    date: string
    excerpt: string
    tags: string[]
    series: string
    coverImage?: string
    coverImageAlt?: string
  }
  content: string
}

function normalizeSlugClient(input: string): string {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function tagsToString(tags: string[]) {
  return (tags || []).join(', ')
}

function tagsFromString(input: string) {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export default function PostEditor({ mode, initial }: { mode: EditorMode; initial: PostEditorInitial }) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [slug, setSlug] = useState(initial.slug)
  const [title, setTitle] = useState(initial.frontmatter.title)
  const [date, setDate] = useState(initial.frontmatter.date)
  const [excerpt, setExcerpt] = useState(initial.frontmatter.excerpt)
  const [series, setSeries] = useState(initial.frontmatter.series)
  const [tags, setTags] = useState(tagsToString(initial.frontmatter.tags))
  const [coverImage, setCoverImage] = useState(initial.frontmatter.coverImage || '')
  const [coverImageAlt, setCoverImageAlt] = useState(initial.frontmatter.coverImageAlt || '')
  const [content, setContent] = useState(initial.content)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')

  const frontmatter = useMemo(
    () => ({
      title,
      date,
      excerpt,
      series,
      tags: tagsFromString(tags),
      coverImage: coverImage.trim() || undefined,
      coverImageAlt: coverImageAlt.trim() || undefined,
    }),
    [title, date, excerpt, series, tags, coverImage, coverImageAlt]
  )

  useEffect(() => {
    if (!previewOpen) return
    let cancelled = false
    const t = setTimeout(async () => {
      try {
        const processed = await remark().use(remarkGfm).use(remarkHtml).process(content || '')
        if (!cancelled) setPreviewHtml(processed.toString())
      } catch {
        if (!cancelled) setPreviewHtml('<p>Preview failed.</p>')
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [content, previewOpen])

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current
    if (!el) {
      setContent((c) => `${c}\n${text}\n`)
      return
    }

    const start = el.selectionStart || 0
    const end = el.selectionEnd || 0
    const before = content.slice(0, start)
    const after = content.slice(end)
    const next = `${before}${text}${after}`
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + text.length
      el.setSelectionRange(pos, pos)
    })
  }

  const handleUploadImage = async (file: File) => {
    setUploading(true)
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || 'Upload failed')
      const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'image'
      insertAtCursor(`\n![${alt}](${data.url})\n`)
      setSuccess('Image uploaded and inserted.')
    } catch (e: any) {
      setError(e?.message || 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const slugToUse = mode === 'new' ? normalizeSlugClient(slug) : slug
      const res =
        mode === 'new'
          ? await fetch('/api/admin/posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug: slugToUse, frontmatter, content }),
            })
          : await fetch(`/api/admin/posts/${slug}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ frontmatter, content }),
            })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed')
      setSuccess(mode === 'new' ? 'Post created.' : 'Post updated.')
      if (mode === 'new') {
        const createdSlug = typeof data.slug === 'string' ? data.slug : slugToUse
        setSlug(createdSlug)
        router.push(`/cms-x8k2/posts/${createdSlug}/edit`)
      } else {
        router.refresh()
      }
    } catch (e: any) {
      setError(e?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (mode !== 'edit') return
    setDeleting(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed')
      router.push('/cms-x8k2/posts')
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">
              {mode === 'new' ? 'New Post' : 'Edit Post'}
            </h1>
            <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
              Posts are Markdown files stored in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">posts/</code>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn-secondary px-4 py-2" onClick={() => setPreviewOpen((v) => !v)} type="button">
              {previewOpen ? 'Hide preview' : 'Preview'}
            </button>
            {mode === 'edit' && (
              <a className="btn-secondary px-4 py-2" href={`/blog/${slug}`} target="_blank" rel="noreferrer">
                View post
              </a>
            )}
            <button className="btn-primary px-4 py-2 disabled:opacity-50" onClick={handleSave} disabled={saving} type="button">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {(error || success) && (
          <div className="mb-6 grid gap-2">
            {error && (
              <div className="rounded-lg bg-[#fef2f2] text-[#991b1b] dark:bg-[#2e1a1a] dark:text-[#fca5a5] px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-[#f0f9f0] text-[#2d5016] dark:bg-[#1a2e1a] dark:text-[#7a9a7a] px-4 py-3 text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-lg">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  onBlur={() => {
                    if (mode === 'new') setSlug((s) => normalizeSlugClient(s))
                  }}
                  disabled={mode === 'edit'}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] disabled:opacity-60"
                  placeholder="e.g. my-first-week"
                />
                <p className="text-xs text-[#718096] dark:text-[#9ca3af]">Lowercase, hyphens only. Becomes the URL: /blog/&lt;slug&gt;</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Date</label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Series</label>
                  <input
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                />
                <p className="text-xs text-[#718096] dark:text-[#9ca3af]">Shows on the blog listing and in social previews.</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                  placeholder="e.g. germany, study, travel"
                />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Cover image URL (optional)</label>
                  <input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#4a5568] dark:text-[#9ca3af]">Cover image alt text (optional)</label>
                  <input
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb]"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <label className="btn-secondary px-4 py-2 cursor-pointer">
                  {uploading ? 'Uploading…' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUploadImage(f)
                      e.currentTarget.value = ''
                    }}
                  />
                </label>
                <p className="text-xs text-[#718096] dark:text-[#9ca3af]">
                  Uploads to Cloudinary via <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">/api/upload</code> and inserts markdown.
                </p>
              </div>

              {mode === 'edit' && (
                <div className="pt-4 border-t border-[#e2e8f0] dark:border-[#4a5568]">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[#3a1f1f] px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Delete post'}
                  </button>
                  <p className="mt-2 text-xs text-[#718096] dark:text-[#9ca3af]">Deletes the markdown file from <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">posts/</code>.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Content</h2>
              <div className="text-xs text-[#718096] dark:text-[#9ca3af]">Markdown</div>
            </div>

            <div className="grid gap-6">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[420px] font-mono text-sm px-4 py-3 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="Write your post in Markdown..."
              />

              {previewOpen && (
                <div className="rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-[#faf9f7] dark:bg-[#1a1a1a] p-6">
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

