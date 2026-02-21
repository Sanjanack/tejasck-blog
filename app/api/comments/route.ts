import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

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
  if (!result.message || result.message.length < 5 || result.message.length > 1000) {
    errors.message = ['Message must be between 5 and 1000 chars']
  }

  return { ok: Object.keys(errors).length === 0, data: result, errors }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('postSlug')
    
    if (!postSlug) {
      return NextResponse.json({ ok: false, error: 'Post slug required' }, { status: 400 })
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

    return NextResponse.json({ ok: true, comments: transformComments(comments) })
  } catch (error) {
    console.error('Error fetching comments', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = validateComment(body)
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 })
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

    return NextResponse.json({ ok: true, comment })
  } catch (error) {
    console.error('Error creating comment', error)
    return NextResponse.json({ ok: false, error: 'Failed to create comment' }, { status: 500 })
  }
}
