import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-serif font-bold text-[#6b8e6b] dark:text-[#7a9a7a] mb-4">404</h1>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6">
            Page Not Found
          </h2>
          <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary text-base sm:text-lg"
          >
            Go Home
          </Link>
          <Link
            href="/blog"
            className="btn-secondary text-base sm:text-lg"
          >
            Browse Letters
          </Link>
        </div>
      </div>
    </div>
  )
}

