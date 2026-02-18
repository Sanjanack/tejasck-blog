import Image from 'next/image'

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    alt: 'Schmalkalden town square',
    caption: 'The charming cobblestone streets of Schmalkalden',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt: 'German architecture',
    caption: 'Historic half-timbered houses lining the streets',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
    alt: 'University campus',
    caption: 'The beautiful university campus nestled in nature',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    alt: 'Mountain view',
    caption: 'Stunning views from the surrounding hills',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt: 'Local cafe',
    caption: 'Cozy cafes perfect for studying and relaxing',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    alt: 'Evening lights',
    caption: 'Evening atmosphere in the town center',
  },
]

export default function GalleryPage() {
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="group bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-[#4a5568] dark:text-[#9ca3af] leading-relaxed">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-[#718096] dark:text-[#9ca3af]">
            More photos coming soon as I explore more of this beautiful place.
          </p>
        </div>
      </div>
    </div>
  )
}
