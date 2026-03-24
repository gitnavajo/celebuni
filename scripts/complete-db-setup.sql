-- CELEBUNI COMPLETE DATABASE SETUP FOR EMPTY PROJECT
-- Copy and paste ALL of this into Supabase SQL Editor and run it once
-- This sets up the complete schema with all new features

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'celebrity_category') THEN
    CREATE TYPE public.celebrity_category AS ENUM ('actor', 'voice_actor', 'musician');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appearance_type') THEN
    CREATE TYPE public.appearance_type AS ENUM ('con', 'panel', 'photo_op');
  END IF;
END $$;

-- ============================================================================
-- BASE TABLES
-- ============================================================================

-- Celebrities table with new social media and tracking columns
CREATE TABLE IF NOT EXISTS public.celebrities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  image_url TEXT,
  official_url TEXT,
  tmdb_id INTEGER UNIQUE,
  category public.celebrity_category NOT NULL,
  
  -- NEW: Social media handles
  twitter_handle TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_channel TEXT,
  youtube_url TEXT,
  
  -- NEW: Activity tracking
  view_count INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id UUID NOT NULL REFERENCES public.celebrities(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date DATE,
  location TEXT,
  type public.appearance_type NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fan_mail_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id UUID NOT NULL REFERENCES public.celebrities(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  published_at TIMESTAMPTZ,
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NEW: Fan Mail Experiences tracking table
CREATE TABLE IF NOT EXISTS public.fan_mail_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id UUID NOT NULL REFERENCES public.celebrities(id) ON DELETE CASCADE,
  fan_mail_address_id UUID NOT NULL REFERENCES public.fan_mail_addresses(id) ON DELETE CASCADE,
  user_fingerprint TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received_reply', 'no_reply', 'bounced', 'other')),
  received_reply BOOLEAN DEFAULT FALSE,
  reply_rating INTEGER CHECK (reply_rating >= 1 AND reply_rating <= 5),
  date_sent TIMESTAMPTZ,
  date_replied_at TIMESTAMPTZ,
  days_to_reply INTEGER,
  notes TEXT,
  helpful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Celebrities indexes
CREATE INDEX IF NOT EXISTS celebrities_name_idx ON public.celebrities USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS celebrities_slug_idx ON public.celebrities (slug);
CREATE INDEX IF NOT EXISTS celebrities_official_url_idx ON public.celebrities (official_url);
CREATE INDEX IF NOT EXISTS idx_celebrities_view_count ON public.celebrities(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_celebrities_search_count ON public.celebrities(search_count DESC);

-- Relationships
CREATE INDEX IF NOT EXISTS appearances_celebrity_id_idx ON public.appearances (celebrity_id);
CREATE INDEX IF NOT EXISTS fan_mail_addresses_celebrity_id_idx ON public.fan_mail_addresses (celebrity_id);

-- Fan mail experiences
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_celebrity ON public.fan_mail_experiences(celebrity_id);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_address ON public.fan_mail_experiences(fan_mail_address_id);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_created ON public.fan_mail_experiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_status ON public.fan_mail_experiences(status);

-- Blog indexes
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts (published_at DESC NULLS LAST);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- NEW: Aggregated fan mail statistics view
CREATE OR REPLACE VIEW public.fan_mail_address_stats AS
SELECT 
  fa.id,
  fa.celebrity_id,
  fa.address,
  COUNT(fme.id) as total_reports,
  SUM(CASE WHEN fme.received_reply = TRUE THEN 1 ELSE 0 END)::FLOAT / 
    NULLIF(COUNT(fme.id), 0) * 100 as success_rate,
  AVG(CASE WHEN fme.days_to_reply > 0 THEN fme.days_to_reply ELSE NULL END)::INT as avg_days_to_reply,
  AVG(fme.reply_rating)::NUMERIC(3,2) as avg_rating,
  MAX(fme.created_at) as last_report_date
FROM public.fan_mail_addresses fa
LEFT JOIN public.fan_mail_experiences fme ON fa.id = fme.fan_mail_address_id
GROUP BY fa.id, fa.celebrity_id, fa.address;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_mail_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_mail_experiences ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
DROP POLICY IF EXISTS "public read celebrities" ON public.celebrities;
CREATE POLICY "public read celebrities"
ON public.celebrities
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "public read appearances" ON public.appearances;
CREATE POLICY "public read appearances"
ON public.appearances
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "public read fan mail" ON public.fan_mail_addresses;
CREATE POLICY "public read fan mail"
ON public.fan_mail_addresses
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "public read blog posts" ON public.blog_posts;
CREATE POLICY "public read blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "public read fan mail experiences" ON public.fan_mail_experiences;
CREATE POLICY "public read fan mail experiences"
ON public.fan_mail_experiences
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anonymous inserts to fan_mail_experiences (for users submitting feedback)
DROP POLICY IF EXISTS "anon insert fan mail experiences" ON public.fan_mail_experiences;
CREATE POLICY "anon insert fan mail experiences"
ON public.fan_mail_experiences
FOR INSERT
TO anon
WITH CHECK (true);
