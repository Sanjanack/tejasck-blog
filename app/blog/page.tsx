import { getAllPosts } from '../lib/posts'
import BlogClient from './BlogClient'
import { Suspense } from 'react'

// Enable static generation with revalidation
export const revalidate = 60 // Revalidate every 60 seconds

export default function BlogPage() {
  const posts = getAllPosts()
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]"><div className="max-w-6xl mx-auto px-4 py-12">Loading...</div></div>}>
      <BlogClient posts={posts} />
    </Suspense>
  )
}
