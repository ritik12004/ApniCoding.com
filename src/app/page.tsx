import { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { Stats } from '@/components/landing/Stats'
import { Features } from '@/components/landing/Features'
import { CoursesPreview } from '@/components/landing/CoursesPreview'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
  description: 'Learn programming with interactive tutorials, practice in a professional IDE, compete on leaderboards, and earn free verified certificates for LinkedIn. Join 50,000+ developers.',
  keywords: ['programming', 'coding', 'learn to code', 'certificates', 'leetcode', 'w3schools', 'python', 'javascript', 'cpp', 'java', 'dsa'],
  authors: [{ name: 'apnicoding.com' }],
  creator: 'apnicoding.com',
  publisher: 'apnicoding.com',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apnicoding.com',
    title: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
    description: 'Learn programming with interactive tutorials, practice in a professional IDE, compete on leaderboards, and earn free verified certificates for LinkedIn.',
    siteName: 'apnicoding.com',
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
    title: 'apnicoding.com - Master Programming. Earn Verified Certificates.',
    description: 'Learn programming with interactive tutorials, practice in a professional IDE, and earn verified certificates.',
    images: ['/og-image.png'],
    creator: '@apnicoding',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Hero />
      <Stats />
      <Features />
      <CoursesPreview />
      <CTASection />
      <Footer />
    </div>
  )
}