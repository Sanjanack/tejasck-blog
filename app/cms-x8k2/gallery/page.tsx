import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated } from '@/app/lib/auth'
import { CMS_PATH } from '@/app/lib/cms-constants'
import { listGalleryImagesAdmin } from '@/app/lib/gallery'
import GalleryAdmin from './GalleryAdmin'

export default async function CMSGalleryPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) notFound()

  const initialImages = await listGalleryImagesAdmin()

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        <Link href={CMS_PATH} className="text-[#6b8e6b] dark:text-[#7a9a7a] hover:underline text-sm">
          ← Dashboard
        </Link>
      </div>
      <GalleryAdmin initialImages={initialImages} />
    </>
  )
}
