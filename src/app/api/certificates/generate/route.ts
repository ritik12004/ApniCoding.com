import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { certificateId } = await request.json()

    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 })
    }

    // Fetch certificate details
    const { data: cert, error } = await supabase
      .from('certificates')
      .select('*, course:courses(title), user:users(full_name)')
      .eq('certificate_id', certificateId)
      .single()

    if (error || !cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    // Generate HTML for PDF
    const html = generateCertificateHTML(cert)
    
    // For now, return HTML - in production you'd use puppeteer or similar
    // This is a simplified version that returns HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${certificateId}.html"`,
      },
    })
  } catch (err) {
    console.error('Certificate generation error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

function generateCertificateHTML(cert: any) {
  const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${cert.certificate_id}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate - ${cert.certificate_id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #f5f5f5; padding: 40px; }
    .certificate {
      max-width: 800px; margin: 0 auto; background: white; 
      border: 8px solid #fbbf24; border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      position: relative; overflow: hidden;
    }
    .certificate::before {
      content: ''; position: absolute; top: -50%; left: -50%; 
      width: 200%; height: 200%; 
      background: radial-gradient(circle, #fef3c7 0%, transparent 70%);
      opacity: 0.3; pointer-events: none;
    }
    .header { text-align: center; padding: 40px 40px 20px; position: relative; z-index: 1; }
    .logo { font-size: 48px; margin-bottom: 20px; }
    .title { font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .subtitle { font-size: 18px; color: #6b7280; font-style: italic; }
    .divider { 
      width: 100px; height: 3px; background: linear-gradient(90deg, #a855f7, #ec4899); 
      margin: 30px auto; border-radius: 2px;
    }
    .content { padding: 0 60px 40px; position: relative; z-index: 1; }
    .recipient { font-size: 28px; font-weight: bold; color: #1f2937; text-align: center; margin: 30px 0; }
    .course { font-size: 20px; color: #374151; text-align: center; margin-bottom: 10px; }
    .details { display: flex; justify-content: space-around; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .detail { text-align: center; }
    .detail-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
    .detail-value { font-size: 16px; font-weight: bold; color: #1f2937; margin-top: 4px; }
    .footer { padding: 20px 40px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .verify { font-size: 12px; color: #9ca3af; }
    .verify a { color: #a855f7; text-decoration: none; }
    .signature { text-align: right; }
    .sig-line { width: 200px; height: 1px; background: #9ca3af; margin: 0 auto 8px 0; }
    .sig-text { font-size: 12px; color: #9ca3af; }
    .badge { 
      position: absolute; bottom: 20px; right: 20px; 
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white; padding: 12px 20px; border-radius: 50px;
      font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
    }
    @media print {
      body { background: none; padding: 0; }
      .certificate { box-shadow: none; border: 8px solid #fbbf24; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">🏆</div>
      <h1 class="title">Certificate of Completion</h1>
      <p class="subtitle">This certifies that</p>
    </div>
    <div class="divider"></div>
    <div class="content">
      <div class="recipient">${cert.user?.full_name || 'Student'}</div>
      <p class="course">has successfully completed the</p>
      <div class="recipient" style="font-size: 24px; color: #a855f7;">${cert.course?.title}</div>
      <p class="course">with a score of <strong>${cert.score}%</strong></p>
      
      <div class="details">
        <div class="detail">
          <div class="detail-label">Credential ID</div>
          <div class="detail-value" style="font-family: monospace; font-size: 12px;">${cert.certificate_id}</div>
        </div>
        <div class="detail">
          <div class="detail-label">Issue Date</div>
          <div class="detail-value">${issueDate}</div>
        </div>
        <div class="detail">
          <div class="detail-label">Verification</div>
          <div class="detail-value" style="font-size: 12px;">Verified ✓</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="verify">
        Verify at: <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
      </div>
      <div class="signature">
        <div class="sig-line"></div>
        <div class="sig-text">apnicoding.com</div>
      </div>
    </div>
    <div class="badge">VERIFIED</div>
  </div>
</body>
</html>
  `
}