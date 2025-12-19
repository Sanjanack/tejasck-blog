'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6">
            Something went wrong
          </h1>
          <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p className="text-sm text-[#718096] dark:text-[#9ca3af] mt-4 p-4 bg-[#f7fafc] dark:bg-[#252525] rounded-lg">
              {error.message}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary text-base sm:text-lg"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary text-base sm:text-lg"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

