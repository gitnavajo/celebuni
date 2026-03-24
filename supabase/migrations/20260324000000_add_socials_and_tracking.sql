-- Add social media handles and view tracking to celebrities table
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS twitter_handle TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS tiktok_handle TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS youtube_channel TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS search_count INTEGER DEFAULT 0;
ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Create index on view_count for quick trending queries
CREATE INDEX IF NOT EXISTS idx_celebrities_view_count ON celebrities(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_celebrities_search_count ON celebrities(search_count DESC);
