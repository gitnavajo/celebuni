-- SQL script to add John Pork test celebrity profile
-- Run this AFTER running complete-db-setup.sql in your Supabase SQL editor

-- Insert John Pork celebrity
INSERT INTO public.celebrities (
  id,
  name,
  slug,
  bio,
  image_url,
  official_url,
  category,
  twitter_handle,
  instagram_handle,
  tiktok_handle,
  youtube_url,
  view_count,
  search_count
) VALUES (
  gen_random_uuid(),
  'John Pork',
  'john-pork',
  'Former New York Yankee shortstop and Pokemon Trading Card Game world champion. Known for his dual career in professional baseball and competitive card collecting, John Pork brought legendary energy to Yankee Stadium throughout the late ''90s and dominated the Pokemon TCG circuit into the early 2000s. A towering figure in both worlds, he became a cultural phenomenon—famous for his rare autographs on vintage baseball cards and his unforgettable larger-than-life personality. In 2003, he mysteriously disappeared. Last seen leaving a card show in Atlantic City, Pork was reportedly shot in what authorities classified as an unsolved case. The catch? His body was never recovered. For over two decades, loyal fans and conspiracy theorists have speculated: is John Pork truly gone, or still out there somewhere?',
  '/images/john-pork.png',
  'https://www.yankees.com',
  'actor'::public.celebrity_category,
  'stevebuscemi',
  'stevebuscemi',
  'stevebuscemi',
  'https://www.youtube.com/@stevebuscemi',
  0,
  0
);

-- Add fan mail address
INSERT INTO public.fan_mail_addresses (
  id,
  celebrity_id,
  address,
  verified,
  source
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.celebrities WHERE slug = 'john-pork'),
  '123 Yankee Stadium Way, Bronx, NY 10451',
  true,
  'Official Yankees Records'
);

-- Add additional fan mail address (Pokemon TCG related)
INSERT INTO public.fan_mail_addresses (
  id,
  celebrity_id,
  address,
  verified,
  source
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.celebrities WHERE slug = 'john-pork'),
  'John Pork, Pokemon Trading Company, 456 Card Collector Ave, New York, NY 10001',
  false,
  'Community Submission'
);

-- Add an appearance record to help with testing
INSERT INTO public.appearances (
  id,
  celebrity_id,
  event_name,
  event_date,
  location,
  type,
  url
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.celebrities WHERE slug = 'john-pork'),
  '2024 Pokemon World Championships',
  '2024-08-15'::date,
  'Las Vegas, Nevada',
  'con'::public.appearance_type,
  'https://www.pokemon.com/us/pokemon-world-championships/'
);

-- Add another appearance
INSERT INTO public.appearances (
  id,
  celebrity_id,
  event_name,
  event_date,
  location,
  type
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.celebrities WHERE slug = 'john-pork'),
  'Yankee Stadium Legacy Event',
  '2024-06-20'::date,
  'Bronx, New York',
  'panel'::public.appearance_type
);

-- Verify the data was inserted
SELECT 
  name,
  slug,
  bio,
  twitter_handle,
  instagram_handle,
  view_count,
  search_count
FROM public.celebrities 
WHERE slug = 'john-pork';
