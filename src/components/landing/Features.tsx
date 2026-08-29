'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, 
  Terminal, 
  Trophy, 
  Users, 
  Share2, 
  Zap,
  Shield,
  GraduationCap,
  Flame,
  Medal
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Tutorials',
    description: 'W3Schools-style structured lessons with live code examples, "Try it Yourself" sandboxes, and instant progress tracking.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Terminal,
    title: 'Professional IDE',
    description: 'LeetCode-style split-screen workspace with Monaco Editor, multi-language support, themes, and real-time execution via Piston API.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Trophy,
    title: 'Automated Test Runner',
    description: 'Hidden test cases, instant AC/WA/TLE/CE verdicts, execution time tracking, and detailed error messages for every submission.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: GraduationCap,
    title: 'Verified Certificates',
    description: 'Earn PDF certificates with unique credential IDs, QR codes, and public verification pages — perfect for LinkedIn.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Flame,
    title: '30-Day Challenge',
    description: 'Daily coding problems unlock every 24 hours. Build streaks, climb leaderboards, and develop consistent coding habits.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Users,
    title: 'Global Leaderboards',
    description: 'Compete globally or within your college. Track rank by streak count and problems solved. Earn ambassador badges.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Share2,
    title: 'Viral LinkedIn Sharing',
    description: 'One-click "Add to Profile" and "Share on Feed" with pre-filled posts. Drive organic growth through verified achievements.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Supabase Auth with Email/Password and Google OAuth. Row-level security on all data. Your code, your privacy.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Next.js 14 App Server Components, edge-ready, optimized builds. Sub-second page loads worldwide.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
]

export function Features() {
  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Master Programming
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A complete learning ecosystem combining tutorials, practice, competition, and credentials — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className={`p-3 rounded-xl ${feature.bgColor} w-fit mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}