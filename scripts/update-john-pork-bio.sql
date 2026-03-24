-- Update John Pork's bio with the mysterious disappearance narrative
-- Run this in your Supabase SQL editor to update his existing profile

UPDATE public.celebrities SET
  bio = 'Former New York Yankee shortstop and Pokemon Trading Card Game world champion. Known for his dual career in professional baseball and competitive card collecting, John Pork brought legendary energy to Yankee Stadium throughout the late ''90s and dominated the Pokemon TCG circuit into the early 2000s. A towering figure in both worlds, he became a cultural phenomenon—famous for his rare autographs on vintage baseball cards and his unforgettable larger-than-life personality. In 2003, he mysteriously disappeared. Last seen leaving a card show in Atlantic City, Pork was reportedly shot in what authorities classified as an unsolved case. The catch? His body was never recovered. For over two decades, loyal fans and conspiracy theorists have speculated: is John Pork truly gone, or still out there somewhere?'
WHERE slug = 'john-pork';

-- Verify the update
SELECT id, name, slug, bio FROM public.celebrities WHERE slug = 'john-pork';
