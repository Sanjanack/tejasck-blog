'use client'

import Link from 'next/link'

interface PostTagsProps {
  tags: string[]
  postSlug?: string
}

export default function PostTags({ tags, postSlug }: PostTagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#f0f4f0] dark:bg-[#2d3a2d] text-[#5a7a5a] dark:text-[#7a9a7a] hover:bg-[#e0ece0] dark:hover:bg-[#3d4a3d] transition-colors"
        >
          <span>#</span>
          {tag}
        </Link>
      ))}
    </div>
  )
}

