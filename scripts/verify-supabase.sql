-- VERIFICATION QUERIES FOR SUPABASE SETUP
-- Run these in your Supabase SQL Editor to check your database state

-- 1. Check if new columns exist on celebrities table
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'celebrities' 
AND column_name IN (
  'twitter_handle', 
  'instagram_handle', 
  'tiktok_handle', 
  'youtube_url',
  'view_count',
  'search_count',
  'last_viewed_at'
);

-- 2. Check if fan_mail_experiences table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'fan_mail_experiences';

-- 3. Check if fan_mail_address_stats view exists
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'fan_mail_address_stats';

-- 4. Check if John Pork exists
SELECT 
  id, 
  name, 
  slug, 
  twitter_handle, 
  instagram_handle,
  view_count
FROM celebrities 
WHERE slug = 'john-pork';

-- 5. Check total celebrity count
SELECT COUNT(*) as total_celebrities FROM celebrities;

-- 6. Check fan mail addresses for any celebrity
SELECT 
  id,
  celebrity_id,
  address,
  verified
FROM fan_mail_addresses 
LIMIT 5;
