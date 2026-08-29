'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Lock, 
  CheckCircle, 
  Clock, 
  Flame, 
  Trophy,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { format, startOfMonth, eachDayOfInterval, endOfMonth, isSameDay, isBefore, isAfter } from 'date-fns'
import { cn } from '@/lib/utils'

interface ChallengeDay {
  day: number
  problem_id: string
  completed: boolean
  completed_at: string | null
  problem?: {
    id: string
    title: string
    difficulty: string
    description: string
  }
}

export default function ChallengePage() {
  const [challengeDays, setChallengeDays] = useState<ChallengeDay[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [streak, setStreak] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null)

  useEffect(() => {
    const fetchChallenge = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch challenge progress
      const { data: progress } = await supabase
        .from('challenge_progress')
        .select('*, problem:problems(id, title, difficulty, description)')
        .eq('user_id', user.id)
        .order('day_number')

      // Fetch user streak
      const { data: profile } = await supabase
        .from('users')
        .select('streak_count')
        .eq('id', user.id)
        .single()

      const days: ChallengeDay[] = []
      for (let i = 1; i <= 30; i++) {
        const dayProgress = progress?.find(p => p.day_number === i)
        days.push({
          day: i,
          problem_id: dayProgress?.problem_id || '',
          completed: dayProgress?.completed || false,
          completed_at: dayProgress?.completed_at || null,
          problem: dayProgress?.problem,
        })
      }

      setChallengeDays(days)
      setStreak(profile?.streak_count || 0)
      setTotalCompleted(days.filter(d => d.completed).length)
      setLoading(false)
    }

    fetchChallenge()
  }, [])

  const handleDayClick = (day: ChallengeDay) => {
    // Check if day is unlocked (sequential unlock)
    const previousDays = challengeDays.filter(d => d.day < day.day)
    const allPreviousCompleted = previousDays.every(d => d.completed)
    const isUnlocked = day.day === 1 || allPreviousCompleted || day.completed

    if (isUnlocked && day.problem) {
      setSelectedDay(day)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const months = [
    { label: 'January', days: 31 },
    { label: 'February', days: 28 },
    { label: 'March', days: 31 },
    { label: 'April', days: 30 },
    { label: 'May', days: 31 },
    { label: 'June', days: 30 },
    { label: 'July', days: 31 },
    { label: 'August', days: 31 },
    { label: 'September', days: 30 },
    { label: 'October', days: 31 },
    { label: 'November', days: 30 },
    { label: 'December', days: 31 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4 border-4 border-purple-400/20 rounded-full border-t-transparent" />
          <p className="text-gray-400">Loading challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-400" />
              30 Days of Code
            </h1>
            <p className="text-gray-400 mt-1">Build a daily coding habit. One problem a day for 30 days.</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{streak}</p>
                  <p className="text-sm text-gray-400">Day Streak</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalCompleted}/30</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Overall Progress</span>
              <span className="text-sm text-gray-400">{(totalCompleted / 30 * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(totalCompleted / 30) * 100} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map(date => {
                const dayNumber = date.getDate()
                const challengeDay = challengeDays.find(d => d.day === dayNumber)
                const isCompleted = challengeDay?.completed
                const isUnlocked = dayNumber === 1 || 
                  challengeDays.slice(0, dayNumber - 1).every(d => d.completed) ||
                  isCompleted
                const isToday = isSameDay(date, new Date())
                const isFuture = isAfter(date, new Date())

                return (
                  <button
                    key={dayNumber}
                    onClick={() => challengeDay && handleDayClick(challengeDay)}
                    disabled={!isUnlocked || !challengeDay}
                    className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all',
                      isCompleted && 'bg-green-500/20 text-green-400 border border-green-500/30',
                      !isCompleted && isUnlocked && !isFuture && 'bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20',
                      !isUnlocked && 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed',
                      isFuture && 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed',
                      isToday && !isCompleted && 'ring-2 ring-purple-500',
                    )}
                  >
                    <span className="text-lg">{dayNumber}</span>
                    {isCompleted && <CheckCircle className="h-4 w-4" />}
                    {!isCompleted && isUnlocked && !isFuture && (
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                    )}
                    {!isUnlocked && <Lock className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-green-400" />
            </div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <AlertCircle className="h-3 w-3 text-purple-300" />
            </div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
              <Lock className="h-3 w-3 text-gray-600" />
            </div>
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg ring-2 ring-purple-500 bg-gray-800 border border-gray-700 flex items-center justify-center">
              <span className="text-purple-300">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Day {selectedDay.day}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)}>
                <AlertCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {selectedDay.problem ? (
                <div className="space-y-4">
                  <Badge variant={selectedDay.problem.difficulty === 'easy' ? 'success' : selectedDay.problem.difficulty === 'medium' ? 'warning' : 'destructive'}>
                    {selectedDay.problem.difficulty}
                  </Badge>
                  <h3 className="text-xl font-bold text-white">{selectedDay.problem.title}</h3>
                  <div className="prose prose-invert max-w-none text-gray-300">
                    {selectedDay.problem.description}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedDay(null)
                      window.location.href = `/ide/${selectedDay.problem_id}`
                    }}
                  >
                    Open in IDE
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Problem not available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}