import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import { isValidImagePath, normalizeImageSrc } from '@/app/lib/imagePaths'
import { prisma } from '@/app/lib/prisma'
import { deletePostFile, writePostFile } from '@/app/lib/postFiles'

export const runtime = 'nodejs'

const FrontmatterSchema = z.object({
  title: z.string().default('Untitled'),
  date: z.string().min(4).default(new Date().toISOString().slice(0, 10)),
  excerpt: z.string().default(''),
  tags: z.array(z.string()).optional().default([]),
  series: z.string().default('From Filter Coffee to German Bread'),
  coverImage: z.string().optional().refine((value) => isValidImagePath(value), 'Cover image must be an absolute URL or start with /'),
  coverImageAlt: z.string().optional(),
})

const UpdateSchema = z.object({
  frontmatter: FrontmatterSchema,
  content: z.string().default(''),
})

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    post: {
      slug: post.slug,
      frontmatter: {
        title: post.title,
        date: post.date.toISOString().slice(0, 10),
        excerpt: post.excerpt,
        tags: post.tags ?? [],
        series: post.series,
        coverImage: post.coverImage ?? undefined,
        coverImageAlt: post.coverImageAlt ?? undefined,
      },
      content: post.content,
    },
  })
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = UpdateSchema.parse(body)
    const coverImage = normalizeImageSrc(parsed.frontmatter.coverImage)

    const date = new Date(parsed.frontmatter.date || new Date().toISOString().slice(0, 10))
    const excerpt =
      parsed.frontmatter.excerpt ||
      (parsed.content || '').substring(0, 150) + ((parsed.content || '').length > 150 ? '...' : '')

    await prisma.post.update({
      where: { slug: params.slug },
      data: {
        title: parsed.frontmatter.title || 'Untitled',
        date,
        excerpt,
        content: parsed.content || '',
        tags: parsed.frontmatter.tags || [],
        series: parsed.frontmatter.series || 'From Filter Coffee to German Bread',
        coverImage: coverImage || null,
        coverImageAlt: parsed.frontmatter.coverImageAlt || null,
      },
    })

    // Keep filesystem markdown in sync locally (best effort; fails on Vercel readonly FS)
    try {
      await writePostFile(
        params.slug,
        {
          title: parsed.frontmatter.title || 'Untitled',
          date: parsed.frontmatter.date || new Date().toISOString().slice(0, 10),
          excerpt,
          tags: parsed.frontmatter.tags || [],
          series: parsed.frontmatter.series || 'From Filter Coffee to German Bread',
          coverImage: coverImage || undefined,
          coverImageAlt: parsed.frontmatter.coverImageAlt || undefined,
        },
        parsed.content || ''
      )
    } catch {
      // ignore FS sync errors in environments with readonly filesystem
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${params.slug}`)
    revalidatePath('/admin/posts')
    revalidatePath('/cms-x8k2/posts')

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || error?.message || 'Failed to update post'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.post.delete({
      where: { slug: params.slug },
    })

    // Keep filesystem markdown in sync locally (best effort; fails on Vercel readonly FS)
    try {
      await deletePostFile(params.slug)
    } catch {
      // ignore FS sync errors in environments with readonly filesystem
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${params.slug}`)
    revalidatePath('/admin/posts')
    revalidatePath('/cms-x8k2/posts')
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to delete post' }, { status: 400 })
  }
}

