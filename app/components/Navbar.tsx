'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname === path
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const renderThemeIcon = () => {
    if (!mounted) {
      return <span className="block h-5 w-5 rounded-full bg-gradient-to-r from-rhine-400 to-blue-500 animate-pulse" />
    }

    if (theme === 'dark') {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M12 4.5V3M17.303 6.697l.955-.955M19.5 12h1.5M17.303 17.303l.955.955M12 21v-1.5M5.742 18.258l.955-.955M3 12h1.5M5.742 5.742l.955.955"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-amber-300"
          />
          <circle cx="12" cy="12" r="3.25" className="fill-amber-200" />
        </svg>
      )
    }

    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="none">
        <path
          d="M21 14.5a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 21 14.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-[#4a5568] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
              ✦
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-wide text-[#2d3748] dark:text-[#e5e7eb] group-hover:text-[#6b8e6b] dark:group-hover:text-[#7a9a7a] transition-colors duration-300">
                Tejas CK Studio
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">
                Letters Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/#series', label: 'Series' },
              { href: '/blog', label: 'Letters' },
              { href: '/about', label: 'About' },
              { href: '/ask', label: 'Ask' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-[#6b8e6b] text-white shadow-sm'
                    : 'text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] hover:text-[#2d3748] dark:hover:bg-[#252525] dark:hover:text-[#e5e7eb]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light or dark mode"
              aria-pressed={theme === 'dark'}
              className="ml-2 inline-flex items-center justify-center rounded-lg border border-[#e2e8f0] dark:border-[#4a5568] p-2 text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#252525] transition-colors"
            >
              {renderThemeIcon()}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-[#2d3748] dark:text-[#e5e7eb] hover:text-[#6b8e6b] focus:outline-none p-2 rounded-lg hover:bg-[#f7fafc] dark:hover:bg-[#252525] transition-all duration-200 border border-[#e2e8f0] dark:border-[#4a5568]"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        {open && (
          <div id="mobile-menu" className="md:hidden pb-4 animate-fade-in">
            <div className="mt-2 grid gap-2 rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-4 shadow-lg">
              {[
                { href: '/', label: 'Home' },
                { href: '/#series', label: 'Series' },
                { href: '/blog', label: 'Letters' },
                { href: '/about', label: 'About' },
                { href: '/ask', label: 'Ask' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-[#6b8e6b] text-white'
                      : 'text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#2d2d2d]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 inline-flex items-center justify-between rounded-lg border border-[#e2e8f0] dark:border-[#4a5568] px-4 py-3 text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#252525]"
              >
                <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
                {renderThemeIcon()}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
