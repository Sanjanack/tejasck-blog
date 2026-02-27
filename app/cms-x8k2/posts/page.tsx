import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/app/lib/posts'
import { CMS_PATH, CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function CMSPostsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect(CMS_LOGIN_PATH)

  const posts = getAllPosts()
  const [allLikes, allComments] = await Promise.all([
    prisma.postLike.findMany(),
    prisma.comment.findMany(),
  ])

  const likeCounts = new Map<string, number>()
  allLikes.forEach((l) => likeCounts.set(l.postSlug, (likeCounts.get(l.postSlug) || 0) + 1))
  const commentCounts = new Map<string, number>()
  allComments.forEach((c) => commentCounts.set(c.postSlug, (commentCounts.get(c.postSlug) || 0) + 1))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">Manage Posts</h1>
          <Link href={CMS_PATH} className="text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline">← Dashboard</Link>
        </div>
        <Link href={`${CMS_PATH}/posts/new`} className="btn-primary">+ New Post</Link>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7fafc] dark:bg-[#1f1f1f] border-b border-[#e2e8f0] dark:border-[#4a5568]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#718096] dark:text-[#9ca3af] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#4a5568]">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]">
                  <td className="px-6 py-4">
                    <Link href={`/blog/${post.slug}`} className="font-medium text-[#2d3748] dark:text-[#e5e7eb] hover:text-[#6b8e6b]">{post.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">{new Date(post.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-[#718096] dark:text-[#9ca3af]">❤️ {likeCounts.get(post.slug) || 0} · 💬 {commentCounts.get(post.slug) || 0}</td>
                  <td className="px-6 py-4">
                    <Link href={`/blog/${post.slug}`} className="text-sm text-[#6b8e6b] hover:underline mr-2">View</Link>
                    <Link href={`${CMS_PATH}/posts/${post.slug}/edit`} className="text-sm text-[#5b7c99] hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#718096] dark:text-[#9ca3af]">No posts yet.</p>
            <Link href={`${CMS_PATH}/posts/new`} className="btn-primary mt-4 inline-block">Create Your First Post</Link>
          </div>
        )}
      </div>
    </div>
  )
}
