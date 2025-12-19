import Link from 'next/link'
import { getAllPosts } from './lib/posts'
import FloatingCard from './components/FloatingCard'
import AnimatedGlobe from './components/AnimatedGlobe'
import InteractiveCounter from './components/InteractiveCounter'

const futureSeries = [
  {
    title: 'Letters from Schmalkalden',
    status: 'Live Now',
    description: 'Study-vlog diary from Germany',
    accent: '#6b8e6b',
    href: '/blog',
    icon: '✉️',
  },
  {
    title: 'Tejas C K Bytes',
    status: 'Coming Soon',
    description: 'Tech lessons distilled',
    accent: '#6b8e6b',
    locked: true,
    icon: '💻',
  },
]

export default function Home() {
  const posts = getAllPosts()
  const totalPosts = posts.length

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf9f7] dark:bg-[#1a1a1a]">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6b8e6b]/10 blur-3xl dark:bg-[#7a9a7a]/10 animate-pulse" />
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-[#5b7c99]/8 blur-3xl dark:bg-[#6b8e9f]/10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#6b8e6b]/8 blur-3xl dark:bg-[#7a9a7a]/8 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero Section */}
        <header className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e0] bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b7c99] dark:border-[#4a5568] dark:bg-[#252525]/80 dark:text-[#9ca3af] animate-fade-in">
            Tejas C K Studio
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] leading-tight animate-slide-up">
            Stories from
            <span className="block mt-2 bg-gradient-to-r from-[#6b8e6b] to-[#5b7c99] bg-clip-text text-transparent">
              Schmalkalden
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-[#4a5568] dark:text-[#9ca3af] max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A study-abroad diary from Germany
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link 
              href="/blog" 
              className="group relative px-8 py-4 rounded-xl bg-[#6b8e6b] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Read Letters</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#5a7a5a] to-[#6b8e6b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link 
              href="/ask" 
              className="px-8 py-4 rounded-xl border-2 border-[#6b8e6b] text-[#6b8e6b] dark:text-[#7a9a7a] font-semibold hover:bg-[#6b8e6b]/10 dark:hover:bg-[#7a9a7a]/10 transition-all duration-300 hover:scale-105"
            >
              Ask a Question
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#6b8e6b] dark:text-[#7a9a7a]">
                <InteractiveCounter end={totalPosts} />
              </div>
              <div className="text-sm text-[#718096] dark:text-[#9ca3af] mt-1">Letters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#6b8e6b] dark:text-[#7a9a7a]">
                <InteractiveCounter end={2} />
              </div>
              <div className="text-sm text-[#718096] dark:text-[#9ca3af] mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#6b8e6b] dark:text-[#7a9a7a]">
                <InteractiveCounter end={50} suffix="+" />
              </div>
              <div className="text-sm text-[#718096] dark:text-[#9ca3af] mt-1">Readers</div>
            </div>
          </div>
        </header>

        {/* Interactive Globe */}
        <div className="mb-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <AnimatedGlobe />
        </div>

        {/* Series Cards */}
        <section className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-20">
          {futureSeries.map((series, index) => (
            <FloatingCard key={series.title} delay={index * 100}>
              <Link
                href={series.href || '#'}
                className={`group block rounded-2xl border-2 border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  series.locked ? 'opacity-60 cursor-not-allowed' : 'hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a]'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{series.icon}</div>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                    series.status === 'Live Now' 
                      ? 'bg-[#f0f4f0] text-[#5a7a5a] dark:bg-[#2d3a2d] dark:text-[#7a9a7a]'
                      : 'bg-[#f7fafc] text-[#718096] dark:bg-[#1f1f1f] dark:text-[#9ca3af]'
                  }`}>
                    {series.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">
                  {series.title}
                </h3>
                <p className="text-[#4a5568] dark:text-[#9ca3af]">
                  {series.description}
                </p>
                {!series.locked && (
                  <div className="mt-6 flex items-center gap-2 text-[#6b8e6b] dark:text-[#7a9a7a] font-medium">
                    <span>Explore</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </Link>
            </FloatingCard>
          ))}
        </section>

        {/* Quick Links */}
        <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
            New letters every Sunday
          </p>
          <Link 
            href="/about" 
            className="inline-block text-sm text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline"
          >
            Learn more about the creator →
          </Link>
        </div>
      </div>
    </div>
  )
}
