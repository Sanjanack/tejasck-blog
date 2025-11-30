import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { isAuthenticated } from '@/app/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.comment.delete({
      where: { id: params.id }
    })

    return NextResponse.redirect(new URL('/admin/comments', request.url))
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}


