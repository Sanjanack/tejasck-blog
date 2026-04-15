import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/app/lib/prisma'
import { normalizeSlug, writePostFile } from '@/app/lib/postFiles'

export const runtime = 'nodejs'

const FrontmatterSchema = z.object({
  title: z.string().default('Untitled'),
  date: z.string().min(4).default(new Date().toISOString().slice(0, 10)),
  excerpt: z.string().default(''),
  tags: z.array(z.string()).optional().default([]),
  series: z.string().default('From Filter Coffee to German Bread'),
  coverImage: z.string().url().optional(),
  coverImageAlt: z.string().optional(),
})

const CreateSchema = z.object({
  slug: z.string().min(1),
  frontmatter: FrontmatterSchema,
  content: z.string().default(''),
})

export async function POST(request: Request) {
  const authenticated = await isAuthenticated()
  if (!authenticated) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = CreateSchema.parse(body)
    const slug = normalizeSlug(parsed.slug)

    const date = new Date(parsed.frontmatter.date || new Date().toISOString().slice(0, 10))
    const excerpt =
      parsed.frontmatter.excerpt ||
      (parsed.content || '').substring(0, 150) + ((parsed.content || '').length > 150 ? '...' : '')

    await prisma.post.create({
      data: {
        slug,
        title: parsed.frontmatter.title || 'Untitled',
        date,
        excerpt,
        content: parsed.content || '',
        tags: parsed.frontmatter.tags || [],
        series: parsed.frontmatter.series || 'From Filter Coffee to German Bread',
        coverImage: parsed.frontmatter.coverImage || null,
        coverImageAlt: parsed.frontmatter.coverImageAlt || null,
      },
    })

    // Keep filesystem markdown in sync locally (best effort; fails on Vercel readonly FS)
    try {
      await writePostFile(
        slug,
        {
          title: parsed.frontmatter.title || 'Untitled',
          date: parsed.frontmatter.date || new Date().toISOString().slice(0, 10),
          excerpt,
          tags: parsed.frontmatter.tags || [],
          series: parsed.frontmatter.series || 'From Filter Coffee to German Bread',
          coverImage: parsed.frontmatter.coverImage || undefined,
          coverImageAlt: parsed.frontmatter.coverImageAlt || undefined,
        },
        parsed.content || ''
      )
    } catch {
      // ignore FS sync errors in environments with readonly filesystem
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/admin/posts')
    revalidatePath('/cms-x8k2/posts')

    return NextResponse.json({ ok: true, slug })
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || error?.message || 'Failed to create post'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}

