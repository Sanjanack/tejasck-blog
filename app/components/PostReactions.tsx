'use client'

import { useEffect, useMemo, useState } from 'react'

const REACTIONS = [
  { type: 'like', icon: '👍', label: 'Like' },
  { type: 'love', icon: '❤️', label: 'Love' },
  { type: 'insightful', icon: '💡', label: 'Insightful' },
] as const

type ReactionType = (typeof REACTIONS)[number]['type']

export default function PostReactions({ postSlug }: { postSlug: string }) {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [myReaction, setMyReaction] = useState<{ type: ReactionType; anonymous: boolean; displayName: string | null } | null>(null)

  const [showNames, setShowNames] = useState(false)
  const [namesByType, setNamesByType] = useState<Record<string, string[]> | null>(null)

  const [showNamePanel, setShowNamePanel] = useState(false)
  const [anonymous, setAnonymous] = useState(true)
  const [displayName, setDisplayName] = useState('')

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts])

  const fetchState = async (includeNames: boolean) => {
    const url = `/api/posts/${encodeURIComponent(postSlug)}/reactions${includeNames ? '?includeNames=1' : ''}`
    const response = await fetch(url)
    const data = await response.json()
    if (data.ok) {
      setCounts(data.counts || {})
      setMyReaction(data.myReaction)
      setNamesByType(data.namesByType || null)
      if (data.myReaction) {
        setAnonymous(!!data.myReaction.anonymous)
        setDisplayName(data.myReaction.displayName || '')
      }
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await fetchState(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [postSlug])

  useEffect(() => {
    if (!showNames) return
    ;(async () => {
      try {
        await fetchState(true)
      } catch {}
    })()
  }, [showNames])

  const toggleReaction = async (type: ReactionType) => {
    if (updating) return
    setUpdating(true)
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postSlug)}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, intent: 'toggle' }),
      })
      const data = await response.json()
      if (data.ok) {
        setCounts(data.counts || {})
        setMyReaction(data.myReaction)
        if (showNames) await fetchState(true)
      }
    } finally {
      setUpdating(false)
    }
  }

  const saveNamePrefs = async () => {
    if (!myReaction || updating) return
    setUpdating(true)
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postSlug)}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'set',
          type: myReaction.type,
          anonymous,
          displayName,
        }),
      })
      const data = await response.json()
      if (data.ok) {
        setCounts(data.counts || {})
        setMyReaction(data.myReaction)
        if (showNames) await fetchState(true)
        setShowNamePanel(false)
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#718096] dark:text-[#9ca3af]">
        <div className="w-5 h-5 border-2 border-[#e2e8f0] dark:border-[#4a5568] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading reactions...</span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {REACTIONS.map((r) => {
            const active = myReaction?.type === r.type
            const c = counts[r.type] || 0
            return (
              <button
                key={r.type}
                onClick={() => toggleReaction(r.type)}
                disabled={updating}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                  active
                    ? 'border-[#6b8e6b] dark:border-[#7a9a7a] bg-[#f0f4f0] dark:bg-[#2d3a2d]'
                    : 'border-[#e2e8f0] dark:border-[#4a5568] bg-[#faf9f7] dark:bg-[#1f1f1f]'
                }`}
              >
                <span className={`text-lg ${active ? 'scale-125' : ''}`}>{r.icon}</span>
                <span className="font-medium">{c}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#718096] dark:text-[#9ca3af]">{total} reactions</span>
        </div>
      </div>

      {myReaction && (
        <div className="mt-4 text-sm text-[#718096] dark:text-[#9ca3af]">
          Your reaction:{' '}
          <span className="text-lg">
            {REACTIONS.find((r) => r.type === myReaction.type)?.icon}
          </span>
        </div>
      )}
    </div>
  )
}