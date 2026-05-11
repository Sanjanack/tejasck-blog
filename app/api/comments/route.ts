import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { applyBasicCors, getClientIp, rateLimit } from '@/app/lib/security'

function validateComment(body: any) {
  const errors: Record<string, string[]> = {}
  const result: { postSlug: string; name: string; message: string; parentId?: string } = {
    postSlug: String(body?.postSlug || '').trim(),
    name: String(body?.name || '').trim(),
    message: String(body?.message || '').trim(),
    parentId: body?.parentId ? String(body.parentId).trim() : undefined,
  }

  if (!result.postSlug || result.postSlug.length > 100) {
    errors.postSlug = ['Post slug is required and must be <= 100 chars']
  }
  if (!result.name || result.name.length > 100) {
    errors.name = ['Name is required and must be <= 100 chars']
  }
  if (!result.message) {
    errors.message = ['Message is required']
  }

  return { ok: Object.keys(errors).length === 0, data: result, errors }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')
    
    if (!postSlug) {
      return applyBasicCors(NextResponse.json({ ok: false, error: 'Post slug required' }, { status: 400 }), request)
    }

    const comments = await prisma.comment.findMany({
      where: { 
        postSlug,
        parentId: null // Only top-level comments
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            reactions: true,
          },
        },
        reactions: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform reactions to counts per type
    const transformComments = (comments: any[]): any[] => {
      return comments.map((comment) => {
        const reactionCounts: Record<string, number> = {}
        comment.reactions?.forEach((r: any) => {
          reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1
        })
        
        return {
          ...comment,
          reactions: reactionCounts,
          replies: comment.replies ? transformComments(comment.replies) : [],
        }
      })
    }

    return applyBasicCors(NextResponse.json({ ok: true, comments: transformComments(comments) }), request)
  } catch (error) {
    console.error('Error fetching comments', error)
    return applyBasicCors(NextResponse.json({ ok: false, error: 'Failed to fetch comments' }, { status: 500 }), request)
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = rateLimit(`comments:${ip}`, { windowMs: 60_000, max: 12 })
    if (!rl.ok) {
      const res = NextResponse.json({ ok: false, error: 'Too many comments. Please slow down.' }, { status: 429 })
      res.headers.set('Retry-After', String(Math.ceil(rl.retryAfterMs / 1000)))
      return applyBasicCors(res, request)
    }

    const body = await request.json()
    const parsed = validateComment(body)
    if (!parsed.ok) {
      return applyBasicCors(NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 }), request)
    }

    const { postSlug, name, message, parentId } = parsed.data

    const comment = await prisma.comment.create({
      data: {
        postSlug,
        name,
        message,
        parentId: parentId || null,
      }
    })

    return applyBasicCors(NextResponse.json({ ok: true, comment }), request)
  } catch (error) {
    console.error('Error creating comment', error)
    return applyBasicCors(NextResponse.json({ ok: false, error: 'Failed to create comment' }, { status: 500 }), request)
  }
}

export async function OPTIONS(request: Request) {
  return applyBasicCors(new NextResponse(null, { status: 204 }), request)
}
