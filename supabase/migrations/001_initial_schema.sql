-- ============================================
-- apnicoding.com - COMPLETE SUPABASE MIGRATION
-- ============================================
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- Compatible with Supabase Free Tier (500MB DB, 2GB bandwidth)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  college_name TEXT,
  streak_count INTEGER DEFAULT 0,
  last_active_date DATE,
  total_xp INTEGER DEFAULT 0,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_markdown TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- Problems (coding challenges)
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starter_code TEXT,
  test_cases_json JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress (lesson completion)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Submissions (code execution results)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('AC', 'WA', 'TLE', 'CE', 'RE', 'pending')) DEFAULT 'pending',
  execution_time INTEGER DEFAULT 0,
  memory_used INTEGER DEFAULT 0,
  test_results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates (verified credentials)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals (ambassador program)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referee_id)
);

-- Challenge Progress (30-day challenge)
CREATE TABLE IF NOT EXISTS challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Assessment Questions (for final certificates)
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'coding')),
  question_text TEXT NOT NULL,
  options JSONB, -- for MCQ: [{text: "...", is_correct: true}]
  correct_answer TEXT, -- for coding: expected output pattern
  starter_code TEXT, -- for coding
  test_cases JSONB, -- for coding
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Assessment Attempts
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB, -- user's answers
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_problems_lesson_id ON problems(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user_id ON challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_course_id ON assessment_questions(course_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read for courses/lessons/problems
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published lessons" ON lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published problems" ON problems
  FOR SELECT USING (is_published = true);

-- User Progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Submissions policies
CREATE POLICY "Users can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates policies
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can verify certificates" ON certificates
  FOR SELECT USING (true);

-- Referrals policies
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can insert referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Challenge Progress policies
CREATE POLICY "Users can view own challenge progress" ON challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress" ON challenge_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress" ON challenge_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Assessment policies
CREATE POLICY "Anyone can view assessment questions" ON assessment_questions
  FOR SELECT USING (true);

CREATE POLICY "Users can view own attempts" ON assessment_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON assessment_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, college_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'college_name',
    NEW.raw_user_meta_data->>'username'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update user streak
CREATE OR REPLACE FUNCTION update_streak(user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_streak INTEGER;
  last_active DATE;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT streak_count, last_active_date
  INTO current_streak, last_active
  FROM users
  WHERE id = user_id;

  IF last_active IS NULL THEN
    UPDATE users SET streak_count = 1, last_active_date = today WHERE id = user_id;
  ELSIF last_active = today THEN
    RETURN;
  ELSIF last_active = today - INTERVAL '1 day' THEN
    UPDATE users SET streak_count = current_streak + 1, last_active_date = today WHERE id = user_id;
  ELSE
    UPDATE users SET streak_count = 1, last_active_date = today WHERE id = user_id;
  END IF;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Generate certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id(course_slug TEXT)
RETURNS TEXT AS $$
DECLARE
  cert_id TEXT;
  year TEXT := TO_CHAR(NOW(), 'YYYY');
  course_code TEXT := UPPER(SUBSTRING(course_slug FROM 1 FOR 2));
  random_part TEXT := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
BEGIN
  cert_id := 'CERT-' || year || '-' || course_code || '-' || random_part;
  RETURN cert_id;
END;
$$ language 'plpgsql';

-- Global Ambassador Leaderboard
CREATE OR REPLACE FUNCTION get_ambassador_leaderboard(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  college_name TEXT,
  referrals_count BIGINT,
  badge TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as user_id,
    u.full_name,
    u.college_name,
    COUNT(r.referee_id) as referrals_count,
    CASE
      WHEN COUNT(r.referee_id) >= 50 THEN 'gold'
      WHEN COUNT(r.referee_id) >= 20 THEN 'silver'
      WHEN COUNT(r.referee_id) >= 5 THEN 'bronze'
      ELSE NULL
    END as badge
  FROM users u
  LEFT JOIN referrals r ON u.id = r.referrer_id
  GROUP BY u.id, u.full_name, u.college_name
  HAVING COUNT(r.referee_id) > 0
  ORDER BY referrals_count DESC, u.full_name
  LIMIT limit_count;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- College Ambassador Leaderboard
CREATE OR REPLACE FUNCTION get_college_ambassador_leaderboard(college_name_param TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  college_name TEXT,
  referrals_count BIGINT,
  badge TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as user_id,
    u.full_name,
    u.college_name,
    COUNT(r.referee_id) as referrals_count,
    CASE
      WHEN COUNT(r.referee_id) >= 50 THEN 'gold'
      WHEN COUNT(r.referee_id) >= 20 THEN 'silver'
      WHEN COUNT(r.referee_id) >= 5 THEN 'bronze'
      ELSE NULL
    END as badge
  FROM users u
  LEFT JOIN referrals r ON u.id = r.referrer_id
  WHERE u.college_name = college_name_param
  GROUP BY u.id, u.full_name, u.college_name
  HAVING COUNT(r.referee_id) > 0
  ORDER BY referrals_count DESC, u.full_name
  LIMIT limit_count;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Verify Certificate
CREATE OR REPLACE FUNCTION verify_certificate(cert_id TEXT)
RETURNS TABLE (
  certificate_id TEXT,
  user_name TEXT,
  course_title TEXT,
  issue_date TIMESTAMPTZ,
  score INTEGER,
  verified BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.certificate_id,
    u.full_name as user_name,
    cr.title as course_title,
    c.issue_date,
    c.score,
    TRUE as verified
  FROM certificates c
  JOIN users u ON c.user_id = u.id
  JOIN courses cr ON c.course_id = cr.id
  WHERE c.certificate_id = cert_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Generate referral link
CREATE OR REPLACE FUNCTION get_user_referral_link(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  username TEXT;
  base_url TEXT := 'https://apnicoding.com';
BEGIN
  SELECT COALESCE(username, 'user' || SUBSTRING(id::TEXT FROM 1 FOR 8))
  INTO username
  FROM users
  WHERE id = user_id;

  RETURN base_url || '/join?ref=' || username;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_ambassador_leaderboard(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_college_ambassador_leaderboard(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_certificate(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_link(UUID) TO authenticated;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Courses
INSERT INTO courses (title, slug, description, icon, order_index) VALUES
('Python Programming', 'python', 'From basics to advanced: variables, loops, functions, OOP, data structures, and algorithms.', '🐍', 1),
('C++ Fundamentals', 'cpp', 'Master C++: memory management, STL, templates, OOP, and competitive programming techniques.', '⚙️', 2),
('JavaScript & TypeScript', 'javascript', 'Modern JS/TS: ES6+, async/await, DOM, TypeScript types, React fundamentals, and Node.js.', '📜', 3),
('Data Structures & Algorithms', 'dsa', 'Arrays, linked lists, trees, graphs, sorting, searching, DP, and 100+ LeetCode-style problems.', '🧮', 4),
('Java Programming', 'java', 'Core Java, OOP, collections, streams, multithreading, and Spring Boot basics.', '☕', 5),
('Go & Rust Systems', 'go-rust', 'Concurrency in Go, memory safety in Rust, systems programming, and backend development.', '🦀', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert Python Lessons (abbreviated - full content in seed_data.sql)
WITH python_course AS (SELECT id FROM courses WHERE slug = 'python')
INSERT INTO lessons (course_id, title, slug, content_markdown, order_index)
SELECT python_course.id, lesson_data.title, lesson_data.slug, lesson_data.content, lesson_data.order_index
FROM python_course,
(VALUES
  (1, 'Introduction to Python', 'introduction', '# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Why Python?
- **Easy to learn** - Clean syntax that reads like English
- **Versatile** - Web development, data science, AI, automation
- **Large community** - Extensive libraries and frameworks

## Your First Program
```python
print("Hello, World!")
```

**Output:**
```
Hello, World!
```', 1),
  (2, 'Variables and Types', 'variables-and-types', '# Variables and Data Types

Variables are containers for storing data values. In Python, you don''t need to declare the type.

```python
name = "Alice"
age = 25
height = 5.6
is_student = True
```', 2),
  (3, 'Control Flow: If Statements', 'control-flow-if', '# Control Flow: If Statements

```python
age = 18
if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")
```', 3),
  (4, 'Loops: For and While', 'loops', '# Loops: For and While

```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

count = 0
while count < 5:
    print(count)
    count += 1
```', 4)
) AS lesson_data(order_index, title, slug, content)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Sample Problems for Python
WITH python_lessons AS (SELECT id FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'python') AND slug IN ('variables-and-types', 'control-flow-if', 'loops'))
INSERT INTO problems (lesson_id, title, description, starter_code, test_cases_json, difficulty)
SELECT python_lessons.id, prob_data.title, prob_data.description, prob_data.starter_code, prob_data.test_cases, prob_data.difficulty
FROM python_lessons,
(VALUES
  ('variables-and-types', 'Hello World', 'Write a program that prints "Hello, World!" to the console.', 'print("Hello, World!")', '[{"input": "", "expected_output": "Hello, World!", "is_hidden": false, "explanation": "Simple print statement"}]', 'easy'),
  ('variables-and-types', 'Sum of Two Numbers', 'Read two integers from input and print their sum.', 'a = int(input())\nb = int(input())\nprint(a + b)', '[{"input": "5\n3", "expected_output": "8", "is_hidden": false}, {"input": "10\n20", "expected_output": "30", "is_hidden": false}, {"input": "-5\n3", "expected_output": "-2", "is_hidden": true}]', 'easy'),
  ('control-flow-if', 'Even or Odd', 'Given an integer, determine if it is even or odd.', 'n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', '[{"input": "4", "expected_output": "Even", "is_hidden": false}, {"input": "7", "expected_output": "Odd", "is_hidden": false}, {"input": "0", "expected_output": "Even", "is_hidden": true}]', 'easy'),
  ('loops', 'Sum of First N Numbers', 'Calculate the sum of first N natural numbers.', 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)', '[{"input": "5", "expected_output": "15", "is_hidden": false}, {"input": "10", "expected_output": "55", "is_hidden": false}, {"input": "100", "expected_output": "5050", "is_hidden": true}]', 'easy')
) AS prob_data(lesson_slug, title, description, starter_code, test_cases, difficulty)
ON CONFLICT DO NOTHING;

-- Sample Assessment Questions
WITH python_course AS (SELECT id FROM courses WHERE slug = 'python')
INSERT INTO assessment_questions (course_id, type, question_text, options, correct_answer, starter_code, test_cases, points, order_index)
SELECT python_course.id, q_data.type, q_data.question_text, q_data.options, q_data.correct_answer, q_data.starter_code, q_data.test_cases, q_data.points, q_data.order_index
FROM python_course,
(VALUES
  ('mcq', 'What is the output of `print(2 ** 3)`?', '[{"text": "6", "is_correct": false}, {"text": "8", "is_correct": true}, {"text": "9", "is_correct": false}, {"text": "5", "is_correct": false}]', '8', NULL, NULL, 10, 1),
  ('mcq', 'Which keyword defines a function in Python?', '[{"text": "func", "is_correct": false}, {"text": "def", "is_correct": true}, {"text": "function", "is_correct": false}, {"text": "define", "is_correct": false}]', 'def', NULL, NULL, 10, 2),
  ('coding', 'Write a function that returns the factorial of a number.', NULL, NULL, 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)', '[{"input": "5", "expected_output": "120"}, {"input": "0", "expected_output": "1"}, {"input": "3", "expected_output": "6"}]', 20, 3)
) AS q_data(type, question_text, options, correct_answer, starter_code, test_cases, points, order_index)
ON CONFLICT DO NOTHING;

-- ============================================
-- CRON JOB FOR DAILY CHALLENGE RESET
-- ============================================
-- This can be run via pg_cron or external cron
-- INSERT INTO cron.job (schedule, command) VALUES ('0 0 * * *', 'UPDATE users SET last_active_date = NULL WHERE last_active_date < CURRENT_DATE - INTERVAL ''1 day'';');