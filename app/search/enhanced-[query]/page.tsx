import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trackViewAction } from '@/app/actions/tracking';
import { SocialMediaCard } from '@/components/social-media-card';
import { EnhancedFanMailCard } from '@/components/fan-mail/enhanced-fan-mail-card';
import { FilmographyGrid } from '@/components/search/filmography-grid';
import { Card } from '@/components/ui/card';

interface SearchPageProps {
  params: Promise<{
    query: string;
  }>;
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const params = await props.params;
  const query = decodeURIComponent(params.query);

  const supabase = createClient();
  const { data: celebrity } = await supabase
    .from('celebrities')
    .select('*')
    .eq('slug', query.toLowerCase())
    .single();

  if (!celebrity) {
    return {
      title: `Search: ${query} | CelebUni`,
    };
  }

  return {
    title: `${celebrity.name} | CelebUni`,
    description: celebrity.bio || `Find contact information, appearances, and fan experiences for ${celebrity.name}`,
    openGraph: {
      title: celebrity.name,
      description: celebrity.bio || '',
      images: celebrity.image_url ? [{ url: celebrity.image_url }] : [],
    },
  };
}

export default async function SearchPageComponent(props: SearchPageProps) {
  const params = await props.params;
  const query = decodeURIComponent(params.query);

  const supabase = createClient();

  // Try exact match first
  const { data: exactMatch } = await supabase
    .from('celebrities')
    .select(
      `
      *,
      appearances(*),
      fan_mail_addresses(*)
    `
    )
    .eq('slug', query.toLowerCase())
    .single();

  if (exactMatch) {
    // Track the view
    await trackViewAction(exactMatch.id);

    return (
      <main className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Profile Image and Info */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden bg-gray-800 border-gray-700">
                <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600">
                  {exactMatch.image_url ? (
                    <img
                      src={exactMatch.image_url}
                      alt={exactMatch.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🌟
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Activity Stats */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-gray-400 text-sm">Views</p>
                      <p className="text-white font-bold text-lg">
                        {exactMatch.view_count || 0}
                      </p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-gray-400 text-sm">Searches</p>
                      <p className="text-white font-bold text-lg">
                        {exactMatch.search_count || 0}
                      </p>
                    </div>
                  </div>

                  {exactMatch.official_url && (
                    <a
                      href={exactMatch.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center transition-colors"
                    >
                      Official Website →
                    </a>
                  )}
                </div>
              </Card>
            </div>

            {/* Main Profile Content */}
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {exactMatch.name}
                </h1>
                <p className="text-lg text-purple-400 capitalize mb-4">
                  {exactMatch.category.replace('_', ' ')}
                </p>

                {exactMatch.bio && (
                  <p className="text-gray-300 text-base leading-relaxed">
                    {exactMatch.bio}
                  </p>
                )}
              </Card>

              {/* Social Media Links */}
              {(exactMatch.twitter_handle ||
                exactMatch.instagram_handle ||
                exactMatch.tiktok_handle ||
                exactMatch.youtube_url) && (
                <SocialMediaCard celebrity={exactMatch} />
              )}
            </div>
          </div>

          {/* Fan Mail Section */}
          {exactMatch.fan_mail_addresses && exactMatch.fan_mail_addresses.length > 0 && (
            <div className="mb-12">
              <EnhancedFanMailCard
                fanMailAddresses={exactMatch.fan_mail_addresses}
                celebrityId={exactMatch.id}
                celebrityName={exactMatch.name}
              />
            </div>
          )}

          {/* Appearances Section */}
          {exactMatch.appearances && exactMatch.appearances.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">📍 Appearances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exactMatch.appearances.map((appearance: any) => (
                  <Card key={appearance.id} className="bg-gray-800 border-gray-700 p-4">
                    <h3 className="font-bold text-white mb-2">{appearance.event_name}</h3>
                    <p className="text-gray-400 text-sm mb-1">
                      📅 {new Date(appearance.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm mb-3">📍 {appearance.location}</p>
                    <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {appearance.type}
                    </span>
                    {appearance.url && (
                      <a
                        href={appearance.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3 text-purple-400 hover:text-purple-300 text-sm font-semibold"
                      >
                        Learn More →
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Filmography Section */}
          {exactMatch.tmdb_id && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">🎬 Filmography</h2>
              <FilmographyGrid tmdbId={exactMatch.tmdb_id} />
            </div>
          )}
        </div>
      </main>
    );
  }

  // If no exact match, could show search results or 404
  notFound();
}
