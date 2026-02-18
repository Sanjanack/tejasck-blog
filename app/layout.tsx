import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Tejas C.K Studio · Letters & Vlogs',
  description: 'A publishing hub for Tejas C.K—featuring Letters from Schmalkalden plus future travel and study vlog series.',
  keywords: ['Tejas C.K', 'blog network', 'Germany vlog', 'Letters from Schmalkalden', 'study abroad'],
  authors: [{ name: 'Tejas C.K Studio' }],
  openGraph: {
    title: 'Tejas C.K Studio · Letters & Vlogs',
    description: "Letters from Schmalkalden is the first series in Tejas C.K's growing blog network.",
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Tejas C.K Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tejas C.K Studio · Letters & Vlogs',
    description: "Letters from Schmalkalden is the first series in Tejas C.K's growing blog network.",
  },
  robots: 'index, follow',
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
