import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/app/lib/posts'
import { CMS_PATH, CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function CMSDashboard() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect(CMS_LOGIN_PATH)

  const [posts, comments, likes, reactions, askSubmissions] = await Promise.all([
    getAllPosts(),
    prisma.comment.findMany(),
    prisma.postLike.findMany(),
    prisma.postReaction.findMany(),
    prisma.askSubmission.findMany(),
  ])

  const stats = {
    totalPosts: posts.length,
    totalComments: comments.length,
    totalLikes: likes.length,
    totalReactions: reactions.length,
    totalAskSubmissions: askSubmissions.length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Dashboard</h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">Overview of your blog statistics and quick actions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalPosts}</p>
        </div>
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Comments</p>
          <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalComments}</p>
        </div>
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Post Reactions</p>
          <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalReactions}</p>
        </div>
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-1">Ask Submissions</p>
          <p className="text-3xl font-bold text-[#2d3748] dark:text-[#e5e7eb]">{stats.totalAskSubmissions}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`${CMS_PATH}/posts`} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all">
          <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">Manage Posts</h3>
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">Create, edit, and delete blog posts</p>
        </Link>
        <Link href={`${CMS_PATH}/comments`} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all">
          <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">Manage Comments</h3>
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">View and delete comments</p>
        </Link>
        <Link href={`${CMS_PATH}/ask`} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all">
          <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb] mb-1">Ask Submissions</h3>
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">Check questions from readers</p>
        </Link>
      </div>
    </div>
  )
}
