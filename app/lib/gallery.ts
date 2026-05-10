import { prisma } from '@/app/lib/prisma'
import { galleryImages as staticGalleryImages } from '@/app/gallery/galleryImages'

export type GalleryImagePublic = {
  id: string
  src: string
  alt: string
  caption: string
}

export type GalleryImageDTO = GalleryImagePublic & {
  sortOrder: number
}

async function seedFromStaticIfEmpty(): Promise<void> {
  const count = await prisma.galleryImage.count()
  if (count > 0) return
  await prisma.galleryImage.createMany({
    data: staticGalleryImages.map((img, i) => ({
      src: img.src,
      alt: img.alt,
      caption: img.caption,
      sortOrder: i,
    })),
  })
}

function mapRowsPublic(
  rows: { id: string; src: string; alt: string; caption: string }[]
): GalleryImagePublic[] {
  return rows.map((r) => ({
    id: r.id,
    src: r.src,
    alt: r.alt,
    caption: r.caption,
  }))
}

function mapRowsAdmin(
  rows: { id: string; src: string; alt: string; caption: string; sortOrder: number }[]
): GalleryImageDTO[] {
  return rows.map((r) => ({
    id: r.id,
    src: r.src,
    alt: r.alt,
    caption: r.caption,
    sortOrder: r.sortOrder,
  }))
}

function staticFallback(): GalleryImagePublic[] {
  return staticGalleryImages.map((img) => ({
    id: `legacy-${img.id}`,
    src: img.src,
    alt: img.alt,
    caption: img.caption,
  }))
}

/** CMS: load gallery rows from DB (seeds from static list once when empty). */
export async function listGalleryImagesAdmin(): Promise<GalleryImageDTO[]> {
  await seedFromStaticIfEmpty()
  const rows = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return mapRowsAdmin(rows)
}

/** Ordered gallery images for the public page; seeds from static list once when the table is empty. */
export async function getGalleryImages(): Promise<GalleryImagePublic[]> {
  try {
    await seedFromStaticIfEmpty()
    const rows = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return mapRowsPublic(rows)
  } catch (e) {
    console.error('[gallery] DB unavailable, using static list:', e)
    return staticFallback()
  }
}
