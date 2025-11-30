'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: string
  name: string
  email?: string
  message: string
  createdAt: string
}

interface CommentsProps {
  postSlug: string
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
      const data = await response.json()
      if (data.ok) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          ...formData
        })
      })

      const data = await response.json()
      if (data.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setShowForm(false)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12 animate-pulse">
        <div className="h-4 bg-[#e2e8f0] dark:bg-[#4a5568] rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-[#e2e8f0] dark:bg-[#4a5568] rounded"></div>
          <div className="h-3 bg-[#e2e8f0] dark:bg-[#4a5568] rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6">Comments</h3>
      
      {comments.length === 0 ? (
        <p className="text-[#718096] dark:text-[#9ca3af] mb-6">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#6b8e6b] dark:bg-[#7a9a7a] rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-[#2d3748] dark:text-[#e5e7eb]">{comment.name}</div>
                  <div className="text-xs text-[#718096] dark:text-[#9ca3af]">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p className="text-[#4a5568] dark:text-[#9ca3af] leading-relaxed">{comment.message}</p>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-secondary px-4 py-2"
        >
          Add a Comment
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Leave a Comment</h4>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="comment-name">
                Name *
              </label>
              <input
                id="comment-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="comment-email">
                Email (optional)
              </label>
              <input
                id="comment-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="comment-message">
                Comment *
              </label>
              <textarea
                id="comment-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="Share your thoughts..."
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-[#718096] dark:text-[#9ca3af]">
                Comments are moderated and will appear after approval.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-[#718096] dark:text-[#9ca3af] hover:text-[#2d3748] dark:hover:text-[#e5e7eb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-4 py-2 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>

            {status === 'success' && (
              <div className="text-[#2d5016] dark:text-[#7a9a7a] text-sm bg-[#f0f9f0] dark:bg-[#1a2e1a] px-3 py-2 rounded-lg">
                Thanks! Your comment has been submitted and will appear after approval.
              </div>
            )}

            {status === 'error' && (
              <div className="text-[#991b1b] dark:text-[#fca5a5] text-sm bg-[#fef2f2] dark:bg-[#2e1a1a] px-3 py-2 rounded-lg">
                There was a problem posting your comment. Please try again.
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  )
}


