-- Update John Pork's profile image
-- Run this in your Supabase SQL editor to update his profile with the official card photo

UPDATE public.celebrities SET
  image_url = '/images/john-pork.png'
WHERE slug = 'john-pork';

-- Verify the update
SELECT id, name, slug, image_url FROM public.celebrities WHERE slug = 'john-pork';
