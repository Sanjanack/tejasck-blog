import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function CMSAskPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect(CMS_LOGIN_PATH)

  const submissions = await prisma.askSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">Ask Submissions</h1>
        <p className="text-[#718096] dark:text-[#9ca3af]">Questions and messages from readers</p>
      </div>
      <div className="space-y-6">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{sub.subject}</h3>
              <span className="text-sm text-[#718096] dark:text-[#9ca3af] whitespace-nowrap">{new Date(sub.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-[#4a5568] dark:text-[#9ca3af] space-y-1 mb-4">
              {sub.name && <p><strong>From:</strong> {sub.name}</p>}
              {sub.email && <p><strong>Email:</strong> <a href={`mailto:${sub.email}`} className="text-[#6b8e6b] hover:underline">{sub.email}</a></p>}
              {sub.ref && <p><strong>Ref:</strong> {sub.ref}</p>}
            </div>
            <p className="text-[#4a5568] dark:text-[#9ca3af] whitespace-pre-wrap">{sub.message}</p>
          </div>
        ))}
      </div>
      {submissions.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl">
          <p className="text-[#718096] dark:text-[#9ca3af]">No submissions yet.</p>
        </div>
      )}
    </div>
  )
}
