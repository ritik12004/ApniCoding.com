# ============================================
# ZERO-COST PRODUCTION DEPLOYMENT CHECKLIST
# ============================================
# apnicoding.com - Complete Free Tier Deployment

# ============================================
# PRE-DEPLOYMENT REQUIREMENTS
# ============================================
# ✅ GitHub/GitLab/Bitbucket account
# ✅ Vercel account (free tier)
# ✅ Supabase account (free tier)
# ✅ Domain registrar (Namecheap, Cloudflare, etc.) - optional

# ============================================
# SUPABASE SETUP (5-10 minutes)
# ============================================
# 1. Create project at https://supabase.com/dashboard
#    - Organization: Personal
#    - Name: apnicoding
#    - Region: Closest to users (e.g., us-east-1)
#    - Password: Generate strong password (save it!)

# 2. Run SQL Migration
#    - Go to SQL Editor
#    - Copy/paste supabase/migrations/001_initial_schema.sql
#    - Click "Run"
#    - Verify tables in Table Editor

# 3. Configure Authentication
#    - Authentication > Providers > Email: Enable
#    - Authentication > Providers > Google: Enable
#      - Client ID/Secret from Google Cloud Console
#      - Authorized redirect: https://your-project.supabase.co/auth/v1/callback
#    - Authentication > URL Configuration:
#      - Site URL: https://yourdomain.com
#      - Redirect URLs: https://yourdomain.com/auth/callback

# 4. Get API Keys
#    - Settings > API
#    - Copy: Project URL, anon/public key, service_role key

# 5. Enable Realtime (optional)
#    - Database > Replication > Enable for: users, submissions, certificates

# ============================================
# VERCEL DEPLOYMENT (2-5 minutes)
# ============================================
# 1. Push to GitHub
#    git init
#    git add .
#    git commit -m "Initial commit"
#    git remote add origin https://github.com/username/apnicoding.com
#    git push -u origin main

# 2. Import to Vercel
#    - https://vercel.com/new
#    - Import Git Repository
#    - Select repository
#    - Framework: Next.js (auto-detected)
#    - Root Directory: ./

# 3. Configure Environment Variables
#    Settings > Environment Variables (add ALL from .env.production.example):
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
#    - PISTON_API_URL
#    - NEXT_PUBLIC_SITE_URL (use Vercel URL first, update after domain)
#    - NEXT_PUBLIC_APP_NAME

# 4. Deploy
#    - Click Deploy
#    - Wait for build (2-3 minutes)
#    - Test at https://your-project.vercel.app

# ============================================
# CUSTOM DOMAIN (5-30 minutes)
# ============================================
# 1. Vercel > Settings > Domains > Add
#    - Enter: yourdomain.com
#    - Add www.yourdomain.com too

# 2. DNS Configuration (at registrar/Cloudflare)
#    A     @       76.76.21.21
#    CNAME www     cname.vercel-dns.com

# 3. Update Environment Variable
#    NEXT_PUBLIC_SITE_URL=https://yourdomain.com
#    Redeploy

# ============================================
# POST-DEPLOYMENT VERIFICATION
# ============================================
# □ Landing page loads at https://yourdomain.com
# □ Sign up with email works
# □ Google OAuth works
# □ Dashboard accessible after login
# □ Course browsing works
# □ Lesson content renders (Markdown + syntax highlighting)
# □ Try It Yourself executes code
# □ IDE opens at /ide/problem-id
# □ Code execution works (Piston API)
# □ Test cases pass/fail correctly
# □ 30-Day Challenge accessible
# □ Leaderboards show data
# □ Certificate generation works
# □ Verification page loads at /verify/CERT-XXXX
# □ LinkedIn buttons work
# □ Referral links generate
# □ Ambassador portal loads
# □ Sitemap.xml accessible
# □ Robots.txt accessible
# □ OG images generate at /api/og?type=certificate&cert=CERT-XXXX

# ============================================
# FREE TIER LIMITS & MONITORING
# ============================================
# VERCEL (Hobby/Free):
# - 100GB bandwidth/month
# - 100GB-hours serverless execution
# - 1000 serverless function invocations/day
# - 100GB Edge Network
# - Custom domains: Unlimited

# SUPABASE (Free):
# - 500MB Database
# - 2GB Bandwidth/month
# - 50,000 MAU (Monthly Active Users)
# - 50MB File Storage
# - 1M Realtime messages/month

# PISTON API (Public):
# - Rate limited (30 req/min/IP)
# - 30s execution timeout
# - 100MB memory limit

# MONITORING SETUP:
# - Vercel Analytics: Auto-enabled
# - Vercel Speed Insights: Auto-enabled
# - Supabase Logs: Dashboard > Logs
# - Error tracking: Add SENTRY_DSN if needed

# ============================================
# SCALING BEYOND FREE TIER
# ============================================
# When to upgrade:
# - Vercel: >100GB bandwidth or >1000 invocations/day
# - Supabase: >500MB DB or >50k MAU
# - Piston: Need dedicated instances for lower latency

# Upgrade path:
# 1. Vercel Pro ($20/mo): 1TB bandwidth, unlimited functions
# 2. Supabase Pro ($25/mo): 8GB DB, 250GB bandwidth, 100k MAU
# 3. Self-host Piston: Docker on Railway/Render ($5-10/mo)

# ============================================
# BACKUP STRATEGY
# ============================================
# Supabase: Automatic daily backups (7-day retention on free)
# Manual backup: pg_dump via Supabase CLI
# Code: GitHub is primary backup
# Environment: Store .env.production in 1Password/Bitwarden

# ============================================
# SECURITY CHECKLIST
# ============================================
# □ RLS enabled on all tables
# □ Service role key only in server-side env
# □ Anon key only in client-side env
# □ CORS configured for your domain only
# □ CSP headers configured
# □ Rate limiting on API routes
# □ Input validation on all forms
# □ SQL injection prevention (parameterized queries via Supabase)
# □ XSS prevention (React auto-escapes)
# □ CSRF protection (SameSite cookies)

# ============================================
# EMERGENCY ROLLBACK
# ============================================
# Vercel: Deployments > Previous deployment > Promote to Production
# Supabase: Point-in-time recovery (Pro only) or manual pg_restore
# DNS: TTL 300s for quick switching