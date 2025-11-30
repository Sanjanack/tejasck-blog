'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'

export interface PostClient {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime?: number
}

export default function BlogClient({ posts }: { posts: PostClient[] }) {
  const [filteredPosts, setFilteredPosts] = useState<PostClient[]>(posts)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setFilteredPosts(posts)
  }, [posts])

  const handleSearchResults = (results: PostClient[]) => {
    setFilteredPosts(results)
  }

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6">
            My Blog
          </h1>
          <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] max-w-3xl mx-auto mb-8">
            Stories, thoughts, and experiences from my journey in Germany
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              allPosts={posts}
              onSearchResults={handleSearchResults}
              onSearchQuery={handleSearchQuery}
            />
          </div>

          {searchQuery && (
            <div className="text-[#718096] dark:text-[#9ca3af] text-sm">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-8xl mb-6">📝</div>
            <h2 className="text-3xl font-serif text-[#2d3748] dark:text-[#e5e7eb] mb-4">
              {searchQuery ? 'No posts found' : 'No posts yet'}
            </h2>
            <p className="text-[#718096] dark:text-[#9ca3af] text-lg">
              {searchQuery 
                ? 'Try a different search term' 
                : 'The first post is being written...'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:gap-12">
            {filteredPosts.map((post, index) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 hover:shadow-md animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-[#6b8e6b] dark:bg-[#7a9a7a] rounded-full"></div>
                      <time 
                        dateTime={post.date}
                        className="text-sm text-[#718096] dark:text-[#9ca3af]"
                      >
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4 hover:text-[#6b8e6b] dark:hover:text-[#7a9a7a] transition-colors duration-300">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-[#4a5568] dark:text-[#9ca3af] leading-relaxed mb-6 text-lg">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#718096] dark:text-[#9ca3af]">
                          {post.readingTime || Math.ceil(post.content.split(' ').length / 200)} min read
                        </span>
                        <div className="flex gap-1">
                          {['📚', '✍️', '🇩🇪'].map((emoji, i) => (
                            <span key={i} className="text-sm">{emoji}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:ml-8 flex-shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[#6b8e6b] dark:text-[#7a9a7a] hover:text-[#5a7a5a] dark:hover:text-[#6b8e6b] font-medium transition-all duration-300 hover:gap-3 group"
                    >
                      Read full post
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


