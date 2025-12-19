import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        postSlug: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Group tags by name and count posts
    const tagMap = new Map<string, string[]>()
    tags.forEach((tag) => {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, [])
      }
      tagMap.get(tag.name)!.push(tag.postSlug)
    })

    const tagCounts = Array.from(tagMap.entries()).map(([name, postSlugs]) => ({
      name,
      count: postSlugs.length,
      postSlugs: Array.from(new Set(postSlugs)), // Unique post slugs
    }))

    return NextResponse.json({ ok: true, tags: tagCounts })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ ok: false, error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, postSlug } = await request.json()

    if (!name || !postSlug) {
      return NextResponse.json({ ok: false, error: 'Name and postSlug required' }, { status: 400 })
    }

    // Create or get tag
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
        postSlug,
      },
    })

    return NextResponse.json({ ok: true, tag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ ok: false, error: 'Failed to create tag' }, { status: 500 })
  }
}

