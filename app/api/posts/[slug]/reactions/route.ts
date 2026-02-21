import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { cookies } from 'next/headers'

const REACTION_TYPES = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'] as const
type ReactionType = (typeof REACTION_TYPES)[number]

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

function normalizeDisplayName(raw: unknown): string | null {
  const name = String(raw ?? '').trim()
  if (!name) return null
  if (name.length > 40) return name.slice(0, 40)
  return name
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId()
    const postSlug = params.slug
    const { searchParams } = new URL(request.url)
    const includeNames = searchParams.get('includeNames') === '1'

    const [grouped, mine] = await Promise.all([
      prisma.postReaction.groupBy({
        by: ['type'],
        where: { postSlug },
        _count: true,
      }),
      prisma.postReaction.findUnique({
        where: { userId_postSlug: { userId, postSlug } },
      }),
    ])

    const counts = grouped.reduce((acc, r) => {
      acc[r.type] = r._count
      return acc
    }, {} as Record<string, number>)

    let namesByType: Record<string, string[]> | undefined
    if (includeNames) {
      const rows = await prisma.postReaction.findMany({
        where: {
          postSlug,
          anonymous: false,
          displayName: { not: null },
        },
        select: { type: true, displayName: true },
        orderBy: { updatedAt: 'desc' },
        take: 200,
      })

      const map: Record<string, string[]> = {}
      for (const row of rows) {
        const t = row.type
        const n = row.displayName
        if (!n) continue
        if (!map[t]) map[t] = []
        if (map[t].length >= 10) continue
        if (!map[t].includes(n)) map[t].push(n)
      }
      namesByType = map
    }

    return NextResponse.json({
      ok: true,
      counts,
      myReaction: mine
        ? {
            type: mine.type,
            anonymous: mine.anonymous,
            displayName: mine.displayName,
          }
        : null,
      namesByType: namesByType ?? null,
    })
  } catch (error) {
    console.error('Error fetching post reactions:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await getUserId()
    const postSlug = params.slug
    const body = await request.json()

    const type = String(body?.type || '').trim() as ReactionType
    const intent = String(body?.intent || 'toggle').trim() as 'toggle' | 'set'
    const anonymous = body?.anonymous === false ? false : true
    const displayName = normalizeDisplayName(body?.displayName)

    if (!REACTION_TYPES.includes(type)) {
      return NextResponse.json({ ok: false, error: 'Invalid reaction type' }, { status: 400 })
    }

    const existing = await prisma.postReaction.findUnique({
      where: { userId_postSlug: { userId, postSlug } },
    })

    if (intent === 'set') {
      if (!existing) {
        return NextResponse.json({ ok: false, error: 'No reaction to update yet' }, { status: 400 })
      }

      await prisma.postReaction.update({
        where: { id: existing.id },
        data: {
          type,
          anonymous,
          displayName: anonymous ? null : displayName,
        },
      })
    } else {
      // intent === 'toggle'
      if (existing && existing.type === type) {
        await prisma.postReaction.delete({ where: { id: existing.id } })
      } else if (existing) {
        await prisma.postReaction.update({
          where: { id: existing.id },
          data: {
            type,
            anonymous,
            displayName: anonymous ? null : displayName,
          },
        })
      } else {
        await prisma.postReaction.create({
          data: {
            userId,
            postSlug,
            type,
            anonymous,
            displayName: anonymous ? null : displayName,
          },
        })
      }
    }

    const grouped = await prisma.postReaction.groupBy({
      by: ['type'],
      where: { postSlug },
      _count: true,
    })
    const counts = grouped.reduce((acc, r) => {
      acc[r.type] = r._count
      return acc
    }, {} as Record<string, number>)

    const mine = await prisma.postReaction.findUnique({
      where: { userId_postSlug: { userId, postSlug } },
    })

    return NextResponse.json({
      ok: true,
      counts,
      myReaction: mine
        ? { type: mine.type, anonymous: mine.anonymous, displayName: mine.displayName }
        : null,
    })
  } catch (error) {
    console.error('Error toggling post reaction:', error)
    return NextResponse.json({ ok: false, error: 'Failed to update reaction' }, { status: 500 })
  }
}

