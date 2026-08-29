export interface User {
  id: string
  email: string
  full_name: string | null
  college_name: string | null
  streak_count: number
  last_active_date: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  content_markdown: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Problem {
  id: string
  lesson_id: string
  title: string
  description: string
  starter_code: string
  test_cases_json: TestCase[]
  difficulty: 'easy' | 'medium' | 'hard'
  created_at: string
  updated_at: string
}

export interface TestCase {
  input: string
  expected_output: string
  is_hidden: boolean
  explanation?: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  updated_at: string
}

export interface Submission {
  id: string
  user_id: string
  problem_id: string
  code: string
  language: string
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'pending'
  execution_time: number
  created_at: string
}

export interface Certificate {
  id: string
  certificate_id: string
  user_id: string
  course_id: string
  issue_date: string
  score: number
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referee_id: string
  created_at: string
}

export interface ChallengeDay {
  day: number
  problem_id: string
  unlocked: boolean
  completed: boolean
}

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  college_name: string | null
  streak_count: number
  problems_solved: number
  rank: number
}

export interface AmbassadorStats {
  user_id: string
  full_name: string
  college_name: string
  referrals_count: number
  badge: 'bronze' | 'silver' | 'gold' | null
}