'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Trophy, 
  Share2, 
  Copy, 
  CheckCircle,
  Award,
  Medal,
  Crown,
  TrendingUp,
  Link as LinkIcon,
} from 'lucide-react'
import { cn, getBadgeFromReferrals, getReferralLink } from '@/lib/utils'

interface ReferralStats {
  referrals_count: number
  badge: 'bronze' | 'silver' | 'gold' | null
  rank?: number
}

interface AmbassadorEntry {
  user_id: string
  full_name: string
  college_name: string
  referrals_count: number
  badge: 'bronze' | 'silver' | 'gold' | null
  rank: number
}

export default function AmbassadorPage() {
  const [stats, setStats] = useState<ReferralStats>({ referrals_count: 0, badge: null })
  const [globalAmbassadors, setGlobalAmbassadors] = useState<AmbassadorEntry[]>([])
  const [collegeAmbassadors, setCollegeAmbassadors] = useState<AmbassadorEntry[]>([])
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('global')
  const [userCollege, setUserCollege] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's referral stats
      const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id)

      const badge = getBadgeFromReferrals(count || 0)
      setStats({ referrals_count: count || 0, badge })
      setReferralLink(getReferralLink(user.user_metadata?.username || user.id))

      // Get user's college
      const { data: profile } = await supabase
        .from('users')
        .select('college_name')
        .eq('id', user.id)
        .single()
      
      if (profile?.college_name) {
        setUserCollege(profile.college_name)
      }

      // Fetch global ambassadors
      const { data: global } = await supabase
        .rpc('get_ambassador_leaderboard', { limit_count: 50 })
      
      if (global) {
        setGlobalAmbassadors(global.map((a: any, i: number) => ({ ...a, rank: i + 1 })))
      }

      // Fetch college ambassadors
      if (profile?.college_name) {
        const { data: college } = await supabase
          .rpc('get_college_ambassador_leaderboard', { 
            college_name_param: profile.college_name,
            limit_count: 50 
          })
        
        if (college) {
          setCollegeAmbassadors(college.map((a: any, i: number) => ({ ...a, rank: i + 1 })))
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case 'gold': return <Medal className="h-5 w-5 text-yellow-400" />
      case 'silver': return <Award className="h-5 w-5 text-gray-400" />
      case 'bronze': return <Trophy className="h-5 w-5 text-amber-700" />
      default: return <Users className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900'
      case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
      default: return 'bg-gray-700 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4 border-4 border-purple-400/20 rounded-full border-t-transparent" />
          <p className="text-gray-400">Loading ambassador portal...</p>
        </div>
      </div>
    )
  }

  const ambassadors = activeTab === 'global' ? globalAmbassadors : collegeAmbassadors

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-400" />
              Campus Ambassador Program
            </h1>
            <p className="text-gray-400 mt-1">Invite friends, climb leaderboards, earn exclusive badges</p>
          </div>
        </div>

        {/* Your Stats */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={cn('p-4 rounded-2xl', getBadgeColor(stats.badge))}>
                  {getBadgeIcon(stats.badge)}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Referrals</p>
                  <p className="text-3xl font-bold text-white">{stats.referrals_count}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Your Badge</p>
                  <Badge 
                    variant={stats.badge === 'gold' ? 'default' : 'secondary'} 
                    className={cn('text-lg px-4 py-2', getBadgeColor(stats.badge))}
                  >
                    {stats.badge ? stats.badge.charAt(0).toUpperCase() + stats.badge.slice(1) : 'Recruit'}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-400">Next Milestone</p>
                  <p className="font-bold text-white">
                    {stats.badge === 'gold' ? 'Max Level' : 
                     stats.badge === 'silver' ? `${50 - stats.referrals_count} to Gold` :
                     stats.badge === 'bronze' ? `${20 - stats.referrals_count} to Silver` :
                     `${5 - stats.referrals_count} to Bronze`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Link */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="flex-1 bg-gray-800"
              />
              <Button 
                variant="outline" 
                onClick={handleCopy}
                className="gap-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => navigator.share({ url: referralLink })} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Share this link with friends. When they sign up, you'll get credit!
            </p>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Milestone Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { tier: 'Bronze', req: 5, icon: Trophy, color: 'from-amber-600 to-amber-800', rewards: ['Bronze badge on profile', 'Exclusive Discord role', 'Early access to new features'] },
                { tier: 'Silver', req: 20, icon: Award, color: 'from-gray-300 to-gray-500', rewards: ['Silver badge on profile', 'Priority support', 'Monthly ambassador newsletter'] },
                { tier: 'Gold', req: 50, icon: Medal, color: 'from-yellow-400 to-yellow-600', rewards: ['Gold badge on profile', 'Swag package', 'Direct line to team', 'Revenue sharing (coming soon)'] },
              ].map((milestone) => (
                <div key={milestone.tier} className={cn(
                  'p-4 rounded-xl border transition-all',
                  stats.referrals_count >= milestone.req 
                    ? `bg-gradient-to-br ${milestone.color} border-transparent` 
                    : 'bg-gray-800/50 border-gray-700 opacity-60'
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('p-3 rounded-xl', stats.referrals_count >= milestone.req ? 'bg-white/20' : 'bg-gray-700')}>
                      <milestone.icon className={cn('h-6 w-6', stats.referrals_count >= milestone.req ? 'text-white' : 'text-gray-500')} />
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{ color: stats.referrals_count >= milestone.req ? 'white' : 'white' }}>
                        {milestone.tier} Lead
                      </p>
                      <p className="text-sm" style={{ color: stats.referrals_count >= milestone.req ? 'white' : 'gray' }}>
                        {milestone.req} referrals
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {milestone.rewards.map((reward, i) => (
                      <li key={i} className="flex items-center gap-2" style={{ color: stats.referrals_count >= milestone.req ? 'white' : 'gray' }}>
                        <CheckCircle className="h-3 w-3" style={{ color: stats.referrals_count >= milestone.req ? '#fbbf24' : 'gray' }} />
                        {reward}
                      </li>
                    ))}
                  </ul>
                  {stats.referrals_count >= milestone.req && (
                    <Badge variant="success" className="mt-3 w-full text-center">UNLOCKED</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="global" className="w-full">
          <TabsList className="w-full bg-gray-900 border border-gray-800 p-1">
            <TabsTrigger value="global" className="flex-1 flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Global Ambassadors
            </TabsTrigger>
            <TabsTrigger value="college" className="flex-1 flex items-center justify-center gap-2" disabled={!userCollege}>
              <Trophy className="h-4 w-4" />
              {userCollege ? 'College Leaderboard' : 'College (Set college in profile)'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                    <th className="pb-3 px-4 w-16">Rank</th>
                    <th className="pb-3 px-4">Ambassador</th>
                    <th className="pb-3 px-4 hidden md:table-cell">College</th>
                    <th className="pb-3 px-4 w-24 text-center">Referrals</th>
                    <th className="pb-3 px-4 w-24 text-center">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {ambassadors.slice(0, 50).map((ambassador, index) => (
                    <tr key={ambassador.user_id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-400 mx-auto" />}
                        {index === 1 && <Medal className="h-5 w-5 text-gray-400 mx-auto" />}
                        {index === 2 && <Trophy className="h-5 w-5 text-amber-700 mx-auto" />}
                        {index > 2 && <span className="text-gray-400 font-bold mx-auto">#{ambassador.rank}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                            {ambassador.full_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-white">{ambassador.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-400">{ambassador.college_name}</td>
                      <td className="py-3 px-4 text-center font-mono text-purple-400">{ambassador.referrals_count}</td>
                      <td className="py-3 px-4 text-center">
                        {ambassador.badge && (
                          <Badge 
                            variant={ambassador.badge === 'gold' ? 'default' : 'secondary'}
                            className={getBadgeColor(ambassador.badge)}
                          >
                            {ambassador.badge.charAt(0).toUpperCase() + ambassador.badge.slice(1)}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {ambassadors.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No ambassadors yet. Be the first!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="college" className="mt-6">
            {userCollege ? (
              <>
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                  <Trophy className="h-4 w-4" />
                  <span>Showing ambassadors for <strong className="text-white">{userCollege}</strong></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                        <th className="pb-3 px-4 w-16">Rank</th>
                        <th className="pb-3 px-4">Ambassador</th>
                        <th className="pb-3 px-4 w-24 text-center">Referrals</th>
                        <th className="pb-3 px-4 w-24 text-center">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {collegeAmbassadors.map((ambassador, index) => (
                        <tr key={ambassador.user_id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            {index === 0 && <Crown className="h-5 w-5 text-yellow-400 mx-auto" />}
                            {index === 1 && <Medal className="h-5 w-5 text-gray-400 mx-auto" />}
                            {index === 2 && <Trophy className="h-5 w-5 text-amber-700 mx-auto" />}
                            {index > 2 && <span className="text-gray-400 font-bold mx-auto">#{ambassador.rank}</span>}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
                                {ambassador.full_name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="font-medium text-white">{ambassador.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-purple-400">{ambassador.referrals_count}</td>
                          <td className="py-3 px-4 text-center">
                            {ambassador.badge && (
                              <Badge 
                                variant={ambassador.badge === 'gold' ? 'default' : 'secondary'}
                                className={getBadgeColor(ambassador.badge)}
                              >
                                {ambassador.badge.charAt(0).toUpperCase() + ambassador.badge.slice(1)}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Set your college in profile settings to see college ambassadors</p>
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