import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getPostContent, getAllPosts } from '../../lib/posts'
import Comments from '../../components/Comments'
import ReadingProgress from '../../components/ReadingProgress'
import PostReactions from '../../components/PostReactions'
import PostTags from '../../components/PostTags'
import SocialShare from '../../components/SocialShare'
import PostNavigation from '../../components/PostNavigation'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Get first 160 characters of content for description
  const plainText = post.content.replace(/[#*`]/g, '').replace(/\n/g, ' ').trim()
  const description = post.excerpt || plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '')
  
  // Generate OG image URL (you can customize this)
  const ogImage =
    post.coverImage ||
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/api/og?title=${encodeURIComponent(post.title)}`

  return {
    title: `${post.title} | Tejas C.K Studio`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Tejas C.K'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const content = await getPostContent(post.content)

  return (
    <>
      <ReadingProgress />
      <div className="relative min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] pt-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b8e6b]/5 blur-3xl dark:bg-[#7a9a7a]/5" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5b7c99]/5 blur-3xl dark:bg-[#6b8e9f]/5" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 animate-fade-in">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#6b8e6b] dark:text-[#7a9a7a] hover:text-[#5a7a5a] dark:hover:text-[#6b8e6b] font-medium transition-all duration-300 hover:gap-3 group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>

          <header className="mb-16 animate-slide-up">
            <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-8 shadow-lg">
              {post.coverImage && (
                <div className="mb-6 overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#4a5568]">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    width={1600}
                    height={900}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              )}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#6b8e6b] dark:border-[#7a9a7a] bg-[#f0f4f0] dark:bg-[#2d3a2d] px-4 py-1.5 text-sm font-semibold text-[#6b8e6b] dark:text-[#7a9a7a]">
                  Letters from Schmalkalden
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#6b8e6b] dark:bg-[#7a9a7a] rounded-full"></div>
                    <time 
                      dateTime={post.date}
                      className="text-[#4a5568] dark:text-[#9ca3af]"
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex gap-1">
                    {['📚', '✍️', '🇩🇪'].map((emoji, i) => (
                      <span key={i} className="text-lg">{emoji}</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  {post.readingTime} min read
                </div>
              </div>
            </div>
          </header>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <PostTags tags={post.tags} postSlug={post.slug} />
            </div>
          )}

          <article className="prose prose-lg max-w-none bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-8 animate-slide-up shadow-lg" style={{animationDelay: '0.2s'}}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>

          <div className="mt-8 mb-8">
            <PostReactions postSlug={params.slug} />
          </div>

          <div className="mb-8">
            <SocialShare title={post.title} url={`/blog/${post.slug}`} description={post.excerpt} />
          </div>

          <PostNavigation currentSlug={params.slug} />

          <Comments postSlug={params.slug} />

          <footer className="mt-16 pt-8 border-t border-[#e2e8f0] dark:border-[#4a5568] animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#6b8e6b] dark:text-[#7a9a7a] hover:text-[#5a7a5a] dark:hover:text-[#6b8e6b] font-medium transition-all duration-300 hover:gap-3 group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Blog
              </Link>
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#718096] dark:text-[#9ca3af]">
                  Published on {new Date(post.date).toLocaleDateString()}
                </div>
                <a href={`/ask?subject=${encodeURIComponent('Question about: ' + post.title)}&ref=${encodeURIComponent('/blog/' + post.slug)}`} className="btn-secondary px-4 py-2" rel="nofollow">Ask about this post</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

// Enable static generation with revalidation
export const revalidate = 60 // Revalidate every 60 seconds

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
