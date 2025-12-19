export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#1a1a1a] border-t border-[#e2e8f0] dark:border-[#4a5568] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-lg flex items-center justify-center text-xl shadow-sm">
              ✦
            </div>
            <div>
              <span className="block text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Tejas CK Studio</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">Letters from Schmalkalden</span>
            </div>
          </div>
          <p className="text-sm text-[#4a5568] dark:text-[#9ca3af]">
            © {currentYear} · Built as a shared home for every Tejas CK blog and vlog.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[#718096] dark:text-[#9ca3af]">
            <a 
              href="/feed.xml" 
              className="hover:text-[#6b8e6b] dark:hover:text-[#7a9a7a] transition-colors flex items-center gap-1"
              title="RSS Feed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.109-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
              </svg>
              RSS Feed
            </a>
            <span>·</span>
            <span className="uppercase tracking-[0.3em]">Document · Publish · Reply</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
