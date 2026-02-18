'use client'

import { useEffect, useState } from 'react'

const countries = ['IN', 'DE'] // India and Germany

export default function AnimatedGlobe() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % countries.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Animated circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-[#6b8e6b]/20 dark:border-[#7a9a7a]/20 animate-ping" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full border-2 border-[#6b8e6b]/30 dark:border-[#7a9a7a]/30" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-[#6b8e6b]/40 dark:border-[#7a9a7a]/40" />
      </div>
      
      {/* Country badges */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-3">
          {countries.map((country, index) => (
            <div
              key={country}
              className={`w-14 h-14 rounded-full bg-white dark:bg-[#252525] border-2 flex items-center justify-center text-sm font-bold text-[#4a5568] dark:text-[#e5e7eb] shadow-xl transition-all duration-700 ${
                index === activeIndex
                  ? 'scale-125 border-[#6b8e6b] dark:border-[#7a9a7a] z-10 ring-4 ring-[#6b8e6b]/20 dark:ring-[#7a9a7a]/20'
                  : 'border-[#e2e8f0] dark:border-[#4a5568] scale-100'
              }`}
            >
              {country}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

