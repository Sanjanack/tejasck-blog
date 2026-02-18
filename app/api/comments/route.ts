import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateComment(body: any) {
  const errors: Record<string, string[]> = {}
  const result: { postSlug: string; name: string; email?: string; message: string; parentId?: string } = {
    postSlug: String(body?.postSlug || '').trim(),
    name: String(body?.name || '').trim(),
    email: String(body?.email || '').trim(),
    message: String(body?.message || '').trim(),
    parentId: body?.parentId ? String(body.parentId).trim() : undefined,
  }

  if (!result.postSlug || result.postSlug.length > 100) {
    errors.postSlug = ['Post slug is required and must be <= 100 chars']
  }
  if (!result.name || result.name.length > 100) {
    errors.name = ['Name is required and must be <= 100 chars']
  }
  if (result.email && !isValidEmail(result.email)) {
    errors.email = ['Invalid email']
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
        approved: true,
        parentId: null // Only top-level comments
      },
      include: {
        replies: {
          where: { approved: true },
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

    const { postSlug, name, email, message, parentId } = parsed.data

    const comment = await prisma.comment.create({
      data: {
        postSlug,
        name,
        email: email || null,
        message,
        parentId: parentId || null,
        approved: false, // Comments need approval
      }
    })

    // Send email notification to admin
    if (process.env.RESEND_API_KEY && process.env.ASK_RECIPIENT_1) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
      const postUrl = `${siteUrl}/blog/${postSlug}`
      
      try {
        await resend?.emails.send({
          from: 'Comments Bot <noreply@yourdomain.dev>',
          to: [process.env.ASK_RECIPIENT_1],
          subject: `New comment on: ${postSlug}`,
          html: `
            <h2>New Comment Awaiting Approval</h2>
            <p><strong>Post:</strong> <a href="${postUrl}">${postSlug}</a></p>
            <p><strong>Name:</strong> ${name}</p>
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><a href="${siteUrl}/admin/comments">Approve or delete this comment</a></p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send comment notification email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ ok: true, comment })
  } catch (error) {
    console.error('Error creating comment', error)
    return NextResponse.json({ ok: false, error: 'Failed to create comment' }, { status: 500 })
  }
}
