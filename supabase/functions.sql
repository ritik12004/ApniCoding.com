-- Additional Supabase Functions
-- Run this in Supabase SQL Editor after schema.sql

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_streak(user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_streak INTEGER;
  last_active DATE;
  today DATE := CURRENT_DATE;
BEGIN
  -- Get current streak and last active date
  SELECT streak_count, last_active_date
  INTO current_streak, last_active
  FROM users
  WHERE id = user_id;

  IF last_active IS NULL THEN
    -- First activity
    UPDATE users SET streak_count = 1, last_active_date = today WHERE id = user_id;
  ELSIF last_active = today THEN
    -- Already active today, do nothing
    RETURN;
  ELSIF last_active = today - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE users SET streak_count = current_streak + 1, last_active_date = today WHERE id = user_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE users SET streak_count = 1, last_active_date = today WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get global ambassador leaderboard
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get college ambassador leaderboard
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify certificate
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's referral link
CREATE OR REPLACE FUNCTION get_user_referral_link(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  username TEXT;
  base_url TEXT := 'https://apnicoding.com'; -- Update with actual domain
BEGIN
  SELECT COALESCE(raw_user_meta_data->>'username', 'user' || SUBSTRING(id::TEXT FROM 1 FOR 8))
  INTO username
  FROM auth.users
  WHERE id = user_id;
  
  RETURN base_url || '/join?ref=' || username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_ambassador_leaderboard(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_college_ambassador_leaderboard(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_certificate(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_link(UUID) TO authenticated;