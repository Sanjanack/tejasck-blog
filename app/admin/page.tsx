import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/app/lib/posts'

export default async function AdminDashboard() {
  // Check authentication
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/admin/login')
  }

  // Get stats
  const [posts, comments, likes, askSubmissions] = await Promise.all([
    getAllPosts(),
    prisma.comment.findMany(),
    prisma.postLike.findMany(),
    prisma.askSubmission.findMany(),
  ])

  const stats = {
    totalPosts: posts.length,
    totalComments: comments.length,
    approvedComments: comments.filter((c) => c.approved).length,
    pendingComments: comments.filter((c) => !c.approved).length,
    totalLikes: likes.length,
    totalAskSubmissions: askSubmissions.length,
  }

  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
            Admin Dashboard
          </h1>
          <p className="text-[#718096] dark:text-[#9ca3af]">
            Overview of your blog statistics and quick actions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Total Posts</p>
                <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-[#f0f4f0] dark:bg-[#2d3a2d] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Comments</p>
                <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">
                  {stats.approvedComments}
                  <span className="text-lg text-[#718096] dark:text-[#9ca3af] ml-2">
                    / {stats.totalComments}
                  </span>
                </p>
                {stats.pendingComments > 0 && (
                  <p className="text-xs text-[#f59e0b] dark:text-[#fbbf24] mt-1">
                    {stats.pendingComments} pending
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-[#f0f4f7] dark:bg-[#2d3a3f] rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalLikes}</p>
              </div>
              <div className="w-12 h-12 bg-[#fef2f2] dark:bg-[#2e1a1a] rounded-lg flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Ask Submissions</p>
                <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalAskSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-[#f0f4f7] dark:bg-[#2d3a3f] rounded-lg flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/posts"
            className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f0f4f0] dark:bg-[#2d3a2d] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">
                  Manage Posts
                </h3>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  Create, edit, and delete blog posts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/comments"
            className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f0f4f7] dark:bg-[#2d3a3f] rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">
                  Moderate Comments
                </h3>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  Approve or delete comments
                  {stats.pendingComments > 0 && (
                    <span className="ml-2 text-[#f59e0b] dark:text-[#fbbf24] font-medium">
                      ({stats.pendingComments} pending)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/ask"
            className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f0f4f7] dark:bg-[#2d3a3f] rounded-lg flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">
                  View Ask Submissions
                </h3>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  Check questions from readers
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

