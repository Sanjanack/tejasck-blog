import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import PostEditor from '@/app/admin/posts/PostEditor'
import { CMS_LOGIN_PATH } from '@/app/lib/auth'
import { getAllSeries } from '@/app/lib/posts'

export default async function NewPostPage() {
  if (!(await isAuthenticated())) redirect(CMS_LOGIN_PATH)
  const existingSeries = getAllSeries()
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
          series: existingSeries[0] ?? 'Letters from Schmalkalden',
        },
        content: '',
        existingSeries,
      }}
    />
  )
}
