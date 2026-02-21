import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/app/lib/posts'

export default async function AdminPostsPage() {
  // Check authentication
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/admin/login')
  }

  const posts = getAllPosts()
  const allLikes = await prisma.postLike.findMany()
  const allComments = await prisma.comment.findMany()

  // Get like counts per post
  const likeCounts = new Map<string, number>()
  allLikes.forEach((like) => {
    likeCounts.set(like.postSlug, (likeCounts.get(like.postSlug) || 0) + 1)
  })

  // Get comment counts per post
  const commentCounts = new Map<string, number>()
  allComments.forEach((comment) => {
    commentCounts.set(comment.postSlug, (commentCounts.get(comment.postSlug) || 0) + 1)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
              Manage Posts
            </h1>
            <Link href="/admin" className="text-[#6b8e6b] dark:text-[#7a9a7a] hover:text-[#5a7a5a] dark:hover:text-[#6b8e6b]">
              ← Dashboard
            </Link>
          </div>
          <Link
            href="/admin/posts/new"
            className="btn-primary"
          >
            + New Post
          </Link>
        </div>

        {process.env.VERCEL && (
          <div className="mb-8 rounded-xl border border-[#f59e0b] dark:border-[#fbbf24] bg-[#fffbeb] dark:bg-[#2e1f0a] px-6 py-4 text-sm text-[#92400e] dark:text-[#fbbf24]">
            Post editing is disabled on Vercel (filesystem is not persistent). Edit Markdown files in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">posts/</code> in your repo, then redeploy.
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f7fafc] dark:bg-[#1f1f1f] border-b border-[#e2e8f0] dark:border-[#4a5568]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#4a5568]">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[#2d3748] dark:text-[#e5e7eb] font-medium hover:text-[#6b8e6b] dark:hover:text-[#7a9a7a]"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-[#718096] dark:text-[#9ca3af] mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#f0f4f0] dark:bg-[#2d3a2d] text-[#5a7a5a] dark:text-[#7a9a7a]"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-[#718096] dark:text-[#9ca3af]">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-[#a0aec0] dark:text-[#6b7280]">No tags</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-[#718096] dark:text-[#9ca3af]">
                        <span className="flex items-center gap-1">
                          <span>❤️</span>
                          {likeCounts.get(post.slug) || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          {commentCounts.get(post.slug) || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📖</span>
                          {post.readingTime} min
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline"
                        >
                          View
                        </Link>
                        <span className="text-[#e2e8f0] dark:text-[#4a5568]">|</span>
                        <Link
                          href={`/admin/posts/${post.slug}/edit`}
                          className="text-sm text-[#5b7c99] dark:text-[#6b8e9f] hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#718096] dark:text-[#9ca3af]">No posts yet.</p>
              <Link href="/admin/posts/new" className="btn-primary mt-4 inline-block">
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

