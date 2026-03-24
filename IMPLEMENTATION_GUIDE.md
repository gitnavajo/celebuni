# CelebUni Feature Implementation Guide

## Overview
This guide outlines how to integrate the new trending actors, social media, and fan mail experience tracking features into the CelebUni application.

## New Additions Summary

### 1. Database Schema Updates
**Files**: `supabase/migrations/20260324000000_add_socials_and_tracking.sql` and `20260324000100_create_fan_mail_experiences.sql`

#### Changes to `celebrities` table:
- `twitter_handle` (TEXT)
- `instagram_handle` (TEXT)
- `tiktok_handle` (TEXT)
- `youtube_channel` (TEXT)
- `youtube_url` (TEXT)
- `view_count` (INTEGER, default 0)
- `search_count` (INTEGER, default 0)
- `last_viewed_at` (TIMESTAMP)

#### New `fan_mail_experiences` table:
- Tracks user feedback on fan mail address effectiveness
- Stores: status, rating, reply time, user notes
- Aggregated data provided via `fan_mail_address_stats` view

### 2. New TypeScript Types
**File**: `types/extended.ts`

New types:
- `FanMailExperience` - Individual feedback entries
- `FanMailAddressStats` - Aggregated statistics
- `CelebrityExtended` - Celebrity with new fields
- `TrendingActor` - Celebrity with trend scoring
- `SocialMediaLinks` - URI mapping for socials

### 3. Core Libraries and Utilities

#### Server-Side Tracking (`lib/tracking.ts`)
```typescript
// Key Functions:
- trackCelebrityView(celebrityId) - Increment view count
- trackSearchActivity(celebrityId) - Increment search count
- getTrendingCelebrities(limit) - Get trending celebrities
- submitFanMailExperience(...) - Log user feedback
- getFanMailStats(celebrityId) - Get aggregated stats
- getSocialMediaUrls(celebrity) - Build social URLs
```

#### Server Actions (`app/actions/tracking.ts`)
```typescript
- trackViewAction(celebrityId) - Server action for tracking views
- trackSearchAction(celebrityId) - Server action for tracking searches
```

### 4. React Components

#### TrendingActorsSection (`components/trending/trending-actors-section.tsx`)
- Client component showing top trending celebrities
- Displays: name, image, category, view count
- Responsive grid layout with hover effects
- Link to full trending page

#### SocialMediaCard (`components/social-media-card.tsx`)
- Client component displaying social media links
- Supports: Twitter, Instagram, TikTok, YouTube
- Styled icon buttons with hover effects
- Only renders if celebrity has socials

#### EnhancedFanMailCard (`components/fan-mail/enhanced-fan-mail-card.tsx`)
- Displays fan mail address(es) for a celebrity
- Integrates with FanMailExperienceTracker below each address
- Shows verification status and source

#### FanMailExperienceTracker (`components/fan-mail/fan-mail-experience-tracker.tsx`)
- Client component for submitting and viewing feedback
- Features:
  - Submit experience form (status, rating, dates, notes)
  - Display aggregated stats (success rate, avg reply time, rating)
  - Show recent community reports
  - Privacy-focused with anonymous user fingerprinting

### 5. New Routes

#### `/trending` Page (`app/trending/page.tsx`)
- Server component showing all trending celebrities
- Sorted by view_count and search_count
- Displays rankings with badges
- Shows activity metrics

#### Enhanced `/search/[query]` Page (`app/search/enhanced-[query]/page.tsx`)
- Integrates new components:
  - SocialMediaCard for social links
  - EnhancedFanMailCard with experience tracker
  - Maintains existing filmography and appearances
- Tracks views via server action

## Implementation Steps

### Step 1: Database Setup
1. Navigate to your Supabase dashboard
2. Go to SQL Editor
3. Run both migration files:
   - `20260324000000_add_socials_and_tracking.sql`
   - `20260324000100_create_fan_mail_experiences.sql`
4. Verify tables and columns were created

### Step 2: Copy Type Definitions
1. Copy `types/extended.ts` to your `types/` folder
2. Update `types/supabase.ts` to regenerate if needed: `npx supabase gen types typescript`

### Step 3: Add Utilities and Actions
1. Copy `lib/tracking.ts` to your `lib/` folder
2. Copy `app/actions/tracking.ts` to your `app/actions/` folder
3. Update imports in tracking.ts if paths differ

### Step 4: Implement Components
1. Create `components/trending/` and `components/fan-mail/` directories
2. Copy the following components:
   - `TrendingActorsSection`
   - `SocialMediaCard`
   - `EnhancedFanMailCard`
   - `FanMailExperienceTracker`

### Step 5: Update Routes
1. **Homepage Update**: 
   - Edit `app/page.tsx`
   - Import `TrendingActorsSection`
   - Add `<TrendingActorsSection limit={6} />` after SearchHero
   - See `app/enhanced-page.tsx` for full example

2. **Trending Page**:
   - Create `app/trending/page.tsx`
   - Copy content from provided file

3. **Celebrity Profile Page**:
   - Edit your existing `/search/[query]/page.tsx`
   - Import new components:
     - `SocialMediaCard`
     - `EnhancedFanMailCard`
     - `trackViewAction` server action
   - Call `await trackViewAction(celebrity.id)` on page load
   - Add components to render with celebrity data
   - See `app/search/enhanced-[query]/page.tsx` for full implementation

### Step 6: Update Celebrity Data
1. Go to Supabase dashboard
2. Edit existing celebrity records
3. Add social media handles (without @ or https://):
   - `twitter_handle`: e.g., "elonmusk"
   - `instagram_handle`: e.g., "elonmusk"
   - `tiktok_handle`: e.g., "elonmusk"
   - `youtube_url`: Full URL, e.g., "https://www.youtube.com/@channel"

## Database Query Optimization

### Indexes Already Created:
- `idx_celebrities_view_count` - Fast trending queries
- `idx_celebrities_search_count` - Fast search ranking
- `idx_fan_mail_exp_celebrity` - Fast stats lookup
- `idx_fan_mail_exp_address` - Fast reviews lookup
- `idx_fan_mail_exp_status` - Fast filtering
- `idx_fan_mail_exp_created` - Fast sorting by date

### Using the Stats View:
```sql
-- Get stats for all addresses of a celebrity
SELECT * FROM fan_mail_address_stats 
WHERE celebrity_id = '...'
ORDER BY success_rate DESC;
```

## Configuration & Environment

No additional environment variables needed. Uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Best Practices

1. **View Tracking**: Track views on page load, not on every component render
2. **User Fingerprinting**: Current implementation is basic. Consider upgrading to a proper fingerprinting library in production
3. **RLS Policies**: Consider implementing Row-Level Security policies for fan_mail_experiences table to:
   - Allow anyone to read
   - Require authentication to write (optional)
4. **Caching**: Use Next.js `cache()` function for trending queries
5. **Testing**: Test fan mail form submission and stats aggregation

## Future Enhancements

1. **Authentication**: Add GitHub/Google OAuth for optional user accounts
2. **Notifications**: Email notifications when celebrities reply to fan mail
3. **Search Enhancement**: Index social handles for better search
4. **Analytics Dashboard**: Admin dashboard to view trending patterns
5. **Real-time Updates**: Supabase subscriptions for live stats updates
6. **Badges**: Award badges to celebrities with high reply rates

## Troubleshooting

### Issue: View count not incrementing
- Solution: Ensure `trackViewAction` is being called from server component
- Check Supabase RLS policies aren't blocking updates

### Issue: Fan mail experience form not submitting
- Solution: Verify `fan_mail_experiences` table exists
- Check browser console for error messages
- Ensure fan_mail_address_id is being passed correctly

### Issue: Trending page showing no results
- Solution: Verify celebrities have view_count > 0
- Check Supabase query permissions
- Ensure index is created: SELECT * pgbench -i

### Issue: Social media links not displaying
- Solution: Verify celebrity records have social handles filled in
- Check handle formatting (should be without @ symbol)
- Clear browser cache

## Support

For issues or questions:
1. Check Supabase logs
2. Review component props and types
3. Verify all migrations ran successfully
4. Check that all imports are correct

