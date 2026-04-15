'use client'

import { useEffect, useState } from 'react'

interface PostLikeButtonProps {
  postSlug: string
}

export default function PostLikeButton({ postSlug }: PostLikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch(`/api/posts/${postSlug}/like`)
        const data = await response.json()
        if (!cancelled && data.ok) {
          setLiked(data.liked)
          setCount(data.count)
        }
      } catch (error) {
        console.error('Error fetching like status:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [postSlug])

  const handleToggleLike = async () => {
    if (toggling) return

    setToggling(true)
    try {
      const response = await fetch(`/api/posts/${postSlug}/like`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.ok) {
        setLiked(data.liked)
        setCount(data.count)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#718096] dark:text-[#9ca3af]">
        <div className="w-5 h-5 border-2 border-[#e2e8f0] dark:border-[#4a5568] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={toggling}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        liked
          ? 'bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#dc2626] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[#3a1f1f]'
          : 'bg-[#f7fafc] dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#edf2f7] dark:hover:bg-[#2d2d2d] border border-[#e2e8f0] dark:border-[#4a5568]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
    >
      <svg
  className={`w-5 h-5 transition-all duration-200 ${
    liked ? 'scale-110 fill-current' : 'scale-100'
  } ${toggling ? 'animate-pulse' : ''}`}
  viewBox="0 0 24 24"
  fill={liked ? 'currentColor' : 'none'}
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 21s-6.5-4.35-9-7.5C1.5 10.5 3 6.5 6.5 5.5c2-.5 3.5.5 5.5 2.5 2-2 3.5-3 5.5-2.5C21 6.5 22.5 10.5 21 13.5c-2.5 3.15-9 7.5-9 7.5z"
  />
</svg>
      <span className="text-sm font-medium">
        {count} {count === 1 ? 'like' : 'likes'}
      </span>
    </button>
  )
}

