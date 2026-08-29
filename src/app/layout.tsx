import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
    template: '%s | apnicoding.com',
  },
  description: 'Learn programming with interactive tutorials, practice in a professional IDE, compete on leaderboards, and earn free verified certificates for LinkedIn.',
  keywords: ['programming', 'coding', 'learn to code', 'certificates', 'leetcode', 'w3schools', 'python', 'javascript', 'cpp', 'java', 'dsa', 'online IDE', 'code execution'],
  authors: [{ name: 'apnicoding.com' }],
  creator: 'apnicoding.com',
  publisher: 'apnicoding.com',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apnicoding.com',
    siteName: 'apnicoding.com',
    title: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
    description: 'Learn programming with interactive tutorials, practice in a professional IDE, compete on leaderboards, and earn free verified certificates for LinkedIn.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'apnicoding.com - Learn to Code',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@apnicoding',
    creator: '@apnicoding',
    title: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
    description: 'Learn programming with interactive tutorials, practice in a professional IDE, and earn verified certificates.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://emkc.org" />
        <link rel="dns-prefetch" href="https://emkc.org" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}