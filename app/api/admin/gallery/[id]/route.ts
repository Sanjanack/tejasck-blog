import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { isValidImagePath, normalizeImageSrc } from '@/app/lib/imagePaths'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const data: { src?: string; alt?: string; caption?: string; sortOrder?: number } = {}

    if (body.src !== undefined) {
      const src = normalizeImageSrc(String(body.src).trim())
      if (!src || !isValidImagePath(src)) {
        return NextResponse.json({ ok: false, error: 'Invalid image URL' }, { status: 400 })
      }
      data.src = src
    }
    if (body.alt !== undefined) data.alt = String(body.alt)
    if (body.caption !== undefined) data.caption = String(body.caption)
    if (body.sortOrder !== undefined) {
      const n = Number(body.sortOrder)
      if (!Number.isFinite(n)) {
        return NextResponse.json({ ok: false, error: 'Invalid sort order' }, { status: 400 })
      }
      data.sortOrder = Math.round(n)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 })
    }

    await prisma.galleryImage.update({
      where: { id: params.id },
      data,
    })
    revalidatePath('/gallery')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Gallery PUT:', e)
    return NextResponse.json({ ok: false, error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await prisma.galleryImage.delete({
      where: { id: params.id },
    })
    revalidatePath('/gallery')
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Gallery DELETE:', e)
    return NextResponse.json({ ok: false, error: 'Delete failed' }, { status: 500 })
  }
}
