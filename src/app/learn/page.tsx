import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Courses | apnicoding.com',
    description: 'Browse all programming courses. Learn Python, JavaScript, C++, Java, Data Structures & Algorithms, and more with interactive tutorials and free certificates.',
  }
}

export default async function LearnPage() {
  const supabase = await createServerSupabaseClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at')

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">All Courses</h1>
          <p className="text-gray-400 text-lg">Choose your learning path and start coding today</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Link 
              key={course.id} 
              href={`/learn/${course.slug}`}
              className="group block"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{course.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      Self-paced
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Free Certificate
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!courses || courses.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-400">No courses available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}