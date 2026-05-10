'use client'

import { useEffect, useMemo, useState } from 'react'
import type { GalleryImageDTO } from '@/app/lib/gallery'

type Row = GalleryImageDTO

function sortRows(a: Row, b: Row) {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
  return a.id.localeCompare(b.id)
}

export default function GalleryAdmin({ initialImages }: { initialImages: Row[] }) {
  const [images, setImages] = useState<Row[]>(initialImages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [newSrc, setNewSrc] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [newCaption, setNewCaption] = useState('')
  const [uploadingNew, setUploadingNew] = useState(false)

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const sorted = useMemo(() => [...images].sort(sortRows), [images])

  async function reload() {
    const res = await fetch('/api/admin/gallery')
    const data = await res.json()
    if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to load gallery')
    const rows: Row[] = (data.images as Row[]).map((r) => ({
      id: r.id,
      src: r.src,
      alt: r.alt ?? '',
      caption: r.caption ?? '',
      sortOrder: r.sortOrder ?? 0,
    }))
    setImages(rows)
  }

  const flashError = (msg: string) => {
    setError(msg)
    setSuccess('')
  }

  const flashOk = (msg: string) => {
    setSuccess(msg)
    setError('')
  }

  const handleUpload = async (file: File, which: 'new' | { id: string }) => {
    if (which === 'new') setUploadingNew(true)
    setLoading(which !== 'new')
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || 'Upload failed')
      if (which === 'new') {
        setNewSrc(data.url)
        if (!newAlt.trim()) {
          const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim()
          if (alt) setNewAlt(alt)
        }
        flashOk('Image uploaded. Review URL and caption, then click Add image.')
      } else {
        await fetch(`/api/admin/gallery/${which.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ src: data.url }),
        })
        await reload()
        flashOk('Image replaced.')
      }
    } catch (e: unknown) {
      flashError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadingNew(false)
      setLoading(false)
    }
  }

  const addImage = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: newSrc.trim(),
          alt: newAlt,
          caption: newCaption,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not add image')
      setNewSrc('')
      setNewAlt('')
      setNewCaption('')
      await reload()
      flashOk('Image added.')
    } catch (e: unknown) {
      flashError(e instanceof Error ? e.message : 'Could not add image')
    } finally {
      setLoading(false)
    }
  }

  const saveRow = async (row: Row) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/gallery/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: row.src.trim(),
          alt: row.alt,
          caption: row.caption,
          sortOrder: row.sortOrder,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed')
      await reload()
      flashOk('Saved.')
    } catch (e: unknown) {
      flashError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const deleteRow = async (id: string) => {
    if (!confirm('Remove this image from the gallery?')) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed')
      await reload()
      flashOk('Removed.')
    } catch (e: unknown) {
      flashError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  const moveRow = async (id: string, dir: -1 | 1) => {
    const list = [...sorted]
    const idx = list.findIndex((r) => r.id === id)
    const j = idx + dir
    if (idx < 0 || j < 0 || j >= list.length) return
    const a = list[idx]
    const b = list[j]
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: b.sortOrder }),
        }),
        fetch(`/api/admin/gallery/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: a.sortOrder }),
        }),
      ])
      await reload()
      flashOk('Order updated.')
    } catch (e: unknown) {
      flashError(e instanceof Error ? e.message : 'Reorder failed')
    } finally {
      setLoading(false)
    }
  }

  const patchLocal = (id: string, patch: Partial<Row>) => {
    setImages((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">Gallery</h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">
          Add images by URL or upload (Cloudinary). Order controls how photos appear on the public gallery page.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-[#6b8e6b]/40 bg-[#f0f7f0] px-4 py-3 text-sm text-[#2d4a2d] dark:border-[#7a9a7a]/50 dark:bg-[#1a2e1a]/60 dark:text-[#c4e0c4]">
          {success}
        </div>
      )}

      <section className="mb-10 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#4a5568] dark:bg-[#252525]">
        <h2 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Add image</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-1">Image URL</label>
            <input
              type="url"
              value={newSrc}
              onChange={(e) => setNewSrc(e.target.value)}
              placeholder="https://… or /gallery/photo.jpg"
              className="w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-[#2d3748] dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-1">Alt text</label>
              <input
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-[#2d3748] dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-1">Caption (shown in modal)</label>
              <input
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-[#2d3748] dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#f7fafc] px-4 py-2 text-sm font-medium text-[#4a5568] dark:bg-[#2d2d2d] dark:text-[#9ca3af]">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="sr-only"
                disabled={uploadingNew || loading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ''
                  if (f) void handleUpload(f, 'new')
                }}
              />
              {uploadingNew ? 'Uploading…' : 'Upload image'}
            </label>
            <button
              type="button"
              disabled={loading || !newSrc.trim()}
              onClick={() => void addImage()}
              className="rounded-lg bg-[#6b8e6b] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a7a5a] disabled:opacity-50 dark:bg-[#7a9a7a]"
            >
              Add image
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Current images ({sorted.length})</h2>
        {sorted.map((row, i) => (
          <div
            key={row.id}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm dark:border-[#4a5568] dark:bg-[#252525]"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-black/5 sm:h-24 sm:w-36 dark:bg-white/5">
                <img src={row.src} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#718096] dark:text-[#9ca3af]">URL</label>
                  <input
                    value={row.src}
                    onChange={(e) => patchLocal(row.id, { src: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-sm text-[#2d3748] dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#718096] dark:text-[#9ca3af]">Alt</label>
                    <input
                      value={row.alt}
                      onChange={(e) => patchLocal(row.id, { alt: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-sm dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#718096] dark:text-[#9ca3af]">Caption</label>
                    <input
                      value={row.caption}
                      onChange={(e) => patchLocal(row.id, { caption: e.target.value })}
                      className="mt-0.5 w-full rounded-lg border border-[#e2e8f0] bg-[#faf9f7] px-3 py-2 text-sm dark:border-[#4a5568] dark:bg-[#1a1a1a] dark:text-[#e5e7eb]"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#f7fafc] px-3 py-1.5 text-xs font-medium text-[#4a5568] dark:bg-[#2d2d2d] dark:text-[#9ca3af]">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="sr-only"
                      disabled={loading}
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        e.target.value = ''
                        if (f) void handleUpload(f, { id: row.id })
                      }}
                    />
                    Replace via upload
                  </label>
                  <button
                    type="button"
                    disabled={loading || i === 0}
                    onClick={() => void moveRow(row.id, -1)}
                    className="rounded-lg border border-[#e2e8f0] px-2 py-1 text-xs dark:border-[#4a5568]"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={loading || i === sorted.length - 1}
                    onClick={() => void moveRow(row.id, 1)}
                    className="rounded-lg border border-[#e2e8f0] px-2 py-1 text-xs dark:border-[#4a5568]"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void saveRow(images.find((r) => r.id === row.id)!)}
                    className="rounded-lg bg-[#6b8e6b] px-3 py-1.5 text-xs font-medium text-white dark:bg-[#7a9a7a]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void deleteRow(row.id)}
                    className="rounded-lg bg-[#fef2f2] px-3 py-1.5 text-xs font-medium text-[#991b1b] dark:bg-[#2e1a1a] dark:text-[#fca5a5]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {sorted.length === 0 && (
        <p className="mt-8 text-center text-[#718096] dark:text-[#9ca3af]">No images yet. Add one above.</p>
      )}
    </div>
  )
}
