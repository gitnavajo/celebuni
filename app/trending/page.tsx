import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CelebrityExtended } from '@/types/extended';
import { trackViewAction } from '@/app/actions/tracking';

async function getTrendingCelebrities(limit: number = 50) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('celebrities')
      .select('*')
      .order('view_count', { ascending: false })
      .order('search_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as CelebrityExtended[] || [];
  } catch (error) {
    console.error('Error fetching trending celebrities:', error);
    return [];
  }
}

export const metadata = {
  title: 'Trending Actors | CelebUni',
  description: 'Discover the most popular celebrities on CelebUni based on community activity',
};

export default async function TrendingPage() {
  const celebrities = await getTrendingCelebrities(50);

  return (
    <main className="min-h-screen bg-black py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🔥 Trending Actors
          </h1>
          <p className="text-xl text-gray-400">
            Discover the most popular celebrities based on community interest
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 p-6">
            <p className="text-purple-200 text-sm font-medium">Total Celebrities</p>
            <p className="text-4xl font-bold text-white mt-2">{celebrities.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-pink-900 to-pink-800 border-pink-700 p-6">
            <p className="text-pink-200 text-sm font-medium">Top Viewed Today</p>
            <p className="text-4xl font-bold text-white mt-2">
              {celebrities[0]?.view_count || 0}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-6">
            <p className="text-blue-200 text-sm font-medium">Most Searched</p>
            <p className="text-4xl font-bold text-white mt-2">
              {Math.max(...celebrities.map(c => c.search_count || 0))}
            </p>
          </Card>
        </div>

        {/* Celebrities Grid */}
        {celebrities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {celebrities.map((celebrity, index) => (
              <Link
                key={celebrity.id}
                href={`/search/${celebrity.slug}`}
              >
                <Card className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gray-800 border-gray-700 h-full flex flex-col">
                  <div className="relative h-56 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden flex-shrink-0">
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
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {celebrity.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary" className="bg-purple-900 text-purple-100 capitalize">
                        {celebrity.category}
                      </Badge>
                    </div>

                    {/* Activity stats */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-gray-400 text-xs">👁️ Views</p>
                        <p className="text-white font-semibold">{celebrity.view_count || 0}</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <p className="text-gray-400 text-xs">🔍 Searches</p>
                        <p className="text-white font-semibold">{celebrity.search_count || 0}</p>
                      </div>
                    </div>

                    {celebrity.bio && (
                      <p className="text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
                        {celebrity.bio}
                      </p>
                    )}

                    <div className="pt-3 border-t border-gray-700">
                      <span className="text-sm text-purple-400 font-semibold group-hover:text-purple-300">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700 p-12 text-center">
            <p className="text-gray-400 text-lg">No trending celebrities yet. Be the first to discover them!</p>
          </Card>
        )}
      </div>
    </main>
  );
}
