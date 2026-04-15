'use client'

import { useEffect, useMemo, useState } from 'react'
import { IconDocument, IconGlobe } from '../components/Icons'

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=70',
    alt: 'Schmalkalden town square',
    caption: 'The charming cobblestone streets of Schmalkalden',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70',
    alt: 'German architecture',
    caption: 'Historic half-timbered houses lining the streets',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=70',
    alt: 'University campus',
    caption: 'The beautiful university campus nestled in nature',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=70',
    alt: 'Mountain view',
    caption: 'Stunning views from the surrounding hills',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70',
    alt: 'Local cafe',
    caption: 'Cozy cafes perfect for studying and relaxing',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=70',
    alt: 'Evening lights',
    caption: 'Evening atmosphere in the town center',
  },
]

export default function GalleryPage() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<number | null>(null)

  const filteredImages = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return galleryImages

    return galleryImages.filter((img) => {
      const haystack = `${img.caption} ${img.alt}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  const activeImage = useMemo(() => {
    if (activeId == null) return null
    return galleryImages.find((img) => img.id === activeId) || null
  }, [activeId])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const aspectClasses = ['aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/10]'] as const

  return (
    <div className="relative min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b8e6b]/5 blur-3xl dark:bg-[#7a9a7a]/5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5b7c99]/5 blur-3xl dark:bg-[#6b8e9f]/5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e0] bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b7c99] dark:border-[#4a5568] dark:bg-[#252525]/80 dark:text-[#9ca3af] mb-6">
            <IconGlobe className="w-4 h-4" />
            Visual Journey
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
            <span className="bg-gradient-to-r from-[#2d3748] to-[#6b8e6b] dark:from-[#e5e7eb] dark:to-[#7a9a7a] bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4a5568] dark:text-[#9ca3af] max-w-2xl mx-auto">
            Moments captured from my journey in Schmalkalden
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <label className="sr-only" htmlFor="gallery-search">
            Search images
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] dark:text-[#9ca3af] inline-flex">
              <IconDocument className="w-4 h-4" />
            </span>
            <input
              id="gallery-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search photos by subject (caption or description)"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
            />
          </div>
        </div>

        {/* Masonry Grid (Pinterest-like) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 animate-fade-in">
          {filteredImages.map((image, index) => {
            const aspect = aspectClasses[index % aspectClasses.length]
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveId(image.id)}
                className="w-full text-left mb-6 break-inside-avoid group"
                aria-label={`Open image: ${image.caption}`}
              >
                <div
                  className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <div className={`relative overflow-hidden ${aspect}`}>
                    <img
                      src={image.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filteredImages.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-[#718096] dark:text-[#9ca3af]">No photos match your search.</p>
          </div>
        )}

        {/* Note */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
            More photos coming soon as I explore more of this beautiful place.
          </p>
        </div>
      </div>

      {/* Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative w-full aspect-[16/10] bg-black/5 dark:bg-white/5">
              <img
                src={activeImage.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#718096] dark:text-[#9ca3af] mb-2">Description</p>
                  <p className="text-[#2d3748] dark:text-[#e5e7eb] leading-relaxed">{activeImage.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="shrink-0 px-3 py-2 rounded-lg bg-[#e2e8f0] dark:bg-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] hover:bg-[#cbd5e0] dark:hover:bg-[#2d3748]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
