import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { listGalleryImagesAdmin } from '@/app/lib/gallery'
import { isValidImagePath, normalizeImageSrc } from '@/app/lib/imagePaths'

export async function GET() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const images = await listGalleryImagesAdmin()
    return NextResponse.json({ ok: true, images })
  } catch (e) {
    console.error('Gallery GET:', e)
    return NextResponse.json({ ok: false, error: 'Failed to load gallery' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const rawSrc = typeof body.src === 'string' ? body.src.trim() : ''
    const src = normalizeImageSrc(rawSrc)
    if (!src || !isValidImagePath(src)) {
      return NextResponse.json({ ok: false, error: 'Invalid image URL' }, { status: 400 })
    }
    const alt = typeof body.alt === 'string' ? body.alt : ''
    const caption = typeof body.caption === 'string' ? body.caption : ''
    const maxAgg = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } })
    const sortOrder = (maxAgg._max.sortOrder ?? -1) + 1
    await prisma.galleryImage.create({
      data: { src, alt, caption, sortOrder },
    })
    revalidatePath('/gallery')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Gallery POST:', e)
    return NextResponse.json({ ok: false, error: 'Failed to add image' }, { status: 500 })
  }
}
