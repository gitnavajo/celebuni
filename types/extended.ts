// Extended type definitions for new features

export type FanMailExperienceStatus = 'received_reply' | 'no_reply' | 'bounced' | 'other';

export interface FanMailExperience {
  id: string;
  celebrity_id: string;
  fan_mail_address_id: string;
  user_fingerprint: string;
  status: FanMailExperienceStatus;
  received_reply: boolean;
  reply_rating: number | null; // 1-5 stars
  date_sent: string | null;
  date_replied_at: string | null;
  days_to_reply: number | null;
  notes: string | null;
  helpful: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface FanMailAddressStats {
  id: string;
  celebrity_id: string;
  address: string;
  total_reports: number;
  success_rate: number | null; // percentage
  avg_days_to_reply: number | null;
  avg_rating: number | null;
  last_report_date: string | null;
}

export interface CelebrityExtended {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  official_url: string | null;
  tmdb_id: number | null;
  category: 'actor' | 'voice_actor' | 'musician';
  created_at: string;
  
  // New social media fields
  twitter_handle: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_channel: string | null;
  youtube_url: string | null;
  
  // Activity tracking
  view_count: number;
  search_count: number;
  last_viewed_at: string | null;
}

export interface TrendingActor extends CelebrityExtended {
  trend_score: number; // Combined score for sorting
}

export interface SocialMediaLinks {
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}
