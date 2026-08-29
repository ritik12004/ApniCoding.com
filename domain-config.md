# ============================================
# DOMAIN & SSL CONFIGURATION
# ============================================
# Production deployment with custom domain on Vercel

# ============================================
# VERCEL CUSTOM DOMAIN SETUP
# ============================================
# 1. Go to Vercel Dashboard > Project > Settings > Domains
# 2. Add your domain (e.g., apnicoding.com)
# 3. Configure DNS records as shown:
#
# Type    Name    Value
# A       @       76.76.21.21          (Vercel IP)
# CNAME   www     cname.vercel-dns.com
#
# Or use Vercel nameservers:
# ns1.vercel-dns.com
# ns2.vercel-dns.com

# ============================================
# ENVIRONMENT VARIABLES FOR CUSTOM DOMAIN
# ============================================
# Add to Vercel Project Settings > Environment Variables
#
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# NEXT_PUBLIC_APP_NAME=apnicoding.com
#
# Supabase URLs (from Supabase Dashboard)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ============================================
# SSL/TLS CONFIGURATION
# ============================================
# Vercel automatically provisions SSL certificates via Let's Encrypt
# - Automatic renewal every 90 days
# - HTTP/2 and HTTP/3 enabled by default
# - HSTS header automatically added
#
# To enforce HTTPS in middleware.ts:
# export function middleware(request: NextRequest) {
#   if (request.headers.get('x-forwarded-proto') === 'http') {
#     return NextResponse.redirect(
#       new URL(request.url.replace('http://', 'https://'))
#     );
#   }
# }

# ============================================
# CONTENT SECURITY POLICY (CSP)
# ============================================
# Add to next.config.ts or middleware.ts
#
# const cspHeader = `
#   default-src 'self';
#   script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
#   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
#   font-src 'self' https://fonts.gstatic.com;
#   img-src 'self' data: https: blob:;
#   connect-src 'self' https://*.supabase.co https://emkc.org;
#   frame-ancestors 'none';
#   base-uri 'self';
#   form-action 'self';
# `
#
# Headers:
# Content-Security-Policy: ${cspHeader.replace(/\s+/g, ' ').trim()}

# ============================================
# SUBRESOURCE INTEGRITY (SRI)
# ============================================
# For external scripts (Monaco Editor CDN)
# <script
#   src="https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs/loader.js"
#   integrity="sha384-..."
#   crossorigin="anonymous">
# </script>

# ============================================
# DNS CONFIGURATION TEMPLATE
# ============================================
# Cloudflare DNS (recommended for free DDoS protection)
#
# Type    Name    Content                    Proxy   TTL
# A       @       76.76.21.21              Proxied Auto
# CNAME   www     cname.vercel-dns.com     Proxied Auto
# TXT     @       vercel-verification=...  DNS Only Auto
#
# Cloudflare Page Rules:
# 1. yourdomain.com/* -> Always Use HTTPS
# 2. yourdomain.com/api/* -> Cache Level: Bypass
# 3. yourdomain.com/_next/* -> Cache Level: Cache Everything, Edge TTL: 1 year

# ============================================
# PERFORMANCE OPTIMIZATIONS
# ============================================
# next.config.ts optimizations:
#
# const nextConfig = {
#   images: {
#     domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
#     formats: ['image/avif', 'image/webp'],
#   },
#   compress: true,
#   poweredByHeader: false,
#   reactStrictMode: true,
#   swcMinify: true,
#   experimental: {
#     optimizeCss: true,
#   },
# }

# ============================================
# MONITORING & ALERTING
# ============================================
# Vercel Analytics (free): Auto-enabled
# Vercel Speed Insights (free): Auto-enabled
# Sentry (free tier): DSN in SENTRY_DSN env var
# LogRocket (free tier): For session replay