'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CelebrityExtended } from '@/types/extended';
import { getTrendingCelebrities, trackCelebrityView } from '@/lib/tracking';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrendingActorsProps {
  limit?: number;
}

export function TrendingActorsSection({ limit = 6 }: TrendingActorsProps) {
  const [celebrities, setCelebrities] = useState<CelebrityExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      setIsLoading(true);
      const data = await getTrendingCelebrities(limit);
      setCelebrities(data);
      setIsLoading(false);
    }
    
    fetchTrending();
  }, [limit]);

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Trending Actors
          </h2>
          <p className="text-gray-400 mb-8">Loading trending celebrities...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!celebrities || celebrities.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🔥 Trending Actors
          </h2>
          <p className="text-gray-400 text-lg">
            Most viewed celebrities this week
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {celebrities.map((celebrity, index) => (
            <Link
              key={celebrity.id}
              href={`/search/${celebrity.slug}`}
              onClick={() => trackCelebrityView(celebrity.id)}
            >
              <Card className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gray-800 border-gray-700">
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
                  {celebrity.image_url ? (
                    <img
                      src={celebrity.image_url}
                      alt={celebrity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🌟</span>
                    </div>
                  )}
                  {/* Ranking badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {celebrity.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-purple-900 text-purple-100 capitalize">
                      {celebrity.category}
                    </Badge>
                    {celebrity.view_count > 0 && (
                      <span className="text-sm text-gray-400">
                        👁️ {celebrity.view_count.toLocaleString()} views
                      </span>
                    )}
                  </div>

                  {celebrity.bio && (
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {celebrity.bio}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <span className="text-sm text-purple-400 font-semibold group-hover:text-purple-300">
                      View Profile →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/trending"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            See All Trending →
          </Link>
        </div>
      </div>
    </section>
  );
}
