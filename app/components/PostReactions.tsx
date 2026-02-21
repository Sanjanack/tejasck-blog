'use client'

import { useEffect, useMemo, useState } from 'react'

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug])

  useEffect(() => {
    if (!showNames) return
    ;(async () => {
      try {
        await fetchState(true)
      } catch {
        // ignore
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (showNames) {
          // refresh names if panel open
          await fetchState(true)
        }
      }
    } finally {
      setUpdating(false)
    }
  }

  const saveNamePrefs = async () => {
    if (!myReaction) return
    if (updating) return
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
        if (showNames) {
          await fetchState(true)
        }
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
                type="button"
                onClick={() => toggleReaction(r.type)}
                disabled={updating}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                  active
                    ? 'border-[#6b8e6b] dark:border-[#7a9a7a] bg-[#f0f4f0] dark:bg-[#2d3a2d] text-[#2d3748] dark:text-[#e5e7eb]'
                    : 'border-[#e2e8f0] dark:border-[#4a5568] bg-[#faf9f7] dark:bg-[#1f1f1f] text-[#4a5568] dark:text-[#9ca3af] hover:bg-white dark:hover:bg-[#252525]'
                } disabled:opacity-60`}
                aria-pressed={active}
                title={r.label}
              >
                <span className="text-base">{r.emoji}</span>
                <span className="font-medium">{c}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[#718096] dark:text-[#9ca3af]">{total} reactions</span>
          <label className="inline-flex items-center gap-2 text-sm text-[#4a5568] dark:text-[#9ca3af]">
            <input
              type="checkbox"
              checked={showNames}
              onChange={(e) => setShowNames(e.target.checked)}
              className="accent-[#6b8e6b]"
            />
            Show names
          </label>
        </div>
      </div>

      {showNames && namesByType && (
        <div className="mt-4 grid gap-2">
          {REACTIONS.map((r) => {
            const names = namesByType[r.type] || []
            if (names.length === 0) return null
            return (
              <div key={r.type} className="text-sm text-[#4a5568] dark:text-[#9ca3af]">
                <span className="mr-2">{r.emoji}</span>
                <span className="font-medium">{names.join(', ')}</span>
                {names.length >= 10 && <span className="text-[#718096] dark:text-[#9ca3af]"> …</span>}
              </div>
            )
          })}
        </div>
      )}

      {myReaction && (
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-[#718096] dark:text-[#9ca3af]">
            Your reaction: <span className="font-medium text-[#2d3748] dark:text-[#e5e7eb]">{REACTIONS.find((r) => r.type === myReaction.type)?.emoji}</span>
            {myReaction.anonymous ? <span className="ml-2">(anonymous)</span> : myReaction.displayName ? <span className="ml-2">({myReaction.displayName})</span> : null}
          </div>
          <button
            type="button"
            onClick={() => setShowNamePanel((v) => !v)}
            className="text-sm text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline"
          >
            {showNamePanel ? 'Close' : 'Show my name (optional)'}
          </button>
        </div>
      )}

      {myReaction && showNamePanel && (
        <div className="mt-3 rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-[#faf9f7] dark:bg-[#1f1f1f] p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <label className="inline-flex items-center gap-2 text-sm text-[#4a5568] dark:text-[#9ca3af]">
              <input
                type="checkbox"
                checked={!anonymous}
                onChange={(e) => setAnonymous(!e.target.checked)}
                className="accent-[#6b8e6b]"
              />
              Show my name next to the emoji
            </label>
            <button
              type="button"
              onClick={saveNamePrefs}
              disabled={updating}
              className="btn-primary px-4 py-2 disabled:opacity-60"
            >
              Save
            </button>
          </div>

          {!anonymous && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name (shown publicly)"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
              maxLength={40}
            />
          )}

          {anonymous && <p className="mt-2 text-xs text-[#718096] dark:text-[#9ca3af]">Your reaction stays anonymous.</p>}
        </div>
      )}
    </div>
  )
}

