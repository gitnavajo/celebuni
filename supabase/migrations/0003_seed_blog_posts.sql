-- Seed 5 evergreen SEO posts into public.blog_posts
-- Safe to run multiple times (upserts by slug).

insert into public.blog_posts (title, slug, content, excerpt, published_at, author)
values
(
  'How to Send Fan Mail Successfully (A Respectful Checklist)',
  'how-to-send-fan-mail-successfully',
  E'# How to Send Fan Mail Successfully\n\nFan mail still works in 2026 — if you keep it respectful, short, and easy to handle.\n\n## The quick checklist\n\n- **Be concise**: 1 page is ideal.\n- **Use a clear envelope**: legible printing, correct postage.\n- **Include a self-addressed stamped envelope (SASE)** if you''re asking for a reply.\n- **Never send valuables**: no cash, no original collectibles.\n- **Ask, don''t demand**: “If you have time…” goes a long way.\n\n## What to include\n\n- A short note: who you are and why you appreciate their work.\n- A small photo or index card to sign (optional).\n- Your return address inside (SASE) and outside (required).\n\n## Common mistakes\n\n- Over-sharing personal details\n- Sending too many items to sign\n- Being pushy or entitled\n\n## Final tip\n\nIf you don''t hear back, don''t take it personally. The goal is to send appreciation — replies are a bonus.\n',
  'A practical, respectful checklist that improves your odds of a reply — without spending much.',
  '2026-03-24T00:00:00Z',
  'CelebUni'
),
(
  'Top Voice Actors to Watch at 2026 Conventions',
  'top-voice-actors-2026-cons',
  E'# Top Voice Actors to Watch at 2026 Conventions\n\nVoice actors are some of the most accessible guests at conventions — and panels are often the best value.\n\n## How to spot great guests\n\n- They''re credited across multiple long-running franchises\n- They do interactive panels (live reads, Q&A)\n- They''re scheduled for multiple days\n\n## Where to find reliable schedules\n\n- Official convention websites\n- Verified social profiles\n- Guest announcements (and updates) posted weekly\n\n## Pro tip\n\nAim for **Friday panels** and **early autograph sessions**. Lines are shorter and the vibe is calmer.\n',
  'A quick guide to finding great voice actor guests and planning your con schedule like a pro.',
  '2026-03-20T00:00:00Z',
  'CelebUni'
),
(
  'Convention Autographs: Pricing, Etiquette, and How to Avoid Line Chaos',
  'convention-autographs-pricing-etiquette',
  E'# Convention Autographs: Pricing, Etiquette, and How to Avoid Line Chaos\n\nAutograph lines can be the best part of a con — or the most stressful. A little planning fixes that.\n\n## Pricing basics\n\n- Prices vary by guest and item type\n- Cashless payments are increasingly common\n- Photos and “combo” packages may be separate\n\n## Etiquette that gets you remembered\n\n- Say your name clearly\n- Keep your ask to one sentence\n- Respect staff pacing and time limits\n\n## Line strategy\n\n- Check the schedule every morning\n- Bring water and a backup plan\n- If you''re with friends, rotate breaks (if allowed)\n',
  'Plan smarter: understand autograph pricing, be respectful, and avoid the worst line mistakes.',
  '2026-03-10T00:00:00Z',
  'CelebUni'
),
(
  'How to Choose a Great Fan Mail Address (and Avoid Scams)',
  'choose-a-great-fan-mail-address',
  E'# How to Choose a Great Fan Mail Address (and Avoid Scams)\n\nThe “best” address is the one that’s current, official, and appropriate for fan mail.\n\n## Good sources\n\n- Verified management / agency sites\n- Official newsletter or link-in-bio pages\n- Convention staff instructions (when provided)\n\n## Red flags\n\n- Random PO boxes with no verification trail\n- Paywalls claiming “guaranteed replies”\n- Unofficial “fan club” intermediaries asking for money\n\n## What CelebUni will do\n\nFor now: **bio + official link**.\n\nLater: address verification workflows and source trails.\n',
  'A simple way to pick reliable fan mail destinations and avoid sketchy “guaranteed reply” scams.',
  '2026-02-28T00:00:00Z',
  'CelebUni'
),
(
  'The Beginner’s Guide to Conventions: What to Bring (and What Not to)',
  'beginners-guide-to-conventions-what-to-bring',
  E'# The Beginner’s Guide to Conventions: What to Bring (and What Not to)\n\nYour first con is more fun when you pack light — and pack smart.\n\n## Bring\n\n- Comfortable shoes\n- Water bottle\n- Portable charger\n- Small snacks\n- A folder or tube for prints/posters\n\n## Don’t bring\n\n- Anything you can’t replace\n- Big bags (unless needed)\n- Unlabeled items for autographs\n\n## The underrated tip\n\nSet a budget before you enter the vendor hall. It’s easy to overspend.\n',
  'A fast packing checklist for first-time convention goers — essentials only, no stress.',
  '2026-02-15T00:00:00Z',
  'CelebUni'
)
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  excerpt = excluded.excerpt,
  published_at = excluded.published_at,
  author = excluded.author;

