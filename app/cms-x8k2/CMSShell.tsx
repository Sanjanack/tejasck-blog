'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CMS_PATH } from '@/app/lib/cms-constants'

const BASE = CMS_PATH

export default function CMSShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === `${BASE}/login`) {
    return (
      <div className="min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
        {children}
      </div>
    )
  }

  const nav = [
    { href: BASE, label: 'Dashboard', icon: '📊' },
    { href: `${BASE}/posts`, label: 'Posts', icon: '📝' },
    { href: `${BASE}/comments`, label: 'Comments', icon: '💬' },
    { href: `${BASE}/ask`, label: 'Ask Submissions', icon: '✉️' },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] flex">
      <aside className="w-64 flex-shrink-0 border-r border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] flex flex-col min-h-screen">
        <div className="p-6 border-b border-[#e2e8f0] dark:border-[#4a5568]">
          <Link href={BASE} className="text-xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb]">
            Studio
          </Link>
          <p className="text-xs text-[#718096] dark:text-[#9ca3af] mt-1">
            Tejas C.K Studio
          </p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href || (item.href !== BASE && pathname?.startsWith(item.href + '/'))
                  ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                  : 'text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#e2e8f0] dark:border-[#4a5568]">
          <form action="/api/cms-x8k2/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#718096] dark:text-[#9ca3af] hover:text-[#991b1b] dark:hover:text-[#fca5a5] transition-colors rounded-lg hover:bg-[#fef2f2] dark:hover:bg-[#2e1a1a]"
            >
              <span>🚪</span> Log out
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 overflow-auto pt-4 pb-12">
        {children}
      </div>
    </div>
  )
}
