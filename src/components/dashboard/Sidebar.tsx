'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  BookOpen, 
  Code, 
  Trophy, 
  Users, 
  Award, 
  Flame, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Practice', href: '/ide', icon: Code },
  { name: '30-Day Challenge', href: '/challenge/30-days-of-code', icon: Flame },
  { name: 'Leaderboards', href: '/leaderboard', icon: Trophy },
  { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { name: 'Ambassador', href: '/ambassador', icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ full_name?: string; email?: string; avatar_url?: string } | null>(null)
  const [streak, setStreak] = useState(0)

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          full_name: user.user_metadata?.full_name,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
        })
        
        // Fetch streak from profile
        const { data: profile } = await supabase
          .from('users')
          .select('streak_count')
          .eq('id', user.id)
          .single()
        
        if (profile) setStreak(profile.streak_count)
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Code className="h-8 w-8 text-purple-400" />
              <span className="font-bold text-white">apnicoding</span>
            </Link>
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <Avatar 
                src={user?.avatar_url} 
                alt={user?.full_name || 'User'}
                fallback={user?.full_name?.charAt(0) || 'U'}
                className="h-10 w-10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.full_name || 'Student'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-white">{streak}</span>
              <span className="text-xs text-gray-400">Day Streak</span>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-3 justify-start gap-2 text-red-400 hover:bg-red-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Code className="h-7 w-7 text-purple-400" />
            <span className="font-bold text-white">apnicoding</span>
          </Link>
          <div className="w-10" />
        </div>
      </header>
    </>
  )
}