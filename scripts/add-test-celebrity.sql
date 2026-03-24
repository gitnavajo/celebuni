-- SQL script to add John Pork test celebrity profile
-- Run this in your Supabase SQL editor

-- Insert John Pork celebrity
INSERT INTO celebrities (
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
  'Former New York Yankee shortstop and Pokemon Trading Card Game world champion. Known for his dual career in professional baseball and competitive card collecting. John Pork brought legendary energy to Yankee Stadium and dominated the Pokemon TCG circuit throughout the 2000s. Famous for his autograph on vintage baseball cards.',
  'https://images.unsplash.com/photo-1518611505867-48a0c676d6a3?w=500&h=500&fit=crop',
  'https://www.yankees.com',
  'actor',
  'stevebuscemi',
  'stevebuscemi',
  'stevebuscemi',
  'https://www.youtube.com/@stevebuscemi',
  0,
  0
);

-- Get the celebrity ID for the next inserts
-- First, find the ID we just created:
SELECT id INTO @celeb_id FROM celebrities WHERE slug = 'john-pork' LIMIT 1;

-- Add fan mail address
INSERT INTO fan_mail_addresses (
  id,
  celebrity_id,
  address,
  verified,
  source
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM celebrities WHERE slug = 'john-pork'),
  '123 Yankee Stadium Way, Bronx, NY 10451',
  true,
  'Official Yankees Records'
);

-- Add additional fan mail address (Pokemon TCG related)
INSERT INTO fan_mail_addresses (
  id,
  celebrity_id,
  address,
  verified,
  source
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM celebrities WHERE slug = 'john-pork'),
  'John Pork, Pokemon Trading Company, 456 Card Collector Ave, New York, NY 10001',
  false,
  'Community Submission'
);

-- Add an appearance record to help with testing
INSERT INTO appearances (
  id,
  celebrity_id,
  event_name,
  event_date,
  location,
  type,
  url
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM celebrities WHERE slug = 'john-pork'),
  '2024 Pokemon World Championships',
  '2024-08-15'::timestamp,
  'Las Vegas, Nevada',
  'con',
  'https://www.pokemon.com/us/pokemon-world-championships/'
);

-- Add another appearance
INSERT INTO appearances (
  id,
  celebrity_id,
  event_name,
  event_date,
  location,
  type
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM celebrities WHERE slug = 'john-pork'),
  'Yankee Stadium Legacy Event',
  '2024-06-20'::timestamp,
  'Bronx, New York',
  'panel'
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
FROM celebrities 
WHERE slug = 'john-pork';
