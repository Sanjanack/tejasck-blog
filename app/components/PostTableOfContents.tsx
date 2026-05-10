'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface Heading {
  text: string
  level: 2 | 3
  id: string
}

export default function PostTableOfContents({ headings }: { headings: Heading[] }) {
  const safeHeadings = useMemo(() => headings ?? [], [headings])

  const [activeId, setActiveId] = useState(safeHeadings[0]?.id ?? '')
  const [collapsed, setCollapsed] = useState(false)
  const tocScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (safeHeadings.length === 0) return

    const orderedIds = safeHeadings.map((h) => h.id)

    const getActiveFromScroll = () => {
      const offset = 140 // accounts for header + breathing room
      let bestId = orderedIds[0]

      for (const id of orderedIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top - offset <= 0) {
          bestId = id
        } else {
          break
        }
      }
      return bestId
    }

    // set initial from hash if present
    const hash = window.location.hash.replace('#', '')
    if (hash && orderedIds.includes(hash)) {
      setActiveId(hash)
    } else {
      setActiveId(getActiveFromScroll())
    }

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setActiveId(getActiveFromScroll())
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [safeHeadings])

  const mobileHeadings = useMemo(
    () => safeHeadings.filter((heading) => heading.level === 2),
    [safeHeadings]
  )

  const sections = useMemo(() => {
    const result: { h2: Heading; h3: Heading[] }[] = []
    for (const heading of safeHeadings) {
      if (heading.level === 2) {
        result.push({ h2: heading, h3: [] })
      } else if (heading.level === 3) {
        const last = result[result.length - 1]
        if (last) last.h3.push(heading)
      }
    }
    return result
  }, [safeHeadings])

  const activeSectionId = useMemo(() => {
    let currentH2 = sections[0]?.h2.id ?? ''
    for (const section of sections) {
      if (section.h2.id === activeId) currentH2 = section.h2.id
      if (section.h3.some((h) => h.id === activeId)) currentH2 = section.h2.id
    }
    return currentH2
  }, [activeId, sections])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('post_toc_collapsed')
      if (raw === '1') setCollapsed(true)
      if (raw === '0') setCollapsed(false)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('post_toc_collapsed', collapsed ? '1' : '0')
    } catch {
      // ignore
    }
  }, [collapsed])

  useEffect(() => {
    const layout = document.getElementById('post-content-layout')
    if (!layout) return
    if (collapsed) {
      layout.classList.add('toc-collapsed')
    } else {
      layout.classList.remove('toc-collapsed')
    }
    return () => {
      layout.classList.remove('toc-collapsed')
    }
  }, [collapsed])

  useEffect(() => {
    const tocScrollEl = tocScrollRef.current
    if (!tocScrollEl) return
    if (collapsed) return

    const activeLink = tocScrollEl.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(activeId)}"]`)
    if (!activeLink) return

    // Keep the active item visible while reading (platform-style).
    const containerRect = tocScrollEl.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const targetTop = tocScrollEl.scrollTop + (linkRect.top - containerRect.top) - tocScrollEl.clientHeight / 2 + linkRect.height / 2
    tocScrollEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }, [activeId, collapsed])

  if (safeHeadings.length === 0) return null

  return (
    <>
      <div className="mb-6 md:hidden">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--card-bg)]/85 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            On this page
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {mobileHeadings.map((heading) => {
              const isActive = activeId === heading.id
              return (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'border-[var(--accent-from)] bg-[var(--accent-from)]/12 text-[var(--accent-from)]'
                      : 'border-[var(--border-soft)] text-[var(--text-muted)]'
                  }`}
                >
                  {heading.text}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <aside className="hidden md:block md:w-72 md:flex-shrink-0">
        <div
          className={`sticky top-24 rounded-3xl border border-[var(--border-soft)] bg-[var(--card-bg)]/90 shadow-[0_16px_48px_rgba(15,23,42,0.08)] backdrop-blur-md ${
            collapsed ? 'px-3 py-3' : 'p-5'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
                On this page
              </div>
              {!collapsed && (
                <div className="mt-2 h-px w-full bg-gradient-to-r from-[var(--accent-from)]/50 via-[var(--accent-to)]/30 to-transparent" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="shrink-0 rounded-xl border border-[var(--border-soft)] bg-transparent px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5"
              aria-label={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>

          {!collapsed && (
            <nav className="mt-4" aria-label="Table of contents">
              <div
                ref={tocScrollRef}
                className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2"
              >
              <ul className="space-y-2 text-sm">
                {sections.map((section) => {
                  const isSectionActive = activeSectionId === section.h2.id
                  return (
                    <li key={section.h2.id}>
                      <a
                        href={`#${section.h2.id}`}
                        className={`group flex items-start gap-3 rounded-2xl px-3 py-2 transition-all ${
                          isSectionActive
                            ? 'bg-[var(--accent-from)]/10 text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:bg-black/5 hover:text-[var(--text-primary)] dark:hover:bg-white/5'
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full transition-colors ${
                            isSectionActive
                              ? 'bg-[var(--accent-from)]'
                              : 'bg-[var(--accent-to)]/50 group-hover:bg-[var(--accent-from)]'
                          }`}
                        />
                        <span className={`line-clamp-2 ${isSectionActive ? 'font-semibold' : ''}`}>
                          {section.h2.text}
                        </span>
                      </a>

                      {isSectionActive && section.h3.length > 0 && (
                        <ul className="mt-2 space-y-1.5 border-l border-dashed border-[var(--border-soft)] pl-4">
                          {section.h3.map((h3) => {
                            const isActive = activeId === h3.id
                            return (
                              <li key={h3.id}>
                                <a
                                  href={`#${h3.id}`}
                                  className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                                    isActive
                                      ? 'text-[var(--accent-from)] font-medium bg-[var(--accent-from)]/10'
                                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <span className="line-clamp-2">{h3.text}</span>
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
              </div>
            </nav>
          )}
        </div>
      </aside>
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="hidden md:inline-flex fixed left-4 top-24 z-30 rounded-xl border border-[var(--border-soft)] bg-[var(--card-bg)]/90 px-3 py-2 text-xs font-semibold text-[var(--text-muted)] shadow backdrop-blur hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Show table of contents"
        >
          Show TOC
        </button>
      )}
    </>
  )
}

