export type GalleryImage = {
  id: number
  src: string
  alt: string
  caption: string
}

// Add your own gallery images here.
// Recommended local path: /gallery/<filename> (put files inside public/gallery).
export const galleryImages: GalleryImage[] = [
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

