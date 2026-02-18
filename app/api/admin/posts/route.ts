import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/app/lib/auth'
import { normalizeSlug, writePostFile } from '@/app/lib/postFiles'
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

const CreateSchema = z.object({
  slug: z.string().min(1),
  frontmatter: FrontmatterSchema,
  content: z.string().default(''),
})

export async function POST(request: Request) {
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
    const parsed = CreateSchema.parse(body)
    const slug = normalizeSlug(parsed.slug)

    await writePostFile(slug, parsed.frontmatter, parsed.content)

    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/admin/posts')

    return NextResponse.json({ ok: true, slug })
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || error?.message || 'Failed to create post'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}

