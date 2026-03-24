# Quick Reference - New Features Code

## File Structure Overview
```
workspace/
├── supabase/migrations/
│   ├── 20260324000000_add_socials_and_tracking.sql          ✓ NEW
│   └── 20260324000100_create_fan_mail_experiences.sql       ✓ NEW
├── types/
│   └── extended.ts                                            ✓ NEW
├── lib/
│   └── tracking.ts                                            ✓ NEW
├── app/
│   ├── actions/
│   │   └── tracking.ts                                        ✓ NEW
│   ├── trending/
│   │   └── page.tsx                                           ✓ NEW
│   ├── search/
│   │   └── enhanced-[query]/
│   │       └── page.tsx                                       ✓ NEW (reference)
│   └── enhanced-page.tsx                                      ✓ NEW (reference)
├── components/
│   ├── trending/
│   │   └── trending-actors-section.tsx                        ✓ NEW
│   ├── fan-mail/
│   │   ├── enhanced-fan-mail-card.tsx                         ✓ NEW
│   │   └── fan-mail-experience-tracker.tsx                    ✓ NEW
│   └── social-media-card.tsx                                  ✓ NEW
├── IMPLEMENTATION_GUIDE.md                                     ✓ NEW
├── NEW_FEATURES.md                                             ✓ NEW
└── QUICK_REFERENCE.md                                          ✓ NEW (this file)
```

## Component Quick Reference

### TrendingActorsSection
**Location**: `components/trending/trending-actors-section.tsx`
**Usage**:
```tsx
import { TrendingActorsSection } from '@/components/trending/trending-actors-section';

<TrendingActorsSection limit={6} />
```
**Props**: `limit?: number` (default: 6)
**Features**: Shows top trending celebrities with rankings

### SocialMediaCard
**Location**: `components/social-media-card.tsx`
**Usage**:
```tsx
import { SocialMediaCard } from '@/components/social-media-card';

<SocialMediaCard celebrity={celebrityData} />
```
**Props**: `celebrity: CelebrityExtended`
**Features**: Displays social media icon links

### EnhancedFanMailCard
**Location**: `components/fan-mail/enhanced-fan-mail-card.tsx`
**Usage**:
```tsx
import { EnhancedFanMailCard } from '@/components/fan-mail/enhanced-fan-mail-card';

<EnhancedFanMailCard
  fanMailAddresses={addresses}
  celebrityId={id}
  celebrityName={name}
/>
```
**Features**: Shows addresses + integrated experience tracker

### FanMailExperienceTracker
**Location**: `components/fan-mail/fan-mail-experience-tracker.tsx`
**Usage**:
```tsx
import { FanMailExperienceTracker } from '@/components/fan-mail/fan-mail-experience-tracker';

<FanMailExperienceTracker
  fanMailAddressId={addressId}
  celebrityId={celebId}
  address={addressString}
/>
```
**Features**: Form + aggregated stats display

## Server Actions Quick Reference

### trackViewAction
**Location**: `app/actions/tracking.ts`
**Usage**:
```tsx
'use client';
import { trackViewAction } from '@/app/actions/tracking';

// In page load or effect
trackViewAction(celebrityId);
```
**What it does**: Increments view_count, updates last_viewed_at

### trackSearchAction
**Location**: `app/actions/tracking.ts`
**Usage**:
```tsx
import { trackSearchAction } from '@/app/actions/tracking';

trackSearchAction(celebrityId);
```
**What it does**: Increments search_count

## Utility Functions Quick Reference

**Location**: `lib/tracking.ts`

### getTrendingCelebrities
```tsx
const celebrities = await getTrendingCelebrities(10);
// Returns: CelebrityExtended[]
```

### submitFanMailExperience
```tsx
const experience = await submitFanMailExperience(
  celebrityId,
  fanMailAddressId,
  {
    status: 'received_reply',
    reply_rating: 5,
    date_sent: '2024-01-01',
    date_replied_at: '2024-01-10',
    notes: 'Great experience!'
  }
);
// Returns: FanMailExperience | null
```

### getFanMailStats
```tsx
const stats = await getFanMailStats(celebrityId);
// Returns: FanMailAddressStats[]
// Contains: success_rate, avg_days_to_reply, avg_rating, etc.
```

### getSocialMediaUrls
```tsx
const urls = getSocialMediaUrls(celebrity);
// Returns: { twitter?, instagram?, tiktok?, youtube? }
```

## Type Definitions Quick Reference

**Location**: `types/extended.ts`

```typescript
// Main types
CelebrityExtended        // Celebrity + new fields
FanMailExperience        // Individual feedback entry
FanMailAddressStats      // Aggregated statistics
TrendingActor           // Celebrity with trend_score
FanMailExperienceStatus // union: 'received_reply' | 'no_reply' | 'bounced' | 'other'
SocialMediaLinks        // Social media URL mapping
```

## Routes Overview

### New Routes Created

**`/trending`** - Trending Page
- File: `app/trending/page.tsx`
- Shows all trending celebrities
- Sorted by view count + search count
- Includes rankings and metrics

**`/search/[query]`** - Enhanced Celebrity Profile
- File: `app/search/enhanced-[query]/page.tsx`
- Integrates social media card
- Integrates fan mail tracker
- Tracks views automatically

## Database Operations

### Query Examples

**Get Trending Celebrities**:
```sql
SELECT * FROM celebrities 
ORDER BY view_count DESC, search_count DESC 
LIMIT 10;
```

**Get Fan Mail Stats**:
```sql
SELECT * FROM fan_mail_address_stats 
WHERE celebrity_id = 'xyz' 
ORDER BY success_rate DESC;
```

**Get Recent Feedback**:
```sql
SELECT * FROM fan_mail_experiences 
WHERE fan_mail_address_id = 'xyz' 
ORDER BY created_at DESC 
LIMIT 10;
```

## Environment Setup

No new environment variables needed. Uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Key Implementation Checklist

- [ ] Run database migrations
- [ ] Copy all type definitions
- [ ] Copy all utility functions
- [ ] Copy all components
- [ ] Create trending route
- [ ] Update homepage with TrendingActorsSection
- [ ] Update celebrity profile page with SocialMediaCard + EnhancedFanMailCard
- [ ] Add celebrity social media handles to database
- [ ] Test view tracking
- [ ] Test fan mail form submission
- [ ] Test aggregated statistics

## Common Patterns

### Calling Server Actions from Components
```tsx
'use client';
import { trackViewAction } from '@/app/actions/tracking';

useEffect(() => {
  trackViewAction(celebrityId);
}, [celebrityId]);
```

### Using Async Server Components
```tsx
async function MyComponent() {
  const celebrities = await getTrendingCelebrities(6);
  // render...
}
```

### Accessing Social Media URLs
```tsx
const celebrity = { /* ... */ };
const urls = getSocialMediaUrls(celebrity);
// urls = { twitter: 'https://twitter.com/...', ... }
```

## Styling Classes Used

- Tailwind CSS (existing project setup)
- gradient styles: `from-purple-600 to-pink-600`
- animations: `group-hover:scale-105`, `transition-all`
- responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Component Dependencies

All components use existing shadcn/ui components:
- `Card` - from `@/components/ui/card`
- `Badge` - from `@/components/ui/badge`
- `Button` - from `@/components/ui/button`

Make sure these are installed in your project.

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| View count not incrementing | Ensure server action is called, check RLS |
| Social links not showing | Add handles to celebrity records |
| Experience form not submitting | Check user fingerprint generation, RLS rules |
| Trending page blank | Verify celebrities have view_count > 0 |
| Stats not aggregating | Confirm fan_mail_address_stats view created |

## Performance Tips

1. Cache trending queries: Use Next.js `unstable_cache()`
2. Lazy load experience tracker on profile
3. Pre-fetch social URLs during data fetch
4. Index view_count column (already done)
5. Paginate trending results on large datasets

---

For detailed implementation: See `IMPLEMENTATION_GUIDE.md`
For feature overview: See `NEW_FEATURES.md`
