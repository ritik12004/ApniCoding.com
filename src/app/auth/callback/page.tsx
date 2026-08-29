'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  useEffect(() => {
    const handleAuth = async () => {
      if (error) {
        router.push(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`)
        return
      }

      const supabase = createClient()
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (session) {
          router.push(next)
        } else {
          // Wait for session to be established (for OAuth redirects)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              router.push(next)
            }
          })
          
          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe()
            router.push(next)
          }, 5000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        router.push('/auth/login?error=Authentication failed')
      }
    }

    handleAuth()
  }, [router, next, error, errorDescription])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
        <p className="text-gray-400 mt-2">Please wait while we verify your account</p>
      </div>
    </div>
  )
}