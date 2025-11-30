import Link from 'next/link'

const futureSeries = [
  {
    title: 'Letters from Schmalkalden',
    status: 'Live Now',
    description: 'Study-vlog diary from Germany with scripts, clips, and Q&A.',
    accent: '#6b8e6b',
    href: '/blog',
  },
  {
    title: 'Tejas C K Bytes',
    status: 'Idea parking lot',
    description: 'Tech + BTech lessons distilled for friends back home.',
    accent: '#6b8e6b',
    locked: true,
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf9f7] dark:bg-[#1a1a1a] pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-[#6b8e6b]/10 blur-3xl dark:bg-[#7a9a7a]/10" />
        <div className="absolute top-24 -left-24 w-80 h-80 bg-[#5b7c99]/8 blur-3xl dark:bg-[#6b8e9f]/10" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#6b8e6b]/8 blur-3xl dark:bg-[#7a9a7a]/8" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <header className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e0] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b7c99] dark:border-[#4a5568] dark:bg-[#252525]/90 dark:text-[#9ca3af]">
              Tejas C K Studio · Publishing Hub
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] leading-tight">
              One home for every Tejas C K story.
              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-4 font-sans text-[#4a5568] dark:text-[#9ca3af]">
                Letters from Schmalkalden is the flagship series—more channels plug in right here.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[#4a5568] dark:text-[#9ca3af] max-w-2xl">
              Built so my brother Tejas can drop vlogs, essays, and voice notes from anywhere. Each series gets its own vibe, but lives under one URL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/blog" className="btn-primary text-base sm:text-lg">
                Dive into Letters
              </Link>
              <Link href="/ask" className="btn-secondary text-base sm:text-lg">
                Pitch a story idea
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-secondary-300 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {['DE', 'IN', 'US'].map((initials) => (
                  <span
                    key={initials}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4a5568] dark:bg-[#252525] dark:text-[#e5e7eb] border border-[#e2e8f0] dark:border-[#4a5568] shadow-sm"
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span>Readers from all over the world follow the Schmalkalden letters.</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] shadow-md p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">
              Series Dashboard
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-[#2d3748] dark:text-[#e5e7eb]">
              Letters from Schmalkalden · Germany
            </h2>
            <p className="mt-3 text-[#4a5568] dark:text-[#9ca3af]">
              Snowy dorm mornings, visa paperwork, German language fails, and the vlog footage that doesn’t fit on Instagram.
            </p>
            <ul className="mt-6 space-y-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#6b8e6b]" />
                Script + video drops every Sunday (CET)
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#5b7c99]" />
                Ask form responses become bonus newsletters
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#6b8e6b]" />
                B-roll kit: Sony ZV-1, iPhone 15, Notion notes
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-[#f0f4f0] text-[#5a7a5a] dark:bg-[#2d3a2d] dark:text-[#7a9a7a] px-3 py-1 text-sm font-medium">
                🎥 Vlog-heavy
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-[#f0f4f7] text-[#4a6a7a] dark:bg-[#2d3a3f] dark:text-[#6b8e9f] px-3 py-1 text-sm font-medium">
                ✉️ Letter-style writing
              </span>
            </div>
          </div>
        </header>

        <section id="series" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">Series lineup</p>
              <h3 className="text-3xl font-semibold text-[#2d3748] dark:text-[#e5e7eb] mt-2">Every channel lives here.</h3>
              <p className="text-[#4a5568] dark:text-[#9ca3af] mt-2 max-w-2xl">
                Spin up a new series whenever Tejas feels like switching continents or topics. Letters from Schmalkalden stays as a sub-brand under this canopy.
              </p>
            </div>
            <Link href="/about" className="btn-secondary text-sm">
              Meet the creator
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {futureSeries.map((series) => (
              <div
                key={series.title}
                className={`relative overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-6 shadow-sm ${series.locked ? 'opacity-70' : ''}`}
              >
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] font-semibold">
                    <span className="text-[#718096] dark:text-[#9ca3af]">{series.status}</span>
                    {series.locked && <span className="text-[#a0aec0] dark:text-[#6b7280]">Locked</span>}
                  </div>
                  <h4 className="text-xl font-semibold text-[#2d3748] dark:text-[#e5e7eb]">{series.title}</h4>
                  <p className="text-sm text-[#4a5568] dark:text-[#9ca3af]">{series.description}</p>
                  {!series.locked && series.href && (
                    <Link href={series.href} className="text-sm font-medium text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline">
                      Open series →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">What readers get</p>
            <h3 className="mt-4 text-2xl font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Narrated vlogs + long-form letters</h3>
            <ul className="mt-6 space-y-4 text-[#4a5568] dark:text-[#9ca3af]">
              <li>
                <span className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">📹 Weekly drops:</span> Classroom walk-throughs, train ride explainers, and festival POVs.
              </li>
              <li>
                <span className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">📝 Written letters:</span> Each video comes with context, sources, and journaling prompts.
              </li>
              <li>
                <span className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">💌 Ask facility:</span> Community prompts go to Tejas's inbox and spark upcoming episodes.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-[#cbd5e0] dark:border-[#4a5568] bg-[#f7fafc] dark:bg-[#1f1f1f] p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">Build future series</p>
            <h3 className="mt-4 text-2xl font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Ready for any blog Tejas launches next</h3>
            <p className="mt-3 text-[#4a5568] dark:text-[#9ca3af]">
              Duplicate the Letters layout, change colors, and plug in a new channel name. Routing, markdown posts, comments, and Ask already work network-wide.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">
              <div className="rounded-lg bg-white dark:bg-[#252525] p-4 border border-[#e2e8f0] dark:border-[#4a5568]">
                <p className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Shared CMS</p>
                <p>Markdown posts per series.</p>
              </div>
              <div className="rounded-lg bg-white dark:bg-[#252525] p-4 border border-[#e2e8f0] dark:border-[#4a5568]">
                <p className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Custom palette</p>
                <p>Swap Tailwind tokens fast.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
