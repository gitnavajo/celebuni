// Utility functions for activity tracking and engagement features
import { createClient } from '@/lib/supabase';
import type { CelebrityExtended, FanMailExperience, FanMailAddressStats } from '@/types/extended';

/**
 * Generate a user fingerprint hash from IP and user agent
 * This is a simple implementation - in production, use a proper fingerprinting library
 */
export function generateUserFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server-side';
  }
  
  const userAgent = navigator.userAgent;
  const timestamp = new Date().toDateString();
  // Simple hash - in production use crypto library
  return btoa(`${userAgent}-${timestamp}`).slice(0, 32);
}

/**
 * Track a celebrity view/search activity
 */
export async function trackCelebrityView(celebrityId: string) {
  try {
    const supabase = createClient();
    
    // Increment view count and update last_viewed_at
    const { error } = await supabase
      .from('celebrities')
      .update({
        view_count: supabase.rpc('increment_view_count', { 
          p_id: celebrityId 
        }),
        last_viewed_at: new Date().toISOString(),
      })
      .eq('id', celebrityId);
    
    if (error) {
      console.error('Error tracking view:', error);
    }
  } catch (err) {
    console.error('Error in trackCelebrityView:', err);
  }
}

/**
 * Track a search activity for a celebrity
 */
export async function trackSearchActivity(celebrityId: string, searchQuery: string) {
  try {
    const supabase = createClient();
    
    // Increment search count
    await supabase
      .from('celebrities')
      .update({ search_count: supabase.rpc('increment_search_count', { p_id: celebrityId }) })
      .eq('id', celebrityId);
  } catch (err) {
    console.error('Error tracking search:', err);
  }
}

/**
 * Get trending celebrities based on view and search activity
 */
export async function getTrendingCelebrities(limit: number = 10) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as CelebrityExtended[] || [];
  } catch (err) {
    console.error('Error fetching trending celebrities:', err);
    return [];
  }
}

/**
 * Submit fan mail experience feedback
 */
export async function submitFanMailExperience(
  celebrityId: string,
  fanMailAddressId: string,
  experience: {
    status: 'received_reply' | 'no_reply' | 'bounced' | 'other';
    reply_rating?: number;
    date_sent?: string;
    date_replied_at?: string;
    notes?: string;
  }
) {
  try {
    const supabase = createClient();
    const userFingerprint = generateUserFingerprint();
    
    // Calculate days_to_reply if both dates provided
    let daysToReply = null;
    if (experience.date_sent && experience.date_replied_at) {
      const sent = new Date(experience.date_sent);
      const replied = new Date(experience.date_replied_at);
      daysToReply = Math.floor((replied.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    const { data, error } = await supabase
      .from('fan_mail_experiences')
      .insert([
        {
          celebrity_id: celebrityId,
          fan_mail_address_id: fanMailAddressId,
          user_fingerprint: userFingerprint,
          status: experience.status,
          received_reply: experience.status === 'received_reply',
          reply_rating: experience.reply_rating,
          date_sent: experience.date_sent,
          date_replied_at: experience.date_replied_at,
          days_to_reply: daysToReply,
          notes: experience.notes,
          helpful: experience.status === 'received_reply',
        },
      ])
      .select();
    
    if (error) throw error;
    return data?.[0] as FanMailExperience | null;
  } catch (err) {
    console.error('Error submitting fan mail experience:', err);
    return null;
  }
}

/**
 * Get aggregated fan mail statistics for a celebrity
 */
export async function getFanMailStats(celebrityId: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('fan_mail_address_stats')
      .select('*')
      .eq('celebrity_id', celebrityId);
    
    if (error) throw error;
    return data as FanMailAddressStats[] || [];
  } catch (err) {
    console.error('Error fetching fan mail stats:', err);
    return [];
  }
}

/**
 * Get fan mail experiences for a specific address
 */
export async function getFanMailExperiences(fanMailAddressId: string, limit: number = 10) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('fan_mail_experiences')
      .select('*')
      .eq('fan_mail_address_id', fanMailAddressId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as FanMailExperience[] || [];
  } catch (err) {
    console.error('Error fetching fan mail experiences:', err);
    return [];
  }
}

/**
 * Get social media URLs for a celebrity
 */
export function getSocialMediaUrls(celebrity: CelebrityExtended) {
  const socials: Record<string, string> = {};
  
  if (celebrity.twitter_handle) {
    socials.twitter = `https://twitter.com/${celebrity.twitter_handle}`;
  }
  if (celebrity.instagram_handle) {
    socials.instagram = `https://instagram.com/${celebrity.instagram_handle}`;
  }
  if (celebrity.tiktok_handle) {
    socials.tiktok = `https://tiktok.com/@${celebrity.tiktok_handle}`;
  }
  if (celebrity.youtube_url) {
    socials.youtube = celebrity.youtube_url;
  }
  
  return socials;
}
