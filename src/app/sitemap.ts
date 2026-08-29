import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apnicoding.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/challenge/30-days-of-code`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ambassador`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Fetch courses
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })
  const coursePages = courses?.map(course => ({
    url: `${baseUrl}/learn/${course.slug}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Fetch lessons for each course
  const lessonPages: MetadataRoute.Sitemap = []
  if (courses) {
    for (const course of courses) {
      // @ts-ignore
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, slug, updated_at')
        // @ts-ignore
        .eq('course_id', course.id)
        .order('updated_at', { ascending: false })
      
      lessons?.forEach(lesson => {
        lessonPages.push({
          url: `${baseUrl}/learn/${course.slug}/${lesson.slug}`,
          lastModified: new Date(lesson.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      })
    }
  }

  // Fetch problems
  const { data: problems } = await supabase
    .from('problems')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(500)

  const problemPages = problems?.map(problem => ({
    url: `${baseUrl}/ide/${problem.id}`,
    lastModified: new Date(problem.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  // Fetch certificates for verification pages
  const { data: certificates } = await supabase
    .from('certificates')
    .select('certificate_id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(1000)

  const certificatePages = certificates?.map(cert => ({
    url: `${baseUrl}/verify/${cert.certificate_id}`,
    lastModified: new Date(cert.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })) || []

  return [...staticPages, ...coursePages, ...lessonPages, ...problemPages, ...certificatePages]
}