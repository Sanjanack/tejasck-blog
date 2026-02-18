import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import PostEditor from '../PostEditor'

export default async function NewPostPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

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
          series: 'Letters from Schmalkalden',
        },
        content: '',
      }}
    />
  )
}

