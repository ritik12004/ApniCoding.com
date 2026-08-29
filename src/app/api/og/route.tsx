import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'default'
  const title = searchParams.get('title') || 'apnicoding.com'
  const description = searchParams.get('description') || 'Master Programming. Earn Verified Certificates.'
  const course = searchParams.get('course')
  const cert = searchParams.get('cert')

  let content: React.ReactElement

  if (type === 'certificate' && cert) {
    content = (
      <div style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #030712 0%, #1a1a2e 100%)',
        padding: 80,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{
          background: 'white',
          border: '4px solid #fbbf24',
          borderRadius: 16,
          padding: 60,
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: 800,
        }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>🏆</div>
          <h1 style={{ 
            fontSize: 48, 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: 16 
          }}>
            Certificate Verified
          </h1>
          <p style={{ 
            fontSize: 24, 
            color: '#6b7280', 
            marginBottom: 32 
          }}>
            {cert}
          </p>
          <div style={{
            width: 100,
            height: 4,
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            margin: '24px auto',
            borderRadius: 2,
          }} />
          <p style={{ 
            fontSize: 18, 
            color: '#9ca3af' 
          }}>
            Verified at apnicoding.com
          </p>
        </div>
      </div>
    )
  } else if (course) {
    content = (
      <div style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #030712 0%, #1a1a2e 100%)',
        padding: 80,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 800,
        }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🚀</div>
          <h1 style={{ 
            fontSize: 56, 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: 16,
            background: 'linear-gradient(90deg, #a855f7, #ec4899, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {course}
          </h1>
          <p style={{ 
            fontSize: 28, 
            color: '#9ca3af', 
            marginBottom: 32,
            maxWidth: 600,
          }}>
            Learn with interactive tutorials, practice in a professional IDE, and earn verified certificates.
          </p>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <span style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid #a855f7',
              color: '#c084fc',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>Free Certificate</span>
            <span style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22c55e',
              color: '#4ade80',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>Interactive IDE</span>
            <span style={{
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid #f97316',
              color: '#fb923c',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>30-Day Challenge</span>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#9ca3af' }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <span style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>apnicoding.com</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: 16 }}>
            Master Programming. Earn Verified Certificates.
          </div>
        </div>
      </div>
    )
  } else {
    content = (
      <div style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #030712 0%, #1a1a2e 50%, #0f172a 100%)',
        padding: 80,
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 800,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            marginBottom: 32 
          }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}>💻</div>
            <span style={{ 
              fontSize: 42, 
              fontWeight: 'bold', 
              color: 'white' 
            }}>
              apnicoding.com
            </span>
          </div>
          <h1 style={{ 
            fontSize: 52, 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            {title}
          </h1>
          <p style={{ 
            fontSize: 24, 
            color: '#9ca3af', 
            marginBottom: 40,
            maxWidth: 600,
          }}>
            {description}
          </p>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <span style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid #a855f7',
              color: '#c084fc',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>🐍 Python</span>
            <span style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>📜 JavaScript</span>
            <span style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22c55e',
              color: '#4ade80',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>⚙️ C++</span>
            <span style={{
              background: 'rgba(249, 115, 22, 0.2)',
              border: '1px solid #f97316',
              color: '#fb923c',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 16,
            }}>🧮 DSA</span>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#9ca3af' }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <span style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>apnicoding.com</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: 16 }}>
            Master Programming. Earn Verified Certificates.
          </div>
        </div>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
      </div>
    )
  }

  return new ImageResponse(content, {
    width: 1200,
    height: 630,
  })
}