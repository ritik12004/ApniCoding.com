import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, Code, Lock, Play } from 'lucide-react'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', resolvedParams.courseSlug)
    .single()

  if (!course) {
    return { title: 'Course Not Found | apnicoding.com' }
  }

  return {
    title: `${course.title} | apnicoding.com`,
    description: course.description || `Learn ${course.title} with interactive tutorials and earn a free verified certificate.`,
    openGraph: {
      title: course.title,
      description: course.description,
      type: 'website',
    },
  }
}

export default async function CoursePage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', resolvedParams.courseSlug)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index')

  const { data: { user } } = await supabase.auth.getUser()

  // Get user progress for this course
  let userProgress: Record<string, boolean> = {}
  if (user && lessons) {
    const lessonIds = lessons.map(l => l.id)
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .in('lesson_id', lessonIds)
    
    progress?.forEach(p => {
      userProgress[p.lesson_id] = p.completed
    })
  }

  const completedCount = Object.values(userProgress).filter(Boolean).length
  const totalLessons = lessons?.length || 0
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{course.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-white">{course.title}</h1>
              <p className="text-gray-400 mt-1">{course.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {user && totalLessons > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">Your Progress</span>
                <span className="text-sm text-gray-400">{completedCount}/{totalLessons} lessons completed</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">{progressPercent.toFixed(0)}% complete</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              ~{totalLessons * 30} min total
            </span>
            <span className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              {totalLessons} lessons
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Free Certificate
            </span>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Course Content</h2>
          </div>
          
          <div className="divide-y divide-gray-800">
            {lessons?.map((lesson, index) => {
              const isCompleted = userProgress[lesson.id]
              const isLocked = !user && index > 0
              
              return (
                <Link 
                  key={lesson.id}
                  href={isLocked ? '/auth/login?callbackUrl=' + encodeURIComponent(`/learn/${course.slug}/${lesson.slug}`) : `/learn/${course.slug}/${lesson.slug}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Play className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">Lesson {index + 1}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-gray-500 text-sm">Locked</span>
                    )}
                    {!isCompleted && !isLocked && (
                      <span className="text-purple-400 text-sm">Start</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTA for non-authenticated */}
        {!user && (
          <div className="mt-8 text-center p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">Track Your Progress</h3>
            <p className="text-gray-400 mb-4">Create a free account to save your progress and earn certificates</p>
            <Link href="/auth/signup" className="inline-block">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg font-medium">
                Sign Up Free
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper for cn
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}