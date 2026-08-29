'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Award, 
  Download, 
  Share2, 
  ExternalLink,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { formatDate, generateCertificateId } from '@/lib/utils'
import Link from 'next/link'

interface Certificate {
  id: string
  certificate_id: string
  course_id: string
  issue_date: string
  score: number
  course: {
    title: string
    slug: string
    icon: string
  }
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('certificates')
        .select('*, course:courses(title, slug, icon)')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false })

      setCertificates(data || [])
      setLoading(false)
    }

    fetchCertificates()
  }, [])

  const handleDownload = async (cert: Certificate) => {
    setGenerating(cert.id)
    try {
      // Generate PDF certificate
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: cert.certificate_id }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${cert.certificate_id}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Failed to generate certificate:', err)
    } finally {
      setGenerating(null)
    }
  }

  const handleShare = (cert: Certificate) => {
    const verificationUrl = `${window.location.origin}/verify/${cert.certificate_id}`
    const text = `Excited to share that I just completed the ${cert.course.title} track on apnicoding.com and earned my verified credential! 🚀 Check out my certificate: ${verificationUrl}`
    
    if (navigator.share) {
      navigator.share({ title: 'My Certificate', text, url: verificationUrl })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  const handleLinkedIn = (cert: Certificate) => {
    const verificationUrl = `${window.location.origin}/verify/${cert.certificate_id}`
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course.title)}&organizationName=apnicoding.com&issueYear=${new Date(cert.issue_date).getFullYear()}&credentialId=${cert.certificate_id}&credentialUrl=${encodeURIComponent(verificationUrl)}`
    window.open(linkedInUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4 border-4 border-purple-400/20 rounded-full border-t-transparent" />
          <p className="text-gray-400">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Award className="h-8 w-8 text-yellow-400" />
          My Certificates
        </h1>
        <p className="text-gray-400 mt-1">Verified credentials you've earned</p>
      </div>

      {certificates.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center py-20">
          <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
            <CardContent className="p-12">
              <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No certificates yet</h2>
              <p className="text-gray-400 mb-6">Complete a course and pass the final assessment to earn your first verified certificate.</p>
              <Button asChild>
                <Link href="/learn">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card 
                key={cert.id} 
                className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
                
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Certificate ID</p>
                        <p className="font-mono text-sm text-white">{cert.certificate_id}</p>
                      </div>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{cert.course.icon}</span>
                      <h3 className="font-bold text-white">{cert.course.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400">Issued on {formatDate(cert.issue_date)}</p>
                    <p className="text-sm text-gray-400">Score: {cert.score}%</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 min-w-[120px] gap-1"
                      onClick={() => handleDownload(cert)}
                      disabled={generating === cert.id}
                    >
                      {generating === cert.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleShare(cert)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleLinkedIn(cert)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      asChild
                    >
                      <Link href={`/verify/${cert.certificate_id}`} target="_blank">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}