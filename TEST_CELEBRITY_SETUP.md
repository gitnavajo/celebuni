# John Pork Test Celebrity Profile Setup

## 🎭 Overview

This setup adds a complete test celebrity profile for "John Pork" to your database, including:
- Celebrity profile with bio and images
- Social media links (linked to Steve Buscemi for testing)
- Fan mail addresses
- Event appearances

## 📋 Test Data Included

### Celebrity Profile
- **Name**: John Pork
- **Slug**: john-pork
- **Bio**: "Former New York Yankee and Pokemon card enthusiast..."
- **Category**: actor
- **Profile Image**: Baseball player placeholder image

### Social Media Links
All linked to **Steve Buscemi** (a quirky actor who makes a fun test celebrity):
- **Twitter**: @stevebuscemi
- **Instagram**: @stevebuscemi
- **TikTok**: @stevebuscemi
- **YouTube**: @stevebuscemi

### Fan Mail Addresses
1. **Official Yankees Address**
   - Address: 123 Yankee Stadium Way, Bronx, NY 10451
   - Verified: ✓ Yes
   - Source: Official Yankees Records

2. **Pokemon TCG Address**
   - Address: John Pork, Pokemon Trading Company, 456 Card Collector Ave, New York, NY 10001
   - Verified: ✗ No (Community Submission)
   - Source: Community Submission

### Event Appearances
1. Pokemon World Championships
   - Date: August 15, 2024
   - Location: Las Vegas, Nevada
   - Type: Convention
   - URL: https://www.pokemon.com/us/pokemon-world-championships/

2. Yankee Stadium Legacy Event
   - Date: June 20, 2024
   - Location: Bronx, New York
   - Type: Panel

## 🚀 How to Add to Your Database

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy all the SQL from `scripts/add-test-celebrity.sql`
6. Paste into the editor
7. Click **Run**

Expected output: One row inserted confirming the celebrity was added

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
cd /workspace
supabase db push --project-id YOUR_PROJECT_ID < scripts/add-test-celebrity.sql
```

## 📱 Testing the Profile

After running the SQL, you can view John Pork's profile at:

```
https://v0-celebuni.vercel.app/search/john-pork
```

This page will show:
- ✅ Profile picture and bio
- ✅ Social media links (to Steve Buscemi's real accounts)
- ✅ Fan mail addresses with experience tracker
- ✅ Event appearances
- ✅ View/Search count trending data

## 🧪 Testing Features

### 1. Test Social Media Links
Click the social media icons on John Pork's profile. They should link to Steve Buscemi's real social accounts:
- Click Twitter icon → Goes to @stevebuscemi on Twitter
- Click Instagram icon → Goes to @stevebuscemi on Instagram
- Click TikTok icon → Goes to @stevebuscemi on TikTok
- Click YouTube icon → Goes to @stevebuscemi on YouTube

### 2. Test Fan Mail Experience Tracker
1. Navigate to the fan mail section
2. Click "Share Your Experience"
3. Test submitting feedback:
   - Select "Yes, I received a reply"
   - Rate 5 stars
   - Enter date sent and date replied
   - Add a note
   - Submit
4. Verify the stats update and show recent reports

### 3. Test View Tracking
- Visit the profile multiple times
- Check if `view_count` increments
- Visit `/trending` page to see if John Pork appears

## 🎨 Customizing the Test Data

### Change the Social Media Links
Edit `scripts/add-test-celebrity.sql` and change these fields:
```sql
twitter_handle = 'your_twitter_handle',
instagram_handle = 'your_instagram_handle',
tiktok_handle = 'your_tiktok_handle',
youtube_url = 'https://www.youtube.com/@your_channel',
```

### Change the Fan Mail Addresses
Modify the fan mail addresses in the SQL:
```sql
address = 'Your Custom Address Here'
```

### Change the Profile Image
Update the image URL:
```sql
image_url = 'https://your-image-url.com/image.jpg'
```

### Add More Appearances
Add more INSERT statements for appearances:
```sql
INSERT INTO appearances (
  id, celebrity_id, event_name, event_date, location, type
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM celebrities WHERE slug = 'john-pork'),
  'Your Event Name',
  '2024-12-25'::timestamp,
  'Your Location',
  'con'  -- or 'panel', 'photo_op'
);
```

## 🐛 Troubleshooting

### Profile not showing at `/search/john-pork`
- Verify the slug in the URL matches: `john-pork` (lowercase with hyphens)
- Check that the SQL ran successfully
- Clear browser cache and reload

### Fan mail experience form not working
- Ensure the `fan_mail_experiences` table was created (ran second migration)
- Check browser console for JavaScript errors
- Verify fan mail address ID is correct

### Social media links going to wrong accounts
- Verify the handle in the database matches the celebrity
- Remember handles should not include @

### View count not incrementing
- Check that `trackViewAction` is being called from server
- Verify Supabase RLS policies allow updates

## 📊 Database Schema Reference

The test data uses these tables:
- `celebrities` - Main celebrity profile
- `fan_mail_addresses` - Contact information
- `appearances` - Event/appearance information
- `fan_mail_experiences` - User feedback (when they submit reviews)
- `fan_mail_address_stats` - Aggregated stats (auto-generated view)

## ✨ What's Automatically Tracked

Once John Pork is in the database:
- ✅ Profile views are counted
- ✅ Search activity is tracked
- ✅ Fan mail experience submissions are aggregated
- ✅ Success rates and reply times are calculated
- ✅ Trending ranking is updated

## 🎬 Next Steps

1. **Run the SQL** to add the test celebrity
2. **Visit the profile** to see all new components in action
3. **Test fan mail tracker** by submitting fake feedback
4. **Check `/trending`** to see trending functionality
5. **Customize socials** to link to different celebrities or accounts

## 📝 Notes

- This is a test setup only - use for development and testing purposes
- The social media links go to Steve Buscemi (just for demo purposes)
- You can easily delete the test data by running:
  ```sql
  DELETE FROM celebrities WHERE slug = 'john-pork';
  ```
  This will cascade delete related records due to foreign key constraints.

## 💡 Pro Tips

- Mirror the SQL structure to add more test celebrities
- Use this for QA testing of the new features
- Test the experience tracker with multiple submissions
- Check aggregated stats after submitting reviews
- Verify trending page updates as view counts increase
