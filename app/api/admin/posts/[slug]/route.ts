import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/app/lib/auth'
import { deletePostFile, readPostFile, writePostFile } from '@/app/lib/postFiles'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

const FrontmatterSchema = z.object({
  title: z.string().default('Untitled'),
  date: z.string().min(4).default(new Date().toISOString().slice(0, 10)),
  excerpt: z.string().default(''),
  tags: z.array(z.string()).optional().default([]),
  series: z.string().default('Letters from Schmalkalden'),
  coverImage: z.string().url().optional(),
  coverImageAlt: z.string().optional(),
})

const UpdateSchema = z.object({
  frontmatter: FrontmatterSchema,
  content: z.string().default(''),
})

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const post = await readPostFile(params.slug)
    return NextResponse.json({ ok: true, post })
  } catch {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  if (process.env.VERCEL) {
    return NextResponse.json(
      { ok: false, error: 'Post editing is disabled on Vercel (filesystem is read-only / non-persistent). Edit markdown in git instead.' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const parsed = UpdateSchema.parse(body)

    await writePostFile(params.slug, parsed.frontmatter, parsed.content)

    revalidatePath('/blog')
    revalidatePath(`/blog/${params.slug}`)
    revalidatePath('/admin/posts')

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || error?.message || 'Failed to update post'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  if (process.env.VERCEL) {
    return NextResponse.json(
      { ok: false, error: 'Post deletion is disabled on Vercel (filesystem is read-only / non-persistent). Delete markdown in git instead.' },
      { status: 400 }
    )
  }

  try {
    await deletePostFile(params.slug)
    revalidatePath('/blog')
    revalidatePath(`/blog/${params.slug}`)
    revalidatePath('/admin/posts')
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to delete post' }, { status: 400 })
  }
}

