import { isAuthenticated } from '@/app/lib/auth'
import { notFound } from 'next/navigation'
import PostEditor from '@/app/admin/posts/PostEditor'
import { getAllSeries, getPostBySlug } from '@/app/lib/posts'

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  if (!(await isAuthenticated())) notFound()

  const post = await getPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  const existingSeries = await getAllSeries()

  return (
    <PostEditor
      mode="edit"
      initial={{
        slug: post.slug,
        frontmatter: {
          title: post.title,
          date: post.date.slice(0, 10),
          excerpt: post.excerpt,
          tags: post.tags || [],
          series: post.series || 'From Filter Coffee to German Bread',
          coverImage: post.coverImage,
          coverImageAlt: post.coverImageAlt,
        },
        content: post.content,
        existingSeries,
      }}
    />
  )
}
