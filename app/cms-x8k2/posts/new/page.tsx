import { isAuthenticated } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import PostEditor from '@/app/admin/posts/PostEditor'
import { CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function NewPostPage() {
  if (!(await isAuthenticated())) redirect(CMS_LOGIN_PATH)
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
