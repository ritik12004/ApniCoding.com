'use client'

import Link from 'next/link'
import { 
  GitBranch, 
  X, 
  Link as LinkedInIcon, 
  Mail, 
  Code, 
  BookOpen, 
  Trophy, 
  Users, 
  Award, 
  Flame 
} from 'lucide-react'

export function Footer() {
  const navLinks = {
    Platform: [
      { label: 'Courses', href: '/learn' },
      { label: 'Practice', href: '/ide' },
      { label: '30-Day Challenge', href: '/challenge/30-days-of-code' },
      { label: 'Leaderboards', href: '/leaderboard' },
      { label: 'Certificates', href: '/verify' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  }

  const socialLinks = [
    { icon: GitBranch, href: 'https://github.com/apnicoding', label: 'GitHub' },
    { icon: X, href: 'https://twitter.com/apnicoding', label: 'Twitter' },
    { icon: LinkedInIcon, href: 'https://linkedin.com/company/apnicoding', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@apnicoding.com', label: 'Email' },
  ]

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Code className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">apnicoding.com</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Master programming. Solve real problems. Earn verified certificates.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {Object.entries(navLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} apnicoding.com. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Built with Next.js, Supabase, Monaco Editor & Piston API</span>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}