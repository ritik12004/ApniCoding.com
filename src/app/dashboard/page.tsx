'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Flame, 
  Award, 
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    lessonsCompleted: 0,
    problemsSolved: 0,
    certificatesEarned: 0,
    currentStreak: 0,
    totalXP: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('streak_count, total_xp')
        .eq('id', user.id)
        .single()

      // Fetch enrolled courses with progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select(`
          completed,
          lesson:lessons(id, title, course:courses(id, title, slug, icon))
        `)
        .eq('user_id', user.id) as { data: Array<{ completed: boolean; lesson: { course: Array<{ id: string }> } }> | null; error: any }

      // Fetch submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('status, created_at, problem:problems(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch certificates
      const { data: certificates } = await supabase
        .from('certificates')
        .select('id, certificate_id, issue_date, score, course:courses(title)')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false })
        .limit(5)

      // Calculate stats
      const solvedProblems = submissions?.filter(s => s.status === 'AC').length || 0
      const completedLessons = progress?.filter(p => p.completed).length || 0
      const uniqueCourses = new Set(progress?.map(p => p.lesson?.course?.[0]?.id).filter(Boolean)).size
      setStats({
        coursesEnrolled: uniqueCourses,
        lessonsCompleted: completedLessons,
        problemsSolved: solvedProblems,
        certificatesEarned: certificates?.length || 0,
        currentStreak: profile?.streak_count || 0,
        totalXP: profile?.total_xp || 0,
      })

      setRecentActivity(submissions || [])
      setEnrolledCourses(certificates || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      name: 'Courses Enrolled',
      value: stats.coursesEnrolled,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      href: '/learn',
    },
    {
      name: 'Lessons Completed',
      value: stats.lessonsCompleted,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      href: '/dashboard',
    },
    {
      name: 'Problems Solved',
      value: stats.problemsSolved,
      icon: Code,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      href: '/ide',
    },
    {
      name: 'Certificates',
      value: stats.certificatesEarned,
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      href: '/dashboard/certificates',
    },
    {
      name: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      href: '/challenge/30-days-of-code',
    },
    {
      name: 'Total XP',
      value: stats.totalXP.toLocaleString(),
      icon: TrendingUp,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      href: '/leaderboard',
    },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 h-24" />
            </Card>
          ))}
        </div>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6 h-64" />
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your learning progress and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/learn">Browse Courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
          <Button asChild>
            <Link href="/ide">Start Coding <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.name} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  <ArrowRight className="h-3 w-3" />
                </Badge>
              </div>
              <div className="mt-4">
                <Link href={stat.href} className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                  {stat.value}
                </Link>
                <p className="text-sm text-gray-400">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" asChild size="sm">
              <Link href="/dashboard/activity">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-800">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No activity yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start solving problems to see your activity here</p>
                  <Button asChild className="mt-4">
                    <Link href="/ide">Start Coding</Link>
                  </Button>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                          <span className="text-xs font-medium">{activity.status}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{activity.problem?.title || 'Problem'}</p>
                          <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'AC' ? 'success' : activity.status === 'WA' ? 'destructive' : 'outline'}>
                        {getStatusLabel(activity.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificates & Quick Actions */}
        <div className="space-y-6">
          {/* Certificates */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Certificates</CardTitle>
              <Button variant="ghost" asChild size="sm">
                <Link href="/dashboard/certificates">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800">
                {enrolledCourses.length === 0 ? (
                  <div className="p-8 text-center">
                    <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No certificates yet</p>
                    <p className="text-sm text-gray-500 mt-1">Complete a course to earn your first certificate</p>
                    <Button asChild className="mt-4">
                      <Link href="/learn">Browse Courses</Link>
                    </Button>
                  </div>
                ) : (
                  enrolledCourses.map((cert) => (
                    <Link 
                      key={cert.id} 
                      href={`/verify/${cert.certificate_id}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{cert.course?.[0]?.title}</p>
                        <p className="text-xs text-gray-400">{formatDate(cert.issue_date)} • Score: {cert.score}%</p>
                      </div>
                      <Badge variant="success">Verified</Badge>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/challenge/30-days-of-code">
                  <Flame className="h-4 w-4" />
                  <span>30-Day Challenge</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4" />
                  <span>View Leaderboards</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/ambassador">
                  <Users className="h-4 w-4" />
                  <span>Ambassador Portal</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" asChild>
                <Link href="/dashboard/settings">
                  <Clock className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}