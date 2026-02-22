'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CMS_PATH } from '@/app/lib/cms-constants'
import { useTheme } from '@/app/components/ThemeProvider'

const BASE = CMS_PATH

export default function CMSShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
    { href: `${BASE}/handbook`, label: 'Handbook', icon: '📖' },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] flex">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-14'} flex-shrink-0 border-r border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] flex flex-col min-h-screen transition-all duration-200`}
      >
        <div className="p-4 border-b border-[#e2e8f0] dark:border-[#4a5568] flex items-center justify-between gap-2">
          {sidebarOpen ? (
            <>
              <Link href={BASE} className="text-xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] truncate">
                Studio
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] flex-shrink-0"
                aria-label="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="w-full p-2 rounded-lg text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]"
              aria-label="Expand sidebar"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {sidebarOpen ? (
          <>
            <p className="text-xs text-[#718096] dark:text-[#9ca3af] px-4 pb-2">Tejas C.K Studio</p>
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
            <div className="p-4 border-t border-[#e2e8f0] dark:border-[#4a5568] space-y-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
              >
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                {theme === 'dark' ? 'Light' : 'Dark'} mode
              </button>
              <form action="/api/cms-x8k2/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#718096] dark:text-[#9ca3af] hover:text-[#991b1b] dark:hover:text-[#fca5a5] transition-colors rounded-lg hover:bg-[#fef2f2] dark:hover:bg-[#2e1a1a]"
                >
                  <span>🚪</span> Log out
                </button>
              </form>
            </div>
          </>
        ) : (
          <nav className="p-2 space-y-1 flex-1 flex flex-col items-center">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-lg transition-colors ${
                  pathname === item.href || (item.href !== BASE && pathname?.startsWith(item.href + '/'))
                    ? 'bg-[#6b8e6b] text-white dark:bg-[#7a9a7a]'
                    : 'text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]'
                }`}
              >
                {item.icon}
              </Link>
            ))}
            <div className="mt-auto p-2 space-y-1 flex flex-col items-center">
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                className="w-10 h-10 flex items-center justify-center text-lg text-[#718096] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d] rounded-lg"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <form action="/api/cms-x8k2/logout" method="POST">
                <button
                  type="submit"
                  title="Log out"
                  className="w-10 h-10 flex items-center justify-center text-lg text-[#718096] dark:text-[#9ca3af] hover:text-[#991b1b] dark:hover:text-[#fca5a5] hover:bg-[#fef2f2] dark:hover:bg-[#2e1a1a] rounded-lg"
                >
                  🚪
                </button>
              </form>
            </div>
          </nav>
        )}
      </aside>
      <div className="flex-1 overflow-auto pt-4 pb-12 px-4">
        {children}
      </div>
    </div>
  )
}
