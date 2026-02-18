import Link from 'next/link'
import { getAllPosts } from '../lib/posts'

interface PostNavigationProps {
  currentSlug: string
}

export default function PostNavigation({ currentSlug }: PostNavigationProps) {
  const posts = getAllPosts()
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)
  
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-16 pt-8 border-t border-[#e2e8f0] dark:border-[#4a5568]">
      <div className="grid md:grid-cols-2 gap-6">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="group p-6 rounded-2xl border-2 border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-2 text-sm text-[#718096] dark:text-[#9ca3af] mb-2">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Letter
            </div>
            <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] group-hover:text-[#6b8e6b] dark:group-hover:text-[#7a9a7a] transition-colors">
              {previousPost.title}
            </h3>
            <p className="text-sm text-[#718096] dark:text-[#9ca3af] mt-2 line-clamp-2">
              {previousPost.excerpt}
            </p>
          </Link>
        ) : (
          <div className="p-6 rounded-2xl border-2 border-dashed border-[#e2e8f0] dark:border-[#4a5568] bg-[#f7fafc] dark:bg-[#1f1f1f] opacity-50">
            <div className="text-sm text-[#718096] dark:text-[#9ca3af]">No previous letter</div>
          </div>
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group p-6 rounded-2xl border-2 border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 hover:shadow-lg text-right md:text-left"
          >
            <div className="flex items-center justify-end md:justify-start gap-2 text-sm text-[#718096] dark:text-[#9ca3af] mb-2">
              Next Letter
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] group-hover:text-[#6b8e6b] dark:group-hover:text-[#7a9a7a] transition-colors">
              {nextPost.title}
            </h3>
            <p className="text-sm text-[#718096] dark:text-[#9ca3af] mt-2 line-clamp-2">
              {nextPost.excerpt}
            </p>
          </Link>
        ) : (
          <div className="p-6 rounded-2xl border-2 border-dashed border-[#e2e8f0] dark:border-[#4a5568] bg-[#f7fafc] dark:bg-[#1f1f1f] opacity-50 text-right">
            <div className="text-sm text-[#718096] dark:text-[#9ca3af]">No next letter</div>
          </div>
        )}
      </div>
    </nav>
  )
}




