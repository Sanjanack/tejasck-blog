import { isAuthenticated } from '@/app/lib/auth'
import { redirect, notFound } from 'next/navigation'
import PostEditor from '../../PostEditor'
import { readPostFile } from '@/app/lib/postFiles'

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect('/admin/login')

  try {
    const post = await readPostFile(params.slug)
    return <PostEditor mode="edit" initial={post} />
  } catch {
    notFound()
  }
}

