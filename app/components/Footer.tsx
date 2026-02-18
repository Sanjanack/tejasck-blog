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
              <span className="block text-lg font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Tejas C.K Studio</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">Letters from Schmalkalden</span>
            </div>
          </div>
          <p className="text-sm text-[#4a5568] dark:text-[#9ca3af]">
            © {currentYear} · Built as a shared home for every Tejas C.K blog.
          </p>
        </div>
      </div>
    </footer>
  )
}
