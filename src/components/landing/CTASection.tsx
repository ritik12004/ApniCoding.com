'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Award, Flame, Share2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600/20 via-gray-900 to-pink-600/20 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join 50,000+ developers learning, practicing, and earning verified certificates.
              Complete the 30-day challenge, climb the leaderboards, and showcase your skills on LinkedIn.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 gap-2" asChild>
                <Link href="/auth/signup">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/learn">Explore Courses</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span>Verified Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span>30-Day Challenge</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                <span>LinkedIn Ready</span>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl border-4 border-yellow-400/50 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                <p className="text-gray-600 mb-4">This is a preview of your verified certificate</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                  <div className="text-xs text-gray-500 mb-1">Credential ID</div>
                  <div className="font-mono font-bold text-gray-900">CERT-2026-PY-A1B2</div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <span className="text-xs text-gray-500">QR Code for verification</span>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link href="/verify/CERT-2026-PY-A1B2">
                      <ExternalLink className="h-3 w-3" />
                      Verify
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link href="/dashboard/certificates">
                      <Share2 className="h-3 w-3" />
                      Share
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}