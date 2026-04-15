import { isAuthenticated } from '@/app/lib/auth'
import { notFound } from 'next/navigation'
import PostEditor from '../PostEditor'

export default async function NewPostPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) notFound()

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
          series: 'From Filter Coffee to German Bread',
        },
        content: '',
      }}
    />
  )
}

