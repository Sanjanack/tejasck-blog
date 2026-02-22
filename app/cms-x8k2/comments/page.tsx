import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { CMS_PATH, CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function CMSCommentsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect(CMS_LOGIN_PATH)
  }

  const allComments = await prisma.comment.findMany({
    include: { parent: true, replies: true },
    orderBy: { createdAt: 'desc' },
  })
  const topLevel = allComments.filter((c) => !c.parentId)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">Comment Management</h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">View and delete comments. Use Reply on the blog to reply to comments.</p>
      </div>

      <div className="space-y-6">
        {topLevel.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{comment.name}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#a0aec0] dark:text-[#6b7280]">Post: {comment.postSlug}</p>
                </div>
                <form action={`/api/cms-x8k2/comments/${comment.id}/delete`} method="POST" className="inline">
                  <button className="bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[#3a1f1f] px-3 py-1 text-sm rounded-lg transition-colors">
                    Delete
                  </button>
                </form>
              </div>
              <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">{comment.message}</p>
            </div>
            {comment.replies.length > 0 && (
              <div className="ml-6 space-y-3 border-l-2 border-[#e2e8f0] dark:border-[#4a5568] pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-white/80 dark:bg-[#252525]/80 border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{reply.name}</span>
                        <span className="text-xs text-[#718096] dark:text-[#9ca3af] ml-2">
                          {new Date(reply.createdAt).toLocaleString()} · Reply
                        </span>
                      </div>
                      <form action={`/api/cms-x8k2/comments/${reply.id}/delete`} method="POST" className="inline">
                        <button className="bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] px-2 py-1 text-xs rounded">Delete</button>
                      </form>
                    </div>
                    <p className="text-sm text-[#4a5568] dark:text-[#9ca3af]">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {topLevel.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#718096] dark:text-[#9ca3af]">No comments yet.</p>
        </div>
      )}
    </div>
  )
}
