import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn, getStatusColor } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Practice Problems | apnicoding.com',
    description: 'Practice coding problems in our professional IDE. Solve algorithmic challenges, data structures, and system design problems with instant feedback.',
  }
}

export default async function IDEIndexPage() {
  const supabase = await createServerSupabaseClient()

  const { data: problems } = await supabase
    .from('problems')
    .select(`
      id, title, difficulty, description, starter_code, test_cases_json,
      lesson:lessons(course:courses(slug, title, icon))
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <svg className="h-10 w-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Practice Problems
          </h1>
          <p className="text-gray-400 text-lg">Sharpen your coding skills with real-world problems</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500">
            <option value="">All Topics</option>
            <option value="arrays">Arrays</option>
            <option value="strings">Strings</option>
            <option value="linked-lists">Linked Lists</option>
            <option value="trees">Trees</option>
            <option value="graphs">Graphs</option>
            <option value="dp">Dynamic Programming</option>
          </select>
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 flex-1 min-w-[200px]"
          />
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems?.map((problem: any) => (
            <Link 
              key={problem.id} 
              href={`/ide/${problem.id}`}
              className="group block"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      {problem.lesson?.course?.icon} {problem.lesson?.course?.title}
                    </Badge>
                    <Badge 
                      variant={
                        problem.difficulty === 'easy' ? 'success' :
                        problem.difficulty === 'medium' ? 'warning' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{problem.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Solve
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {problem.test_cases_json?.length || 0} test cases
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {(!problems || problems.length === 0) && (
          <div className="text-center py-20">
            <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No problems available yet</p>
            <p className="text-gray-500 mt-2">Check back soon for new challenges!</p>
          </div>
        )}
      </div>
    </div>
  )
}