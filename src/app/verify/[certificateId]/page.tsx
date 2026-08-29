import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { 
  Award, 
  CheckCircle, 
  Calendar, 
  Target, 
  Share2, 
  ExternalLink,
  QrCode,
} from 'lucide-react'
import Link from 'next/link'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ certificateId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: cert } = await supabase
    .from('certificates')
    .select('*, course:courses(title), user:users(full_name)')
    .eq('certificate_id', resolvedParams.certificateId)
    .single()

  if (!cert) {
    return { title: 'Certificate Not Found | apnicoding.com' }
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${cert.certificate_id}`

  return {
    title: `Verify Certificate: ${cert.certificate_id} | apnicoding.com`,
    description: `Verify the authenticity of ${cert.user?.full_name}'s ${cert.course?.title} certificate. Credential ID: ${cert.certificate_id}`,
    openGraph: {
      title: `Certificate Verification: ${cert.certificate_id}`,
      description: `${cert.user?.full_name} - ${cert.course?.title} - Score: ${cert.score}%`,
      type: 'website',
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/api/og?type=certificate&cert=${cert.certificate_id}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Certificate Verification: ${cert.certificate_id}`,
      description: `${cert.user?.full_name} - ${cert.course?.title}`,
    },
  }
}

export default async function VerifyPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()

  const { data: cert } = await supabase
    .from('certificates')
    .select('*, course:courses(title, slug, icon), user:users(full_name)')
    .eq('certificate_id', resolvedParams.certificateId)
    .single()

  if (!cert) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h1>
          <p className="text-gray-400 mb-6">
            The certificate <code className="bg-gray-800 px-2 py-1 rounded font-mono">{resolvedParams.certificateId}</code> does not exist or has been revoked.
          </p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${cert.certificate_id}`

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400/50 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
          
          <div className="relative p-10 text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="text-8xl mb-4">🏆</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
              <p className="text-gray-600">Verified Credential</p>
            </div>

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8 rounded-full" />

            {/* Recipient */}
            <div className="mb-8">
              <p className="text-gray-500 mb-2">This certifies that</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{cert.user?.full_name || 'Student'}</h2>
              <p className="text-gray-500 mb-2">has successfully completed</p>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                <span className="text-3xl inline-block mr-2">{cert.course?.icon}</span>
                {cert.course?.title}
              </h3>
              <p className="text-gray-600">with a score of <strong className="text-green-600">{cert.score}%</strong></p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Credential ID</p>
                <p className="font-mono font-bold text-gray-900 text-sm">{cert.certificate_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="font-medium text-gray-900">{formatDate(cert.issue_date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p className="flex items-center justify-center gap-1 text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center justify-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <QRCode 
                  value={verificationUrl} 
                  size={100} 
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">Scan to verify</p>
                <p className="text-xs text-gray-400 font-mono">{verificationUrl}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Official apnicoding.com Certificate</span>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>apnicoding.com</p>
                <p>verify.apnicoding.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button 
            variant="outline" 
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white hover:from-purple-700 hover:to-pink-700"
            onClick={() => {
              const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course?.title || '')}&organizationName=apnicoding.com&issueYear=${new Date(cert.issue_date).getFullYear()}&credentialId=${cert.certificate_id}&credentialUrl=${encodeURIComponent(verificationUrl)}`
              window.open(linkedInUrl, '_blank')
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Add to LinkedIn Profile
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              const text = `Excited to share that I just completed the ${cert.course?.title} track on apnicoding.com and earned my verified credential! 🚀 Check out my certificate: ${verificationUrl}`
              navigator.clipboard.writeText(text)
              alert('Copied to clipboard! Share on LinkedIn.')
            }}
          >
            <Share2 className="h-4 w-4" />
            Share on LinkedIn
          </Button>

          <Button 
            variant="ghost" 
            className="gap-2"
            asChild
          >
            <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open Verification Page
            </a>
          </Button>
        </div>

        {/* Skills */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-400" />
            Skills Demonstrated
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Problem Solving', 'Algorithmic Thinking', cert.course?.title.split(' ')[0], 'Code Optimization'].map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-gray-800 border-gray-700">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-500 hover:text-purple-400 transition-colors">
            ← Back to apnicoding.com
          </Link>
        </div>
      </div>
    </div>
  )
}