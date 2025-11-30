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
    await prisma.comment.update({
      where: { id: params.id },
      data: { approved: true }
    })

    return NextResponse.redirect(new URL('/admin/comments', request.url))
  } catch (error) {
    console.error('Error approving comment:', error)
    return NextResponse.json({ error: 'Failed to approve comment' }, { status: 500 })
  }
}


