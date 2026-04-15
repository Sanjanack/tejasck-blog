import { isAuthenticated } from '@/app/lib/auth'
import { notFound } from 'next/navigation'
import PostEditor from '@/app/admin/posts/PostEditor'
import { getAllSeries } from '@/app/lib/posts'

export default async function NewPostPage() {
  if (!(await isAuthenticated())) notFound()
  const existingSeries = await getAllSeries()
  return (
    <PostEditor
      mode="new"
      initial={{
        slug: 'new-post',
        frontmatter: {
          title: '',
          date: new Date().toISOString().slice(0, 10),
          excerpt: '',
          tags: [],
          series: existingSeries[0] ?? 'From Filter Coffee to German Bread',
        },
        content: '',
        existingSeries,
      }}
    />
  )
}
