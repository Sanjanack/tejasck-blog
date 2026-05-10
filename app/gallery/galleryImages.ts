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
    src: '/gallery/brother-sunset-1.jpeg',
    alt: 'Frosty field at sunrise in Schmalkalden',
    caption: 'Cold morning light over a football ground in Schmalkalden'
  },
  {
    id: 2,
    src: '/gallery/brother-lake.jpeg',
    alt: 'Abandoned lake',
    caption: 'An abandoned lake caught in beauty!',
  },
  {
    id: 3,
    src: '/gallery/brother-cityscape.jpeg',
    alt: 'Cityscape',
    caption: 'Schmalkalden Cityscape viewed after a trek',
  },
  {
    id: 4,
    src: '/galllery/brother-naturalsilhoute.jpeg',
    alt: 'Natural Silhoute',
    caption: 'Stunning natural silhoute amongst natural sky gradient',
  },
  {
    id: 5,
    src: '/gallery/randomroad.jpeg',
    alt: 'Radom Road Stroll',
    caption: 'Random Road during a radom stroll across the city',
  },
  {
    id: 6,
    src: '/gallery/housearchitecture.jpeg',
    alt: 'House Architecture',
    caption: 'Germany and its house architecture',
  },
]

