# apnicoding.com - Full-Stack Ed-Tech Platform

A production-ready, full-stack ed-tech platform combining W3Schools-style structured tutorials, LeetCode/CodeChef-style online IDE & problem solving, automated verifiable certificates, and built-in viral growth/gamification features.

## 🚀 Features

### 📚 Interactive Learning Hub
- **Structured Courses**: Python, C++, JavaScript, Java, Data Structures & Algorithms, Go/Rust
- **W3Schools-style Tutorials**: Markdown-based lessons with syntax highlighting
- **Interactive "Try it Yourself"**: Live Monaco Editor sandboxes in lessons
- **Progress Tracking**: Persistent progress with Supabase

### 💻 Professional Online IDE
- **Split-screen Workspace**: Problem statement + Monaco Editor
- **Multi-language Support**: Python, JavaScript, TypeScript, C++, C, Java, Go, Rust
- **Real-time Execution**: Piston API integration for code running
- **Automated Test Runner**: AC/WA/TLE/CE verdicts with hidden test cases

### 🏆 Gamification & Challenges
- **30-Day Coding Challenge**: Daily problems unlock every 24 hours
- **Streak Tracking**: Fire streak counter with GitHub-style heatmap
- **Global & College Leaderboards**: Compete by streak and problems solved
- **Achievement Badges**: Bronze, Silver, Gold milestones

### 📜 Verified Certificates
- **Final Assessments**: MCQ + coding challenges at 100% course completion
- **PDF Certificates**: Unique credential IDs, QR codes, signatures
- **Public Verification**: `/verify/[certificateId]` accessible without login
- **LinkedIn Integration**: One-click "Add to Profile" and "Share on Feed"

### 👥 Campus Ambassador Program
- **Referral System**: Unique links (`/join?ref=USERNAME`)
- **College Leaderboards**: Top referrers by institution
- **Milestone Rewards**: Exclusive badges, Discord roles, swag

### 🔐 Authentication & Security
- **Supabase Auth**: Email/Password + Google OAuth
- **Row Level Security**: All data protected with RLS policies
- **Secure Sessions**: JWT-based with automatic refresh

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Editor** | Monaco Editor (@monaco-editor/react) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Code Execution** | Piston API (emkc.org) |
| **State Management** | Zustand + TanStack Query |
| **PDF Generation** | jsPDF + html2canvas |
| **QR Codes** | qrcode.react |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

## 📁 Project Structure

```
apnicoding.com/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── execute/       # Code execution endpoint
│   │   │   ├── certificates/  # Certificate generation
│   │   │   └── og/            # Dynamic OG images
│   │   ├── auth/              # Auth pages (login, signup, callback)
│   │   ├── dashboard/         # User dashboard
│   │   ├── learn/             # Course/lesson pages
│   │   ├── ide/               # Online IDE
│   │   ├── challenge/         # 30-day challenge
│   │   ├── ambassador/        # Ambassador portal
│   │   ├── leaderboard/       # Global/college leaderboards
│   │   └── verify/            # Certificate verification
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── landing/           # Landing page sections
│   │   ├── learning/          # Learning components (Markdown, TryIt)
│   │   ├── dashboard/         # Dashboard components
│   │   └── ...
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── database.ts        # TypeScript types
├── supabase/
│   ├── schema.sql             # Database schema
│   ├── seed.sql               # Sample data
│   └── functions.sql          # RPC functions
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- (Optional) Piston API for local code execution

### Installation

1. **Clone and install dependencies**
```bash
cd apnicoding.com
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Configure Supabase**
- Create a new Supabase project
- Run `supabase/schema.sql` in SQL Editor
- Run `supabase/functions.sql` for RPC functions
- Run `supabase/seed.sql` for sample data
- Enable Email/Password and Google OAuth in Auth settings
- Configure RLS policies (already in schema)

4. **Run development server**
```bash
npm run dev
```

5. **Open http://localhost:3000**

## 🗄 Database Schema

Key tables:
- `users` - Extended profile with streak, college
- `courses` - Course metadata
- `lessons` - Tutorial content with Markdown
- `problems` - Coding challenges with test cases
- `user_progress` - Lesson completion tracking
- `submissions` - Code submissions with verdicts
- `certificates` - Verified credentials
- `referrals` - Ambassador referrals
- `challenge_progress` - 30-day challenge tracking

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/execute` | POST | Execute code via Piston API |
| `/api/certificates/generate` | POST | Generate PDF certificate |
| `/api/og` | GET | Dynamic OG image generation |

## 🎨 Customization

### Themes
Edit `src/app/globals.css` for custom color schemes.

### Courses
Add courses via Supabase dashboard or extend `seed.sql`.

### Languages
Add languages in `src/lib/utils.ts` in the `LANGUAGES` array and `getLanguageConfig` function.

## 📦 Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

- All database access via RLS policies
- API routes validate authentication
- Input sanitization on all user inputs
- Rate limiting on code execution endpoint
- Secure headers via Next.js

## 📈 Performance

- Next.js Server Components for fast initial loads
- TanStack Query for client-side caching
- Optimized images and fonts
- Code splitting by route
- Edge-ready deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Piston API](https://github.com/engineer-man/piston) for code execution
- [Supabase](https://supabase.com/) for backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons

---

Built with ❤️ for developers everywhere. Happy coding! 🚀