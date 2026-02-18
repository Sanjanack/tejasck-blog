import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'

const REACTION_TYPES = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'] as const

async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  let userId = cookieStore.get('user_id')?.value

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookieStore.set('user_id', userId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }

  return userId
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { type } = body

    if (!type || !REACTION_TYPES.includes(type)) {
      return NextResponse.json({ ok: false, error: 'Invalid reaction type' }, { status: 400 })
    }

    const userId = await getUserId()
    const commentId = params.id

    // Check if reaction exists
    const existing = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    if (existing) {
      if (existing.type === type) {
        // Remove reaction if same type clicked
        await prisma.commentReaction.delete({
          where: { id: existing.id },
        })
      } else {
        // Update reaction type
        await prisma.commentReaction.update({
          where: { id: existing.id },
          data: { type },
        })
      }
    } else {
      // Create new reaction
      await prisma.commentReaction.create({
        data: {
          commentId,
          userId,
          type,
        },
      })
    }

    // Get updated reaction counts
    const reactions = await prisma.commentReaction.groupBy({
      by: ['type'],
      where: { commentId },
      _count: true,
    })

    const reactionCounts = reactions.reduce((acc, r) => {
      acc[r.type] = r._count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({ ok: true, reactions: reactionCounts })
  } catch (error) {
    console.error('Error toggling reaction:', error)
    return NextResponse.json({ ok: false, error: 'Failed to toggle reaction' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const commentId = params.id

    const reactions = await prisma.commentReaction.groupBy({
      by: ['type'],
      where: { commentId },
      _count: true,
    })

    const userReaction = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    const reactionCounts = reactions.reduce((acc, r) => {
      acc[r.type] = r._count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      ok: true,
      reactions: reactionCounts,
      userReaction: userReaction?.type || null,
    })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch reactions' }, { status: 500 })
  }
}
