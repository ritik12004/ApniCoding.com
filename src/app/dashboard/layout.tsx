'use client'

import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}