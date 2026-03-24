-- Create fan_mail_experiences table for tracking user feedback on fan mail addresses
CREATE TABLE IF NOT EXISTS fan_mail_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id UUID NOT NULL REFERENCES celebrities(id) ON DELETE CASCADE,
  fan_mail_address_id UUID NOT NULL REFERENCES fan_mail_addresses(id) ON DELETE CASCADE,
  user_fingerprint TEXT NOT NULL, -- Hashed/fingerprinted user identifier (IP + user agent hash)
  
  -- Experience tracking fields
  status TEXT NOT NULL CHECK (status IN ('received_reply', 'no_reply', 'bounced', 'other')),
  received_reply BOOLEAN DEFAULT FALSE,
  reply_rating INTEGER CHECK (reply_rating >= 1 AND reply_rating <= 5), -- 1-5 stars
  
  -- Timing data
  date_sent TIMESTAMP WITH TIME ZONE,
  date_replied_at TIMESTAMP WITH TIME ZONE,
  days_to_reply INTEGER, -- Calculated field: days between send and reply
  
  -- User feedback
  notes TEXT, -- User's additional notes about experience
  helpful BOOLEAN, -- Was this address helpful?
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_celebrity ON fan_mail_experiences(celebrity_id);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_address ON fan_mail_experiences(fan_mail_address_id);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_created ON fan_mail_experiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fan_mail_exp_status ON fan_mail_experiences(status);

-- Create view for aggregated fan mail statistics
CREATE OR REPLACE VIEW fan_mail_address_stats AS
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
FROM fan_mail_addresses fa
LEFT JOIN fan_mail_experiences fme ON fa.id = fme.fan_mail_address_id
GROUP BY fa.id, fa.celebrity_id, fa.address;

-- Enable RLS on fan_mail_experiences (read for all, write for authenticated users with rate limiting)
ALTER TABLE fan_mail_experiences ENABLE ROW LEVEL SECURITY;
