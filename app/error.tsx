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
          <div className="mb-4">
            <svg className="w-14 h-14 mx-auto text-[#991b1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.2 14.2A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.73-2.94l-8.2-14.2a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
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




