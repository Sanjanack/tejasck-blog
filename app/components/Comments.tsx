'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: string
  name: string
  message: string
  createdAt: string
  parentId?: string | null
  replies?: Comment[]
  reactions?: Record<string, number> // { like: 5, love: 2, ... }
  userReaction?: string | null
}

interface CommentsProps {
  postSlug: string
}

const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: typeof window !== 'undefined' ? localStorage.getItem('commenter_name') || '' : '',
    message: '',
    parentId: '',
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
        const data = await response.json()
        if (!cancelled && data.ok) {
          setComments(data.comments)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [postSlug])

  const fetchReactions = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`)
      const data = await response.json()
      if (data.ok) {
        return { reactions: data.reactions, userReaction: data.userReaction }
      }
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
    return { reactions: {}, userReaction: null }
  }

  const handleReaction = async (commentId: string, type: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await response.json()
      if (data.ok) {
        // Update local state
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, reactions: data.reactions, userReaction: type }
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? { ...reply, reactions: data.reactions, userReaction: type }
                    : reply
                ),
              }
            }
            return comment
          })
        )
      }
    } catch (error) {
      console.error('Error toggling reaction:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          name: formData.name,
          message: formData.message,
          parentId: formData.parentId || undefined,
        }),
      })

      const data = await response.json()
      if (data.ok) {
        // Save name to localStorage for future use
        if (typeof window !== 'undefined' && formData.name) {
          localStorage.setItem('commenter_name', formData.name)
        }
        setStatus('success')
        setFormData({ name: '', message: '', parentId: '' })
        setShowForm(false)
        // Refetch comments
        const refreshResponse = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
        const refreshData = await refreshResponse.json()
        if (refreshData.ok) {
          setComments(refreshData.comments)
        }
      } else {
        setStatus('error')
        if (data.errors) {
          const firstField = Object.keys(data.errors)[0]
          const firstError = data.errors[firstField]?.[0]
          if (firstError) {
            setErrorMessage(firstError)
          }
        } else if (data.error) {
          setErrorMessage(data.error)
        } else {
          setErrorMessage('Unable to post comment. Please check your details and try again.')
        }
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong while posting your comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [showReactionPicker, setShowReactionPicker] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyFormData, setReplyFormData] = useState({ name: '', message: '' })
    const [replying, setReplying] = useState(false)
    const [reactions, setReactions] = useState<Record<string, number>>({})
    const [userReaction, setUserReaction] = useState<string | null>(null)

    useEffect(() => {
      if (comment.reactions && typeof comment.reactions === 'object') {
        setReactions(comment.reactions)
        setUserReaction(comment.userReaction || null)
      } else {
        fetchReactions(comment.id).then(({ reactions: r, userReaction: ur }) => {
          setReactions(r)
          setUserReaction(ur)
        })
      }
    }, [comment.id, comment.reactions, comment.userReaction])

    const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0)

    return (
      <div className={`${isReply ? 'ml-8 mt-4' : ''}`}>
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-4 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6b8e6b] to-[#5b7c99] dark:from-[#7a9a7a] dark:to-[#6b8e9f] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {comment.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{comment.name}</span>
                <span className="text-xs text-[#718096] dark:text-[#9ca3af]">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-[#4a5568] dark:text-[#9ca3af] leading-relaxed whitespace-pre-wrap break-words">
                {comment.message}
              </p>
            </div>
          </div>

          {/* Reactions and Actions */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#e2e8f0] dark:border-[#4a5568]">
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors ${
                  userReaction
                    ? 'bg-[#f0f4f0] dark:bg-[#2d3a2d] text-[#6b8e6b] dark:text-[#7a9a7a]'
                    : 'text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]'
                }`}
              >
                {userReaction ? (
                  <>
                    <span>{REACTION_EMOJIS[userReaction]}</span>
                    <span>{reactions[userReaction] || 0}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>React</span>
                  </>
                )}
              </button>

              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg shadow-xl p-2 flex gap-1 z-10">
                  {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                    <button
                      key={type}
                      onClick={() => {
                        handleReaction(comment.id, type)
                        setShowReactionPicker(false)
                      }}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:scale-125 transition-transform rounded"
                      title={type}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {totalReactions > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#718096] dark:text-[#9ca3af]">
                  {Object.entries(reactions)
                    .filter(([_, count]) => count > 0)
                    .slice(0, 3)
                    .map(([type, count]) => (
                      <span key={type}>
                        {REACTION_EMOJIS[type]} {count}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowReplyForm(true)
                // Load saved name from localStorage if available
                const savedName = typeof window !== 'undefined' ? localStorage.getItem('commenter_name') || '' : ''
                setReplyFormData({ name: savedName, message: '' })
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (replying) return
                setReplying(true)
                try {
                  const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      postSlug,
                      name: replyFormData.name,
                      message: replyFormData.message,
                      parentId: comment.id,
                    }),
                  })
                  const data = await response.json()
                  if (data.ok) {
                    // Save name to localStorage
                    if (typeof window !== 'undefined' && replyFormData.name) {
                      localStorage.setItem('commenter_name', replyFormData.name)
                    }
                    setReplyFormData({ name: '', message: '' })
                    setShowReplyForm(false)
                    // Refetch comments to show the new reply
                    const refreshResponse = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
                    const refreshData = await refreshResponse.json()
                    if (refreshData.ok) {
                      setComments(refreshData.comments)
                    }
                  } else {
                    alert(data.error || 'Failed to post reply')
                  }
                } catch (error) {
                  alert('Something went wrong. Please try again.')
                } finally {
                  setReplying(false)
                }
              }}
              className="mt-4 pt-4 border-t border-[#e2e8f0] dark:border-[#4a5568]"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyFormData.name}
                  onChange={(e) => setReplyFormData({ ...replyFormData, name: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                  placeholder="Your name"
                />
                <textarea
                  required
                  rows={2}
                  value={replyFormData.message}
                  onChange={(e) => setReplyFormData({ ...replyFormData, message: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#6b8e6b] resize-none"
                  placeholder="Write a reply..."
                />
                <div className="flex flex-col gap-1">
                  <button
                    type="submit"
                    disabled={replying}
                    className="px-4 py-2 bg-[#6b8e6b] text-white rounded-lg text-sm font-medium hover:bg-[#5a7a5a] transition-colors disabled:opacity-50"
                  >
                    {replying ? '...' : 'Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false)
                      setReplyFormData({ name: '', message: '' })
                    }}
                    className="px-4 py-2 text-xs text-[#718096] dark:text-[#9ca3af] hover:text-[#2d3748] dark:hover:text-[#e5e7eb]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
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
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
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
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
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
              <p className="text-xs text-[#718096] dark:text-[#9ca3af]">Replies appear instantly.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', message: '', parentId: '' })
                  }}
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
                Posted.
              </div>
            )}

            {status === 'error' && (
              <div className="text-[#991b1b] dark:text-[#fca5a5] text-sm bg-[#fef2f2] dark:bg-[#2e1a1a] px-3 py-2 rounded-lg">
                {errorMessage || 'There was a problem posting your comment. Please try again.'}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
