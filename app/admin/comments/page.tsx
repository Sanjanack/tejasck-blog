import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function AdminCommentsPage() {
  // Check authentication
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/admin/login')
  }

  const comments = await prisma.comment.findMany({
    include: {
      parent: true,
      replies: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Comment Management</h1>
            <Link href="/" className="text-[#6b8e6b] dark:text-[#7a9a7a] hover:text-[#5a7a5a] dark:hover:text-[#6b8e6b]">← Back to Blog</Link>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className={`bg-white dark:bg-[#252525] border rounded-lg p-6 shadow-sm ${
              comment.approved ? 'border-[#6b8e6b] dark:border-[#7a9a7a]' : 'border-[#f59e0b] dark:border-[#fbbf24]'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{comment.name}</h3>
                  <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
                    {comment.email && `${comment.email} • `}
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#a0aec0] dark:text-[#6b7280]">
                    Post: {comment.postSlug}
                    {comment.parentId && ` · Reply to: ${comment.parent?.name || 'comment'}`}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  comment.approved 
                    ? 'bg-[#f0f9f0] dark:bg-[#1a2e1a] text-[#2d5016] dark:text-[#7a9a7a]' 
                    : 'bg-[#fef3c7] dark:bg-[#2e1f0a] text-[#92400e] dark:text-[#fbbf24]'
                }`}>
                  {comment.approved ? 'Approved' : 'Pending'}
                </div>
              </div>
              
              <p className="text-[#4a5568] dark:text-[#9ca3af] mb-4">{comment.message}</p>
              
              <div className="flex gap-2">
                {!comment.approved && (
                  <form action={`/api/admin/comments/${comment.id}/approve`} method="POST" className="inline">
                    <button className="btn-primary px-3 py-1 text-sm">Approve</button>
                  </form>
                )}
                <form action={`/api/admin/comments/${comment.id}/delete`} method="POST" className="inline">
                  <button className="bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] hover:bg-[#fee2e2] dark:hover:bg-[#3a1f1f] px-3 py-1 text-sm rounded-lg transition-colors">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#718096] dark:text-[#9ca3af]">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}


