'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '../components/SearchBar'
import PostTags from '../components/PostTags'

export interface PostClient {
  slug: string
  title: string
  date: string
  excerpt: string
  content?: string
  readingTime?: number
  tags?: string[]
  series?: string
  coverImage?: string
  coverImageAlt?: string
}

function BlogClientContent({ posts }: { posts: PostClient[] }) {
  const searchParams = useSearchParams()
  const selectedTag = searchParams.get('tag')
  const selectedSeries = searchParams.get('series')
  const [filteredPosts, setFilteredPosts] = useState<PostClient[]>(posts)
  const [searchQuery, setSearchQuery] = useState('')

  // Group posts by series
  const postsBySeries = useMemo(() => {
    const grouped: Record<string, PostClient[]> = {}
    posts.forEach((post) => {
      const series = post.series || 'Letters from Schmalkalden'
      if (!grouped[series]) {
        grouped[series] = []
      }
      grouped[series].push(post)
    })
    // Sort posts within each series by date (newest first)
    Object.keys(grouped).forEach((series) => {
      grouped[series].sort((a, b) => (a.date < b.date ? 1 : -1))
    })
    return grouped
  }, [posts])

  // Get all unique series
  const allSeries = useMemo(() => {
    const seriesSet = new Set<string>()
    posts.forEach((post) => {
      seriesSet.add(post.series || 'Letters from Schmalkalden')
    })
    return Array.from(seriesSet).sort()
  }, [posts])

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [posts])

  useEffect(() => {
    let filtered = posts

    // Filter by series if selected
    if (selectedSeries) {
      filtered = filtered.filter((post) => (post.series || 'Letters from Schmalkalden') === selectedSeries)
    }

    // Filter by tag if selected
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags?.includes(selectedTag))
    }

    setFilteredPosts(filtered)
  }, [posts, selectedTag, selectedSeries])

  const handleSearchResults = (results: PostClient[]) => {
    setFilteredPosts(results)
  }

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="relative min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b8e6b]/5 blur-3xl dark:bg-[#7a9a7a]/5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5b7c99]/5 blur-3xl dark:bg-[#6b8e9f]/5" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e0] bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b7c99] dark:border-[#4a5568] dark:bg-[#252525]/80 dark:text-[#9ca3af] mb-6">
            Letters from Schmalkalden
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
            <span className="bg-gradient-to-r from-[#2d3748] to-[#6b8e6b] dark:from-[#e5e7eb] dark:to-[#7a9a7a] bg-clip-text text-transparent">
              My Letters
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4a5568] dark:text-[#9ca3af] max-w-2xl mx-auto">
            Stories from my journey in Germany
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              allPosts={posts}
              onSearchResults={handleSearchResults}
              onSearchQuery={handleSearchQuery}
            />
          </div>

          {/* Series Filter */}
          {allSeries.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedSeries
                    ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                    : 'bg-[#f7fafc] dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#edf2f7] dark:hover:bg-[#2d2d2d] border border-[#e2e8f0] dark:border-[#4a5568]'
                }`}
              >
                All Series
              </Link>
              {allSeries.map((series) => (
                <Link
                  key={series}
                  href={`/blog?series=${encodeURIComponent(series)}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSeries === series
                      ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                      : 'bg-[#f7fafc] dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#edf2f7] dark:hover:bg-[#2d2d2d] border border-[#e2e8f0] dark:border-[#4a5568]'
                  }`}
                >
                  {series}
                </Link>
              ))}
            </div>
          )}

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Link
                href={selectedSeries ? `/blog?series=${encodeURIComponent(selectedSeries)}` : "/blog"}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                    : 'bg-[#f7fafc] dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#edf2f7] dark:hover:bg-[#2d2d2d] border border-[#e2e8f0] dark:border-[#4a5568]'
                }`}
              >
                All Tags
              </Link>
              {allTags.map((tag) => {
                const href = selectedSeries 
                  ? `/blog?series=${encodeURIComponent(selectedSeries)}&tag=${encodeURIComponent(tag)}`
                  : `/blog?tag=${encodeURIComponent(tag)}`
                return (
                  <Link
                    key={tag}
                    href={href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                        : 'bg-[#f7fafc] dark:bg-[#252525] text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#edf2f7] dark:hover:bg-[#2d2d2d] border border-[#e2e8f0] dark:border-[#4a5568]'
                    }`}
                  >
                    #{tag}
                  </Link>
                )
              })}
            </div>
          )}

          {(searchQuery || selectedTag || selectedSeries) && (
            <div className="text-[#718096] dark:text-[#9ca3af] text-sm mb-4">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
              {selectedSeries && ` in "${selectedSeries}"`}
              {selectedTag && ` tagged "${selectedTag}"`}
              {searchQuery && ` matching "${searchQuery}"`}
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
        ) : !searchQuery && !selectedTag && !selectedSeries ? (
          // Group by series when no filters are active
          <div className="space-y-16">
            {Object.entries(postsBySeries).map(([series, seriesPosts]) => (
              <div key={series} className="animate-fade-in">
                <div className="mb-8 pb-4 border-b border-[#e2e8f0] dark:border-[#4a5568]">
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">
                    {series}
                  </h2>
                  <p className="text-[#718096] dark:text-[#9ca3af]">
                    {seriesPosts.length} letter{seriesPosts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid gap-8 lg:gap-12">
                  {seriesPosts.map((post, index) => (
                    <article
                      key={post.slug}
                      className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 hover:shadow-md animate-slide-up"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                          {post.coverImage && (
                            <div className="mb-5 overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#4a5568]">
                              <Image
                                src={post.coverImage}
                                alt={post.coverImageAlt || post.title}
                                width={1200}
                                height={675}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
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

                          {post.tags && post.tags.length > 0 && (
                            <PostTags tags={post.tags} postSlug={post.slug} />
                          )}

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                        <span className="text-sm text-[#718096] dark:text-[#9ca3af]">
                          {post.readingTime || (post.content ? Math.ceil(post.content.split(' ').length / 200) : 0)} min read
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
              </div>
            ))}
          </div>
        ) : (
          // Show flat list when filters are active
          <div className="grid gap-8 lg:gap-12">
            {filteredPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-8 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {post.coverImage && (
                      <div className="mb-5 overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#4a5568]">
                        <Image
                          src={post.coverImage}
                          alt={post.coverImageAlt || post.title}
                          width={1200}
                          height={675}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
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

                    {post.tags && post.tags.length > 0 && (
                      <PostTags tags={post.tags} postSlug={post.slug} />
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#718096] dark:text-[#9ca3af]">
                          {post.readingTime || (post.content ? Math.ceil(post.content.split(' ').length / 200) : 0)} min read
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

export default function BlogClient({ posts }: { posts: PostClient[] }) {
  return <BlogClientContent posts={posts} />
}


