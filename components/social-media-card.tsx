'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getSocialMediaUrls } from '@/lib/tracking';
import type { CelebrityExtended } from '@/types/extended';

interface SocialMediaCardProps {
  celebrity: CelebrityExtended;
}

export function SocialMediaCard({ celebrity }: SocialMediaCardProps) {
  const socials = getSocialMediaUrls(celebrity);

  if (Object.keys(socials).length === 0) {
    return null;
  }

  const socialIcons: Record<string, { icon: string; label: string; color: string }> = {
    twitter: {
      icon: '𝕏',
      label: 'Twitter',
      color: 'hover:text-gray-200 hover:bg-gray-800',
    },
    instagram: {
      icon: '📷',
      label: 'Instagram',
      color: 'hover:text-pink-400 hover:bg-pink-900',
    },
    tiktok: {
      icon: '♪',
      label: 'TikTok',
      color: 'hover:text-black hover:bg-white',
    },
    youtube: {
      icon: '▶',
      label: 'YouTube',
      color: 'hover:text-red-400 hover:bg-red-900',
    },
  };

  return (
    <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Follow {celebrity.name}</h3>
      
      <div className="flex flex-wrap gap-3">
        {Object.entries(socials).map(([key, url]) => {
          const social = socialIcons[key as keyof typeof socialIcons];
          if (!social) return null;

          return (
            <Link
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 transition-all duration-200 ${social.color}`}
              title={social.label}
            >
              <span className="text-xl">{social.icon}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
