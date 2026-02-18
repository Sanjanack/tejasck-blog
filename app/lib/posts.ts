import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { cache } from 'react'

const postsDirectory = path.join(process.cwd(), 'posts')

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

// Internal function without cache for use in cached functions
function _getAllPosts(): Post[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        const wordCount = content.split(/\s+/).filter(Boolean).length
        const readingTime = Math.ceil(wordCount / 200)
        
        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || content.substring(0, 150) + '...',
          content,
          readingTime,
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
          series: data.series || 'Letters from Schmalkalden',
          coverImage: data.coverImage ? String(data.coverImage) : undefined,
          coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
        }
      })
    
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

// Cached version for better performance
export const getAllPosts = cache(_getAllPosts)

// Internal function without cache
function _getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.ceil(wordCount / 200)
    
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.substring(0, 150) + '...',
      content,
      readingTime,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      series: data.series || 'Letters from Schmalkalden',
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
    }
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}

// Cached version for better performance
export const getPostBySlug = cache(_getPostBySlug)

// Cache markdown processing results
const contentCache = new Map<string, string>()

export async function getPostContent(content: string): Promise<string> {
  // Use content hash as cache key
  const cacheKey = content.substring(0, 100) + content.length.toString()
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!
  }
  
  const processedContent = await remark()
    .use(remarkHtml)
    .process(content)
  
  const html = processedContent.toString()
  
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
export function getPostsBySeries(): Record<string, Post[]> {
  const posts = getAllPosts()
  const grouped: Record<string, Post[]> = {}
  
  posts.forEach((post) => {
    const series = post.series || 'Letters from Schmalkalden'
    if (!grouped[series]) {
      grouped[series] = []
    }
    grouped[series].push(post)
  })
  
  // Sort posts within each series by date (newest first)
  Object.keys(grouped).forEach((series) => {
    grouped[series].sort((a, b) => (a.date < b.date ? 1 : -1))
  })
  
  return grouped
}

// Get all unique series
export function getAllSeries(): string[] {
  const posts = getAllPosts()
  const seriesSet = new Set<string>()
  
  posts.forEach((post) => {
    seriesSet.add(post.series || 'Letters from Schmalkalden')
  })
  
  return Array.from(seriesSet).sort()
}
