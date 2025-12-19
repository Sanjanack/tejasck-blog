import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'

// Get user identifier (IP address or session)
async function getUserId(): Promise<string> {
  // In production, use proper user authentication
  // For now, use IP address as identifier
  const cookieStore = await cookies()
  let userId = cookieStore.get('user_id')?.value

  if (!userId) {
    // Generate a simple user ID based on IP (in production, use proper auth)
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookieStore.set('user_id', userId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  return userId
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId()
    const postSlug = params.slug

    // Check if like already exists
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postSlug: {
          userId,
          postSlug,
        },
      },
    })

    if (existingLike) {
      // Unlike: delete the like
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      })

      const count = await prisma.postLike.count({
        where: { postSlug },
      })

      return NextResponse.json({ ok: true, liked: false, count })
    } else {
      // Like: create new like
      await prisma.postLike.create({
        data: {
          userId,
          postSlug,
        },
      })

      const count = await prisma.postLike.count({
        where: { postSlug },
      })

      return NextResponse.json({ ok: true, liked: true, count })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ ok: false, error: 'Failed to toggle like' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId()
    const postSlug = params.slug

    const isLiked = await prisma.postLike.findUnique({
      where: {
        userId_postSlug: {
          userId,
          postSlug,
        },
      },
    })

    const count = await prisma.postLike.count({
      where: { postSlug },
    })

    return NextResponse.json({
      ok: true,
      liked: !!isLiked,
      count,
    })
  } catch (error) {
    console.error('Error fetching like status:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch like status' }, { status: 500 })
  }
}

