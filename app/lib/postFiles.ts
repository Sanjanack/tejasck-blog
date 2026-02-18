import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export type EditableFrontmatter = {
  title: string
  date: string
  excerpt: string
  tags: string[]
  series: string
  coverImage?: string
  coverImageAlt?: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

function assertSafeSlug(slug: string) {
  if (!slug || typeof slug !== 'string') throw new Error('Slug is required')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug must be lowercase and contain only letters, numbers, and hyphens')
  }
}

export function normalizeSlug(input: string): string {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function readPostFile(slug: string): Promise<{
  slug: string
  frontmatter: EditableFrontmatter
  content: string
}> {
  assertSafeSlug(slug)
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = await fs.readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const tagsRaw = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
  const tags = tagsRaw.map((t) => String(t).trim()).filter(Boolean)

  const frontmatter: EditableFrontmatter = {
    title: String(data.title || '').trim() || 'Untitled',
    date: String(data.date || '').trim() || new Date().toISOString().slice(0, 10),
    excerpt: String(data.excerpt || '').trim() || '',
    tags,
    series: String(data.series || '').trim() || 'Letters from Schmalkalden',
    coverImage: data.coverImage ? String(data.coverImage).trim() : undefined,
    coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt).trim() : undefined,
  }

  return { slug, frontmatter, content }
}

export async function writePostFile(slug: string, frontmatter: EditableFrontmatter, content: string) {
  assertSafeSlug(slug)
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  const fm: Record<string, any> = {
    title: String(frontmatter.title || '').trim() || 'Untitled',
    date: String(frontmatter.date || '').trim() || new Date().toISOString().slice(0, 10),
    excerpt: String(frontmatter.excerpt || '').trim() || '',
    series: String(frontmatter.series || '').trim() || 'Letters from Schmalkalden',
  }

  const tags = (frontmatter.tags || []).map((t) => String(t).trim()).filter(Boolean)
  if (tags.length > 0) fm.tags = tags

  const coverImage = frontmatter.coverImage ? String(frontmatter.coverImage).trim() : ''
  const coverImageAlt = frontmatter.coverImageAlt ? String(frontmatter.coverImageAlt).trim() : ''
  if (coverImage) fm.coverImage = coverImage
  if (coverImageAlt) fm.coverImageAlt = coverImageAlt

  const md = matter.stringify(String(content || '').trimStart(), fm)
  await fs.mkdir(postsDirectory, { recursive: true })
  await fs.writeFile(fullPath, md.endsWith('\n') ? md : `${md}\n`, 'utf8')
}

export async function deletePostFile(slug: string) {
  assertSafeSlug(slug)
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  await fs.unlink(fullPath)
}

