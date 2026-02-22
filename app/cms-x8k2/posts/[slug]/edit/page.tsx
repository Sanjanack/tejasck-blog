import { isAuthenticated } from '@/app/lib/auth'
import { redirect, notFound } from 'next/navigation'
import PostEditor from '@/app/admin/posts/PostEditor'
import { readPostFile } from '@/app/lib/postFiles'
import { getAllSeries } from '@/app/lib/posts'
import { CMS_LOGIN_PATH } from '@/app/lib/auth'

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  if (!(await isAuthenticated())) redirect(CMS_LOGIN_PATH)
  try {
    const post = await readPostFile(params.slug)
    return <PostEditor mode="edit" initial={{ ...post, existingSeries: getAllSeries() }} />
  } catch {
    notFound()
  }
}
