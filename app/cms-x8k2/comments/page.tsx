import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { CMS_PATH, CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function CMSCommentsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect(CMS_LOGIN_PATH)
  }

  const comments = await prisma.comment.findMany({
    include: { parent: true, replies: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">Comment Management</h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">View and delete comments</p>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{comment.name}</h3>
                <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-[#a0aec0] dark:text-[#6b7280]">
                  Post: {comment.postSlug}
                  {comment.parentId && ` · Reply to: ${comment.parent?.name || 'comment'}`}
                </p>
              </div>
            </div>
            <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">{comment.message}</p>
            <form action={`/api/cms-x8k2/comments/${comment.id}/delete`} method="POST" className="inline">
              <button className="bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[#3a1f1f] px-3 py-1 text-sm rounded-lg transition-colors">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#718096] dark:text-[#9ca3af]">No comments yet.</p>
        </div>
      )}
    </div>
  )
}
