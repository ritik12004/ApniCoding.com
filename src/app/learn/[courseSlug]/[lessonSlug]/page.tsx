'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MarkdownRenderer } from '@/components/learning/MarkdownRenderer'
import { TryItYourself } from '@/components/learning/TryItYourself'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  BookOpen, 
  Code, 
  Flag,
  Loader2,
  Sparkles
} from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseSlug = params.courseSlug as string
  const lessonSlug = params.lessonSlug as string
  const nextLesson = searchParams.get('next')

  const [lesson, setLesson] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  useEffect(() => {
    const fetchLesson = async () => {
      const supabase = createClient()
      
      // Get course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .single()
      
      if (!courseData) {
        router.push('/learn')
        return
      }
      setCourse(courseData)

      // Get all lessons for this course
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('order_index')
      
      setLessons(lessonsData || [])

      // Get current lesson
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*, problems(*)')
        .eq('course_id', courseData.id)
        .eq('slug', lessonSlug)
        .single()
      
      if (!lessonData) {
        router.push(`/learn/${courseSlug}`)
        return
      }
      setLesson(lessonData)

      // Find current lesson index
      const index = lessonsData?.findIndex(l => l.id === lessonData.id) || 0
      setCurrentLessonIndex(index)

      // Check if completed
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonData.id)
          .single()
        
        setCompleted(progress?.completed || false)
      }

      setLoading(false)
    }

    fetchLesson()
  }, [courseSlug, lessonSlug, router])

  const handleComplete = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !lesson) return

    setSaving(true)
    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
        })
      
      setCompleted(true)
      
      // Navigate to next lesson if available
      const next = lessons[currentLessonIndex + 1]
      if (next) {
        router.push(`/learn/${courseSlug}/${next.slug}`)
      } else {
        // Course completed - check for certificate
        router.push(`/dashboard/certificates?course=${courseSlug}`)
      }
    } catch (err) {
      console.error('Failed to mark complete:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePrev = () => {
    const prev = lessons[currentLessonIndex - 1]
    if (prev) {
      router.push(`/learn/${courseSlug}/${prev.slug}`)
    }
  }

  const handleNext = () => {
    const next = lessons[currentLessonIndex + 1]
    if (next) {
      router.push(`/learn/${courseSlug}/${next.slug}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!lesson || !course) {
    return null
  }

  const progress = ((currentLessonIndex + 1) / lessons.length) * 100

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between h-full px-4">
          <h1 className="text-lg font-bold text-white truncate">{lesson.title}</h1>
        </div>
      </nav>

      <div className="pt-16 lg:pt-0">
        <div className="flex">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 bg-gray-900 border-r border-gray-800 min-h-screen sticky top-0 h-screen overflow-y-auto">
            {/* Course Header */}
            <div className="p-4 border-b border-gray-800">
              <Link href={`/learn/${courseSlug}`} className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{course.icon}</span>
                <span className="font-bold text-white">{course.title}</span>
              </Link>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <Progress value={progress} className="h-full" />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </p>
            </div>

            {/* Lessons List */}
            <nav className="p-4 space-y-1">
              {lessons.map((l, index) => {
                const isCurrent = l.id === lesson.id
                const isCompleted = index < currentLessonIndex && completed
                return (
                  <Link
                    key={l.id}
                    href={`/learn/${courseSlug}/${l.slug}`}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      isCurrent
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
                      isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                    )}>
                      {isCompleted ? <CheckCircle className="h-3 w-3" /> : index + 1}
                    </div>
                    <span className="truncate flex-1">{l.title}</span>
                    {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Progress */}
            <div className="lg:hidden p-4 border-b border-gray-800 bg-gray-900/50 sticky top-16 z-30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{course.title}</span>
                <span className="text-sm text-gray-400">Lesson {currentLessonIndex + 1}/{lessons.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Lesson Content */}
            <article className="p-6 max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Lesson {currentLessonIndex + 1} of {lessons.length}
                  </Badge>
                  {lesson.problems && lesson.problems.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Code className="h-3 w-3 mr-1" />
                      Practice Problem
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
              </header>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={lesson.content_markdown || ''} />
              </div>

              {/* Practice Problem */}
              {lesson.problems && lesson.problems.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Code className="h-6 w-6 text-purple-400" />
                    Practice Problem
                  </h2>
                  {lesson.problems.map((problem: any) => (
                    <div key={problem.id} className="space-y-4">
                      <Card className="bg-gray-900/50 border-gray-800">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
                          <div className="prose prose-invert max-w-none text-gray-300 mb-4">
                            {problem.description}
                          </div>
                          <Button asChild variant="outline">
                            <Link href={`/ide/${problem.id}`}>
                              <Code className="h-4 w-4 mr-2" />
                              Open in IDE
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Try It Yourself */}
                      {problem.starter_code && (
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                            Try It Yourself
                          </h4>
                          <TryItYourself
                            initialCode={problem.starter_code}
                            language="python"
                            onRun={async (code, lang) => {
                              const res = await fetch('/api/execute', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ code, language: lang, testCases: problem.test_cases_json }),
                              })
                              return res.json()
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-800 flex items-center justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentLessonIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>

                <div className="flex items-center gap-4">
                  {!completed ? (
                    <Button onClick={handleComplete} disabled={saving} className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  ) : (
                    <Badge variant="success" className="text-sm px-4 py-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </Badge>
                  )}

                  <Button variant="outline" onClick={handleNext} disabled={currentLessonIndex === lessons.length - 1}>
                    Next Lesson
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}