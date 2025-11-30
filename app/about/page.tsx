export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6">
            About Me
          </h1>
          <div className="w-32 h-1 bg-[#6b8e6b] dark:bg-[#7a9a7a] mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-10 mb-12 animate-slide-up shadow-sm">
            <div className="text-center mb-10">
              <div className="w-40 h-40 bg-[#f0f4f0] dark:bg-[#2d3a2d] rounded-full mx-auto mb-8 flex items-center justify-center text-6xl animate-bounce-gentle">
                🇩🇪
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
                Hello from Germany!
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] leading-relaxed mb-8">
                Hey there! I'm a student from India currently studying in Schmalkalden, Germany. 
                This blog is my way of capturing memories, sharing stories, and reflecting on 
                everything I learn along the way.
              </p>
              
              <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] leading-relaxed mb-8">
                Living in a new country has been an incredible journey filled with new experiences, 
                challenges, and discoveries. Through these posts, I hope to share not just what 
                I see and do, but also what I feel and learn as I navigate this beautiful chapter 
                of my life.
              </p>
              
              <p className="text-xl text-[#4a5568] dark:text-[#9ca3af] leading-relaxed">
                Whether it's the taste of authentic German bread, the beauty of European architecture, 
                or the warmth of new friendships, each day brings something special worth remembering. 
                Join me as I document this adventure, one story at a time.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6 flex items-center">
                <span className="mr-4 text-3xl">📍</span>
                Location
              </h3>
              <p className="text-[#4a5568] dark:text-[#9ca3af] text-lg leading-relaxed">
                Currently based in Schmalkalden, a charming town in Thuringia, Germany. 
                A perfect blend of history, nature, and modern student life.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 hover:border-[#6b8e6b] dark:hover:border-[#7a9a7a] transition-all duration-300 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6 flex items-center">
                <span className="mr-4 text-3xl">📚</span>
                Studies
              </h3>
              <p className="text-[#4a5568] dark:text-[#9ca3af] text-lg leading-relaxed">
                Pursuing my education while exploring the rich culture and traditions 
                that Germany has to offer. Every day is a learning experience.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 animate-fade-in">
            <p className="text-[#4a5568] dark:text-[#9ca3af] text-xl mb-8">
              Want to follow along on this journey?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/blog"
                className="btn-primary text-lg px-8 py-4"
              >
                Explore My Blog
              </a>
              <a
                href="/"
                className="btn-secondary text-lg px-8 py-4"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
