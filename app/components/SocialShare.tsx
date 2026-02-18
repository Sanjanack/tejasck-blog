'use client'

import { useState } from 'react'

interface SocialShareProps {
  title: string
  url: string
  description?: string
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const shareData = {
    title,
    text: description || title,
    url: fullUrl,
  }

  const handleLinkedIn = () => {
    const encodedUrl = encodeURIComponent(fullUrl)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // fall through to copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-[#718096] dark:text-[#9ca3af] font-medium">Share:</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleLinkedIn}
          className="p-2 rounded-lg bg-[#0077b5] text-white hover:bg-[#006399] transition-colors duration-200"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </button>

        <button
          onClick={handleShare}
          className={`p-2 rounded-lg border-2 transition-colors duration-200 ${
            copied
              ? 'bg-[#6b8e6b] text-white border-[#6b8e6b]'
              : 'bg-white dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] border-[#e2e8f0] dark:border-[#4a5568] hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a]'
          }`}
          aria-label="Share or copy link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

