# Supabase Setup Verification & Fix Guide

## Quick Check (5 minutes)

### Step 1: Open Your Supabase Project
Go to: https://supabase.com/dashboard/project/ftzswtblrkazqxizjyqa

### Step 2: Run Verification Queries
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy all the SQL from `scripts/verify-supabase.sql`
4. Paste it into the editor
5. Click **Run**

### What to Look For:

**Good Signs (means migrations ran):**
- ✅ Query 1 returns 7 rows (the new columns)
- ✅ Query 2 returns 1 row (fan_mail_experiences table exists)
- ✅ Query 3 returns 1 row (fan_mail_address_stats view exists)

**Bad Signs (means migrations didn't run):**
- ❌ Query 1 returns 0 rows
- ❌ Query 2 returns 0 rows
- ❌ Query 3 returns 0 rows

---

## If Migrations Didn't Run:

### Fix It Now:

1. **Click SQL Editor** → **New Query**
2. **Copy both migration files**:
   - First run `supabase/migrations/20260324000000_add_socials_and_tracking.sql`
   - Then run `supabase/migrations/20260324000100_create_fan_mail_experiences.sql`

3. **Paste each one and click Run**

4. **Run verification queries again** to confirm they worked

---

## If John Pork Doesn't Exist (Query 4 returns 0 rows):

### Add Him Now:

1. **Click SQL Editor** → **New Query**
2. **Copy all SQL from** `scripts/add-test-celebrity.sql`
3. **Paste and click Run**
4. **Verify with Query 4** - should now return 1 row with John Pork

---

## Manual Check in Dashboard

If you prefer to check the UI directly:

### Check Tables Exist:
1. Go to **Table Editor** (left sidebar)
2. Look for these tables:
   - ✅ `celebrities` (should have columns: twitter_handle, instagram_handle, etc.)
   - ✅ `fan_mail_addresses` (should already exist)
   - ✅ `fan_mail_experiences` (NEW - should exist if migration ran)

### Check John Pork Exists:
1. Go to **Table Editor**
2. Click `celebrities` table
3. Search for "john-pork" or look for "John Pork"
4. Should see his profile with all details

---

## Common Issues & Fixes

### Issue 1: "Table fan_mail_experiences does not exist"
**Fix**: Run the second migration file:
```
supabase/migrations/20260324000100_create_fan_mail_experiences.sql
```

### Issue 2: "Column view_count does not exist"
**Fix**: Run the first migration file:
```
supabase/migrations/20260324000000_add_socials_and_tracking.sql
```

### Issue 3: John Pork created but site still shows error
**Fix**:
1. Deploy the latest code from GitHub (Vercel auto-deploys)
2. Clear browser cache
3. Try incognito/private browser window

### Issue 4: "Permission denied" when running SQL
**Fix**:
1. Ensure you're logged in to Supabase
2. Check that you have admin access to the project
3. Go to Settings → Database and verify connection

---

## Complete Checklist

- [ ] Opened Supabase dashboard
- [ ] Navigated to SQL Editor
- [ ] Ran verification queries
- [ ] Confirmed 7 new columns exist (Query 1)
- [ ] Confirmed fan_mail_experiences table exists (Query 2)
- [ ] Ran first migration if needed
- [ ] Ran second migration if needed
- [ ] Ran add-test-celebrity.sql
- [ ] Confirmed John Pork exists (Query 4)
- [ ] Deployed code to Vercel (should be auto-deployed)
- [ ] Cleared browser cache
- [ ] Tried visiting `/search/john-pork` on the site

---

## Still Having Issues?

Check these files for the exact SQL you need:
- `supabase/migrations/20260324000000_add_socials_and_tracking.sql` - Column additions
- `supabase/migrations/20260324000100_create_fan_mail_experiences.sql` - New tables
- `scripts/add-test-celebrity.sql` - John Pork data
- `scripts/verify-supabase.sql` - Verification queries

---

## Summary of What Should Exist

### New Columns on `celebrities` Table:
```
- twitter_handle (TEXT)
- instagram_handle (TEXT)
- tiktok_handle (TEXT)
- youtube_url (TEXT)
- youtube_channel (TEXT)
- view_count (INTEGER, default 0)
- search_count (INTEGER, default 0)
- last_viewed_at (TIMESTAMP)
```

### New Table: `fan_mail_experiences`
```
- id (UUID)
- celebrity_id (UUID) - FK to celebrities
- fan_mail_address_id (UUID) - FK to fan_mail_addresses
- status (TEXT): 'received_reply', 'no_reply', 'bounced', 'other'
- received_reply (BOOLEAN)
- reply_rating (INTEGER 1-5)
- date_sent (TIMESTAMP)
- date_replied_at (TIMESTAMP)
- days_to_reply (INTEGER)
- notes (TEXT)
- helpful (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### New View: `fan_mail_address_stats`
Automatically aggregates data from `fan_mail_experiences`

### John Pork Celebrity Record:
```
name: "John Pork"
slug: "john-pork"
category: "actor"
twitter_handle: "stevebuscemi"
instagram_handle: "stevebuscemi"
tiktok_handle: "stevebuscemi"
youtube_url: "https://www.youtube.com/@stevebuscemi"
view_count: 0
search_count: 0
```

With 2 fan mail addresses and 2 appearances.
