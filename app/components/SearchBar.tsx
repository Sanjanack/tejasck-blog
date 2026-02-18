'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  date: string
  content?: string
  readingTime?: number
  tags?: string[]
  series?: string
}

interface SearchBarProps {
  allPosts: SearchResult[]
  onSearchResults: (results: SearchResult[]) => void
  onSearchQuery: (query: string) => void
}

export default function SearchBar({ allPosts, onSearchResults, onSearchQuery }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      )
      onSearchResults(filtered)
      onSearchQuery(query)
    } else {
      onSearchResults(allPosts)
      onSearchQuery('')
    }
  }, [query, allPosts, onSearchResults, onSearchQuery])

  const suggestions = query
    ? allPosts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : []

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[#718096] dark:text-[#9ca3af]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b] focus:border-transparent transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] dark:text-[#9ca3af] hover:text-[#2d3748] dark:hover:text-[#e5e7eb]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="p-3 text-sm text-[#718096] dark:text-[#9ca3af]">No matches.</div>
          ) : (
            suggestions.map((post) => (
              <button
                key={post.slug}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                  router.push(`/blog/${post.slug}`)
                }}
                className="w-full text-left p-3 hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] cursor-pointer border-b border-[#e2e8f0] dark:border-[#4a5568] last:border-b-0"
              >
                <div className="font-medium text-[#2d3748] dark:text-[#e5e7eb]">{post.title}</div>
                <div className="text-sm text-[#718096] dark:text-[#9ca3af] mt-1 line-clamp-2">{post.excerpt}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
