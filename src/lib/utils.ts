import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateCertificateId(courseSlug: string): string {
  const year = new Date().getFullYear()
  const courseCode = courseSlug.substring(0, 2).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CERT-${year}-${courseCode}-${randomPart}`
}

export function getLanguageConfig(language: string) {
  const configs: Record<string, { pistonLang: string; pistonVersion: string; monacoLang: string }> = {
    python: { pistonLang: 'python', pistonVersion: '3.10.0', monacoLang: 'python' },
    javascript: { pistonLang: 'javascript', pistonVersion: '18.15.0', monacoLang: 'javascript' },
    typescript: { pistonLang: 'typescript', pistonVersion: '5.0.3', monacoLang: 'typescript' },
    cpp: { pistonLang: 'cpp', pistonVersion: '10.2.0', monacoLang: 'cpp' },
    c: { pistonLang: 'c', pistonVersion: '10.2.0', monacoLang: 'c' },
    java: { pistonLang: 'java', pistonVersion: '15.0.2', monacoLang: 'java' },
    go: { pistonLang: 'go', pistonVersion: '1.16.2', monacoLang: 'go' },
    rust: { pistonLang: 'rust', pistonVersion: '1.68.2', monacoLang: 'rust' },
  }
  return configs[language] || configs.python
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    medium: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    hard: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  }
  return colors[difficulty] || colors.easy
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AC: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    WA: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    TLE: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    CE: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    RE: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30',
    pending: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
  }
  return colors[status] || colors.pending
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AC: 'Accepted',
    WA: 'Wrong Answer',
    TLE: 'Time Limit Exceeded',
    CE: 'Compilation Error',
    RE: 'Runtime Error',
    pending: 'Pending',
  }
  return labels[status] || status
}

export function calculateStreak(lastActiveDate: string | null): number {
  if (!lastActiveDate) return 0
  const lastActive = new Date(lastActiveDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 1 ? diffDays : 0
}

export function getBadgeFromReferrals(count: number): 'bronze' | 'silver' | 'gold' | null {
  if (count >= 50) return 'gold'
  if (count >= 20) return 'silver'
  if (count >= 5) return 'bronze'
  return null
}

export function getReferralLink(username: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/join?ref=${username}`
}

export const LANGUAGES = [
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'cpp', name: 'C++', icon: '⚙️' },
  { id: 'c', name: 'C', icon: '🔧' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
] as const

export const THEMES = [
  { id: 'vs-dark', name: 'VS Dark' },
  { id: 'vs-light', name: 'VS Light' },
  { id: 'hc-black', name: 'High Contrast' },
] as const