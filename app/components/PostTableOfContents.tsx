interface Heading {
  text: string
  level: 2 | 3
  id: string
}

export default function PostTableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings || headings.length === 0) return null

  return (
<aside className="hidden lg:block w-64 ml-auto">
  <div className="sticky top-28 bg-[var(--card-bg)]/80 border border-[var(--border-soft)] rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm">
    
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] tracking-wide">
        On this page
      </h2>
    </div>

    <nav aria-label="Table of contents">
      <ul className="space-y-1.5 text-sm text-[var(--text-muted)]">
        {headings.map((h, idx) => (
          <li
            key={`${h.id}-${idx}`}
            className={
              h.level === 3
                ? 'pl-4 border-l border-dotted border-[var(--border-soft)]'
                : ''
            }
          >
            <a
              href={`#${h.id}`}
              className="inline-flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-from)]" />
              <span className="line-clamp-2">{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>

  </div>
</aside>
  )
}

