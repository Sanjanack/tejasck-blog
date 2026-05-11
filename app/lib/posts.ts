import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { cache } from 'react'
import { prisma } from './prisma'
import { ORDERED_POST_SLUGS } from './postOrder'

const postsDirectory = path.join(process.cwd(), 'posts')
const SERIES_OLD = 'Letters from Schmalkalden'
const SERIES_NEW = 'From Filter Coffee to German Bread'
const maybeCache = process.env.NODE_ENV === 'production' ? cache : (<T extends (...args: any[]) => any>(fn: T) => fn)

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime: number
  tags?: string[]
  series?: string
  coverImage?: string
  coverImageAlt?: string
}

let seededFromFilesystem = false
let postTableStatus: 'unknown' | 'available' | 'missing' = 'unknown'
let didRenameSeries = false
let lastFilesystemSyncAt = 0
const fileSyncState = new Map<string, number>()

function sortPostsWithManualOrder(posts: Post[]): Post[] {
  const rank = new Map<string, number>()
  ORDERED_POST_SLUGS.forEach((slug, idx) => rank.set(slug, idx))

  return [...posts].sort((a, b) => {
    const aRank = rank.get(a.slug)
    const bRank = rank.get(b.slug)
    const aPinned = aRank !== undefined
    const bPinned = bRank !== undefined

    if (aPinned && bPinned) return (aRank as number) - (bRank as number)
    if (aPinned) return -1
    if (bPinned) return 1
    return a.date > b.date ? 1 : -1
  })
}

async function syncFilesystemToDatabaseInDevIfNeeded() {
  if (process.env.NODE_ENV === 'production') return
  if (postTableStatus !== 'available') return
  if (!fs.existsSync(postsDirectory)) return

  const now = Date.now()
  if (now - lastFilesystemSyncAt < 2000) return
  lastFilesystemSyncAt = now

  try {
    const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'))
    for (const fileName of fileNames) {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const stat = fs.statSync(fullPath)
      const lastMtime = fileSyncState.get(slug)
      if (lastMtime && lastMtime === stat.mtimeMs) {
        continue
      }
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const date =
        typeof data.date === 'string' && data.date
          ? new Date(data.date)
          : new Date()
      const excerpt =
        typeof data.excerpt === 'string' && data.excerpt
          ? data.excerpt
          : content.substring(0, 150) + (content.length > 150 ? '...' : '')
      const tagsRaw = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
      const tags = tagsRaw.map((t: any) => String(t).trim()).filter(Boolean)
      const seriesRaw = data.series ? String(data.series).trim() : SERIES_NEW
      const series = seriesRaw === SERIES_OLD ? SERIES_NEW : seriesRaw || SERIES_NEW

      await prisma.post.upsert({
        where: { slug },
        create: {
          slug,
          title: data.title || 'Untitled',
          date,
          excerpt,
          content,
          tags,
          series,
          coverImage: data.coverImage ? String(data.coverImage) : null,
          coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : null,
        },
        update: {
          title: data.title || 'Untitled',
          date,
          excerpt,
          content,
          tags,
          series,
          coverImage: data.coverImage ? String(data.coverImage) : null,
          coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : null,
        },
      })
      fileSyncState.set(slug, stat.mtimeMs)
    }

    // Remove DB posts if their markdown file was deleted (dev sync only)
    const currentSlugs = new Set(fileNames.map((fileName) => fileName.replace(/\.md$/, '')))
    const dbPosts = await prisma.post.findMany({ select: { slug: true } })
    const removedSlugs = dbPosts.map((p) => p.slug).filter((slug) => !currentSlugs.has(slug))
    if (removedSlugs.length > 0) {
      await prisma.post.deleteMany({
        where: { slug: { in: removedSlugs } },
      })
      removedSlugs.forEach((slug) => fileSyncState.delete(slug))
    }
  } catch (e) {
    console.error('Filesystem -> DB sync failed:', e)
  }
}

async function renameSeriesInDatabaseIfNeeded() {
  if (didRenameSeries) return
  didRenameSeries = true

  try {
    // Rename legacy/default series so all pages show the updated name.
    // If the series doesn't exist yet, updateMany is a no-op (count = 0).
    await prisma.post.updateMany({
      where: { series: SERIES_OLD },
      data: { series: SERIES_NEW },
    })
  } catch (e) {
    // Keep rendering even if rename fails (e.g. during partial migrations).
    console.error('Series rename failed:', e)
  }
}

async function seedPostsFromFilesystemIfNeeded() {
  if (seededFromFilesystem) return

  try {
    const count = await prisma.post.count()
    postTableStatus = 'available'

    if (count > 0) {
      await renameSeriesInDatabaseIfNeeded()
      seededFromFilesystem = true
      return
    }
  } catch (e: any) {
    // If migrations haven't been applied yet, `post` table may not exist.
    // Prisma error code P2021 = table does not exist.
    if (e?.code === 'P2021') {
      postTableStatus = 'missing'
      seededFromFilesystem = true
      return
    }

    // Unknown error: don't hard-crash the whole site
    console.error('Error checking Post table:', e)
    postTableStatus = 'unknown'
    seededFromFilesystem = true
    return
  }

  if (!fs.existsSync(postsDirectory)) {
    seededFromFilesystem = true
    return
  }

  const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'))
  if (fileNames.length === 0) {
    seededFromFilesystem = true
    return
  }

  const postsToSeed: {
    slug: string
    title: string
    date: Date
    excerpt: string
    content: string
    tags: string[]
    series: string
    coverImage?: string | null
    coverImageAlt?: string | null
  }[] = []

  for (const fileName of fileNames) {
    try {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const date =
        typeof data.date === 'string' && data.date
          ? new Date(data.date)
          : new Date()

      const excerpt =
        typeof data.excerpt === 'string' && data.excerpt
          ? data.excerpt
          : content.substring(0, 150) + (content.length > 150 ? '...' : '')

      const tagsRaw = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
      const tags = tagsRaw.map((t: any) => String(t).trim()).filter(Boolean)

      postsToSeed.push({
        slug,
        title: data.title || 'Untitled',
        date,
        excerpt,
        content,
        tags,
        series: (data.series || SERIES_NEW) === SERIES_OLD ? SERIES_NEW : data.series || SERIES_NEW,
        coverImage: data.coverImage ? String(data.coverImage) : null,
        coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : null,
      })
    } catch (e) {
      console.error('Error seeding post from file:', fileName, e)
    }
  }

  if (postsToSeed.length > 0) {
    await prisma.post.createMany({
      data: postsToSeed,
      skipDuplicates: true,
    })
  }

  seededFromFilesystem = true
}

function getAllPostsFromFilesystem(): Post[] {
  try {
    if (!fs.existsSync(postsDirectory)) return []
    const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'))

    const posts = fileNames
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        const wordCount = content.split(/\s+/).filter(Boolean).length
        const readingTime = Math.ceil(wordCount / 200)

        const tagsRaw = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
        const tags = tagsRaw.map((t: any) => String(t).trim()).filter(Boolean)

        return {
          slug,
          title: data.title ? String(data.title).trim() : 'Untitled',
          date: data.date ? String(data.date).trim() : new Date().toISOString(),
          excerpt: data.excerpt ? String(data.excerpt).trim() : content.substring(0, 150) + '...',
          content,
          readingTime,
          tags,
          series:
            String(data.series ? String(data.series).trim() : SERIES_NEW) === SERIES_OLD
              ? SERIES_NEW
              : data.series
                ? String(data.series).trim()
                : SERIES_NEW,
          coverImage: data.coverImage ? String(data.coverImage) : undefined,
          coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
        }
      })
    return sortPostsWithManualOrder(posts)
  } catch (e) {
    console.error('Error reading posts from filesystem:', e)
    return []
  }
}

function getPostBySlugFromFilesystem(slug: string): Post | null {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) return null

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const wordCount = content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.ceil(wordCount / 200)

    const tagsRaw = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
    const tags = tagsRaw.map((t: any) => String(t).trim()).filter(Boolean)

    return {
      slug,
      title: data.title ? String(data.title).trim() : 'Untitled',
      date: data.date ? String(data.date).trim() : new Date().toISOString(),
      excerpt: data.excerpt ? String(data.excerpt).trim() : content.substring(0, 150) + '...',
      content,
      readingTime,
      tags,
      series:
        String(data.series ? String(data.series).trim() : SERIES_NEW) === SERIES_OLD ? SERIES_NEW : data.series ? String(data.series).trim() : SERIES_NEW,
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
    }
  } catch (e) {
    console.error('Error reading post from filesystem:', e)
    return null
  }
}

// Cached version for better performance (DB-backed)
export const getAllPosts = maybeCache(async (): Promise<Post[]> => {
  await seedPostsFromFilesystemIfNeeded()

  if (postTableStatus === 'missing') {
    // Migrations not applied yet; keep the site working.
    return getAllPostsFromFilesystem()
  }

  await syncFilesystemToDatabaseInDevIfNeeded()

  let rows: any[]
  try {
    rows = await prisma.post.findMany({
      orderBy: { date: 'asc' },
    })
  } catch (e) {
    // If DB is sleeping/unreachable during build (or transient outage), keep the site working.
    console.error('Error loading posts from DB; falling back to filesystem:', e)
    return getAllPostsFromFilesystem()
  }

  const posts = rows.map((row) => {
    const content = row.content
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.ceil(wordCount / 200)

    return {
      slug: row.slug,
      title: row.title,
      date: row.date.toISOString(),
      excerpt: row.excerpt,
      content,
      readingTime,
      tags: row.tags ?? [],
      series: row.series === SERIES_OLD ? SERIES_NEW : row.series || SERIES_NEW,
      coverImage: row.coverImage || undefined,
      coverImageAlt: row.coverImageAlt || undefined,
    }
  })

  return sortPostsWithManualOrder(posts)
})

// Cached version for better performance (DB-backed)
export const getPostBySlug = maybeCache(async (slug: string): Promise<Post | null> => {
  await seedPostsFromFilesystemIfNeeded()

  if (postTableStatus === 'missing') {
    return getPostBySlugFromFilesystem(slug)
  }

  await syncFilesystemToDatabaseInDevIfNeeded()

  let row: any
  try {
    row = await prisma.post.findUnique({
      where: { slug },
    })
  } catch (e) {
    console.error('Error loading post from DB; falling back to filesystem:', e)
    return getPostBySlugFromFilesystem(slug)
  }

  if (!row) return null

  const content = row.content
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  return {
    slug: row.slug,
    title: row.title,
    date: row.date.toISOString(),
    excerpt: row.excerpt,
    content,
    readingTime,
    tags: row.tags ?? [],
    series: row.series === SERIES_OLD ? SERIES_NEW : row.series || SERIES_NEW,
    coverImage: row.coverImage || undefined,
    coverImageAlt: row.coverImageAlt || undefined,
  }
})

// Cache markdown processing results
const contentCache = new Map<string, string>()

export function headingToId(text: string): string {
  const base = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  return base || 'section'
}

export async function getPostContent(content: string): Promise<string> {
  // Use content hash as cache key
  const cacheKey = content.substring(0, 100) + content.length.toString()

  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!
  }

  const processedContent = await remark().use(remarkHtml).process(content)

  let html = processedContent.toString()

  // Inject ids into h2/h3 headings for anchored ToC
  const usedIds = new Set<string>()
  html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, inner) => {
    const plainText = inner.replace(/<[^>]+>/g, '').trim()
    let baseId = headingToId(plainText)
    if (!baseId) baseId = `section-${level}`
    let uniqueId = baseId
    let i = 2
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${i++}`
    }
    usedIds.add(uniqueId)
    return `<h${level} id="${uniqueId}">${inner}</h${level}>`
  })

  // Cache the result (limit cache size to prevent memory issues)
  if (contentCache.size > 50) {
    const firstKey = contentCache.keys().next().value
    if (firstKey) {
      contentCache.delete(firstKey)
    }
  }
  contentCache.set(cacheKey, html)

  return html
}

// Get posts grouped by series
export async function getPostsBySeries(): Promise<Record<string, Post[]>> {
  const posts = await getAllPosts()
  const grouped: Record<string, Post[]> = {}

  posts.forEach((post) => {
    const series = post.series || SERIES_NEW
    if (!grouped[series]) {
      grouped[series] = []
    }
    grouped[series].push(post)
  })

  // Sort posts within each series with the same global ordering rules.
  Object.keys(grouped).forEach((series) => {
    grouped[series] = sortPostsWithManualOrder(grouped[series])
  })

  return grouped
}

// Get all unique series
export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts()
  const seriesSet = new Set<string>()

  posts.forEach((post) => {
    seriesSet.add(post.series || SERIES_NEW)
  })

  return Array.from(seriesSet).sort()
}
