'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Clock, Code, Users, Award } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    title: 'Python Programming',
    slug: 'python',
    description: 'From basics to advanced: variables, loops, functions, OOP, data structures, and algorithms.',
    icon: '🐍',
    lessons: 24,
    duration: '12 hours',
    difficulty: 'Beginner',
    students: '15,000+',
  },
  {
    title: 'C++ Fundamentals',
    slug: 'cpp',
    description: 'Master C++: memory management, STL, templates, OOP, and competitive programming techniques.',
    icon: '⚙️',
    lessons: 20,
    duration: '15 hours',
    difficulty: 'Intermediate',
    students: '8,500+',
  },
  {
    title: 'JavaScript & TypeScript',
    slug: 'javascript',
    description: 'Modern JS/TS: ES6+, async/await, DOM, TypeScript types, React fundamentals, and Node.js.',
    icon: '📜',
    lessons: 28,
    duration: '18 hours',
    difficulty: 'Beginner',
    students: '12,000+',
  },
  {
    title: 'Data Structures & Algorithms',
    slug: 'dsa',
    description: 'Arrays, linked lists, trees, graphs, sorting, searching, DP, and 100+ LeetCode-style problems.',
    icon: '🧮',
    lessons: 35,
    duration: '25 hours',
    difficulty: 'Advanced',
    students: '10,000+',
  },
  {
    title: 'Java Programming',
    slug: 'java',
    description: 'Core Java, OOP, collections, streams, multithreading, and Spring Boot basics.',
    icon: '☕',
    lessons: 22,
    duration: '14 hours',
    difficulty: 'Beginner',
    students: '9,000+',
  },
  {
    title: 'Go & Rust Systems',
    slug: 'go-rust',
    description: 'Concurrency in Go, memory safety in Rust, systems programming, and backend development.',
    icon: '🦀',
    lessons: 18,
    duration: '16 hours',
    difficulty: 'Advanced',
    students: '4,000+',
  },
]

export function CoursesPreview() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Popular Courses
            </h2>
            <p className="text-lg text-gray-400">
              Structured learning paths with hands-on practice
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/learn">View All Courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors h-full flex flex-col"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{course.icon}</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                    {course.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-green-400 mb-4">
                  <CheckCircle className="h-3 w-3" />
                  <span>Free certificate on completion</span>
                </div>

                <Button variant="outline" className="w-full mt-auto" asChild>
                  <Link href={`/learn/${course.slug}`}>Start Course <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
                
                <Button variant="outline" className="w-full sm:hidden mt-2" asChild>
                  <Link href="/learn">View All Courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}