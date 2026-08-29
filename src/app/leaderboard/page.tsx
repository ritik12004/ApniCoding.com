'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Flame, 
  Code, 
  Users, 
  Award,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  user_id: string
  full_name: string
  college_name: string | null
  streak_count: number
  problems_solved: number
  rank: number
  avatar_url?: string
}

export default function LeaderboardPage() {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([])
  const [collegeLeaderboard, setCollegeLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('global')
  const [userCollege, setUserCollege] = useState<string>('')

  useEffect(() => {
    const fetchLeaderboards = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Fetch global leaderboard
      const { data: global } = await supabase
        .from('users')
        .select('id, full_name, college_name, streak_count, avatar_url')
        .order('streak_count', { ascending: false })
        .limit(100)
      if (global) {
        const withRank = global.map((u, i) => ({
          ...u,
          user_id: u.id,
          rank: i + 1,
          problems_solved: 0,
        }))
        setGlobalLeaderboard(withRank)
        
        // Find user's rank
        if (user) {
          const userEntry = withRank.find(u => u.id === user.id)
          if (userEntry) setUserRank(userEntry)
        }
      }

      // Fetch college leaderboard
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('college_name')
          .eq('id', user.id)
          .single()
        
        if (profile?.college_name) {
          setUserCollege(profile.college_name)
          
          const { data: college } = await supabase
            .from('users')
            .select('id, full_name, college_name, streak_count, avatar_url')
            .eq('college_name', profile.college_name)
            .order('streak_count', { ascending: false })
            .limit(50)
          
          if (college) {
            setCollegeLeaderboard(college.map((u, i) => ({
              ...u,
              user_id: u.id,
              rank: i + 1,
              problems_solved: 0,
            })))
          }
        }
      }

      // Fetch problems solved for top users
      await fetchProblemsSolved()
      setLoading(false)
    }

    const fetchProblemsSolved = async () => {
      const supabase = createClient()
      
      // Get unique user IDs from both leaderboards
      const allUsers = [...new Set([
        ...globalLeaderboard.slice(0, 20).map(u => u.id),
        ...collegeLeaderboard.slice(0, 20).map(u => u.id),
      ])]

      if (allUsers.length > 0) {
        const { data: submissions } = await supabase
          .from('submissions')
          .select('user_id, status')
          .in('user_id', allUsers)
          .eq('status', 'AC')

        const solvedCount: Record<string, number> = {}
        submissions?.forEach(s => {
          solvedCount[s.user_id] = (solvedCount[s.user_id] || 0) + 1
        })

        setGlobalLeaderboard(prev => prev.map(u => ({
          ...u,
          problems_solved: solvedCount[u.id] || 0,
        })))
        
        setCollegeLeaderboard(prev => prev.map(u => ({
          ...u,
          problems_solved: solvedCount[u.id] || 0,
        })))

        if (userRank) {
          setUserRank(prev => prev ? {
            ...prev,
            problems_solved: solvedCount[prev.id] || 0,
          } : null)
        }
      }
    }

    fetchLeaderboards()
  }, [])

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-amber-700'
    return 'text-gray-300'
  }

  const leaderboard = activeTab === 'global' ? globalLeaderboard : collegeLeaderboard

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4 border-4 border-purple-400/20 rounded-full border-t-transparent" />
          <p className="text-gray-400">Loading leaderboards...</p>
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
              <Trophy className="h-8 w-8 text-yellow-400" />
              Leaderboards
            </h1>
            <p className="text-gray-400 mt-1">Compete with developers worldwide</p>
          </div>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('text-4xl font-bold', getRankColor(userRank.rank))}>
                    {getMedal(userRank.rank)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{userRank.full_name}</p>
                    <p className="text-sm text-gray-400">{userRank.college_name || 'No college'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-2xl font-bold text-white">{userRank.streak_count}</p>
                    <p className="text-sm text-gray-400">Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{userRank.problems_solved}</p>
                    <p className="text-sm text-gray-400">Solved</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="global" className="w-full">
          <TabsList className="w-full bg-gray-900 border border-gray-800 p-1">
            <TabsTrigger value="global" className="flex-1 flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="college" className="flex-1 flex items-center justify-center gap-2" disabled={!userCollege}>
              <Award className="h-4 w-4" />
              {userCollege ? 'College' : 'College (Set college in profile)'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                    <th className="pb-3 px-4 w-16">Rank</th>
                    <th className="pb-3 px-4">User</th>
                    <th className="pb-3 px-4 hidden md:table-cell">College</th>
                    <th className="pb-3 px-4 w-24 text-center">
                      <Flame className="h-4 w-4 mx-auto" />
                    </th>
                    <th className="pb-3 px-4 w-24 text-center">
                      <Code className="h-4 w-4 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {leaderboard.slice(0, 50).map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className={cn('font-bold', getRankColor(entry.rank))}>
                          {getMedal(entry.rank)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                            {entry.avatar_url ? (
                              <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              entry.full_name?.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                          <span className="font-medium text-white">{entry.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-400">
                        {entry.college_name || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-orange-400 font-mono">{entry.streak_count}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-purple-400 font-mono">{entry.problems_solved}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users on the leaderboard yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="college" className="mt-4">
            {userCollege ? (
              <>
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Showing leaderboard for <strong className="text-white">{userCollege}</strong></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                        <th className="pb-3 px-4 w-16">Rank</th>
                        <th className="pb-3 px-4">User</th>
                        <th className="pb-3 px-4 w-24 text-center">
                          <Flame className="h-4 w-4 mx-auto" />
                        </th>
                        <th className="pb-3 px-4 w-24 text-center">
                          <Code className="h-4 w-4 mx-auto" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {collegeLeaderboard.map((entry, index) => (
                        <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className={cn('font-bold', getRankColor(entry.rank))}>
                              {getMedal(entry.rank)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                                {entry.avatar_url ? (
                                  <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                  entry.full_name?.charAt(0).toUpperCase() || '?'
                                )}
                              </div>
                              <span className="font-medium text-white">{entry.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-orange-400 font-mono">{entry.streak_count}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-purple-400 font-mono">{entry.problems_solved}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Set your college in profile settings to see college leaderboard</p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/dashboard/settings">Update Profile</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}