'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Award, Flame, Users, Code, Globe } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium">New: 30-Day Coding Challenge - Join 50,000+ developers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6">
            Master Programming. Solve Real Problems.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Earn Verified Certificates
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Learn with interactive tutorials, practice in a professional IDE, compete on global leaderboards,
            and showcase verified credentials on LinkedIn — all 100% free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0" asChild>
              <Link href="/auth/signup">
                Start Learning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-700 hover:border-purple-500 text-gray-200 hover:text-white" asChild>
              <Link href="/learn">Browse Courses</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Verified certificates</span>
            </div>
          </div>
        </div>

        {/* Interactive Demo Preview */}
        <div className="mt-16 relative">
          <div className="absolute -inset-4 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl pointer-events-none" />
          
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Demo Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400 font-mono">demo.apnicoding.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Live Preview</Badge>
              </div>
            </div>

            {/* Split Screen Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
              {/* Left: Tutorial Content */}
              <div className="p-6 overflow-y-auto border-r border-gray-800 bg-gray-950">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-white mb-4">Python Basics: Variables</h3>
                  <p className="text-gray-300 mb-4">Variables are containers for storing data values. In Python, you don't need to declare the type.</p>
                  
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                    <pre className="text-sm overflow-x-auto"><code className="language-python">{`name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}, Age: {age}")`}</code></pre>
                  </div>

                  <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                    <p className="text-purple-300 text-sm"><strong>💡 Try it:</strong> Click "Run" to see the output!</p>
                  </div>
                </div>
              </div>

              {/* Right: Monaco Editor */}
              <div className="relative bg-gray-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500">
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                  </select>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0">
                    ▶ Run Code
                  </Button>
                </div>
                
                <div className="bg-gray-950 border border-gray-700 rounded-lg overflow-hidden font-mono text-sm">
                  <pre className="p-4 text-gray-100"><code>{`name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}, Age: {age}")`}</code></pre>
                </div>

                {/* Terminal Output */}
                <div className="mt-3 bg-black/50 border border-gray-700 rounded-lg overflow-hidden">
                  <div className="flex items-center px-3 py-2 bg-gray-900 border-b border-gray-700">
                    <span className="text-xs text-gray-400">Terminal</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-600 text-white rounded">SUCCESS</span>
                  </div>
                  <pre className="p-4 text-green-300 text-sm">
                    <code>
{`Name: Alice, Age: 25

Execution time: 0.045s
Memory used: 8.2 MB`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}