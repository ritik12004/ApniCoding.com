'use client'

import { Users, Code, Award, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { 
    label: 'Students Enrolled', 
    value: '50,000+', 
    icon: Users, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    trend: '+12% this month'
  },
  { 
    label: 'Code Submissions', 
    value: '2.5M+', 
    icon: Code, 
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    trend: '99.9% uptime'
  },
  { 
    label: 'Certificates Issued', 
    value: '15,000+', 
    icon: Award, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    trend: 'Verified on LinkedIn'
  },
  { 
    label: 'Active Streaks', 
    value: '8,500+', 
    icon: Flame, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    trend: '30-day challenge'
  },
]

export function Stats() {
  return (
    <section className="py-16 bg-gray-900/50 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.trend}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}