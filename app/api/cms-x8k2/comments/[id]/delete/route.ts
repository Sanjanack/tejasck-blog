import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'
import { CMS_PATH } from '@/app/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.comment.delete({
      where: { id: params.id },
    })

    const url = new URL(request.url)
    return NextResponse.redirect(new URL(`${CMS_PATH}/comments`, url.origin))
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
