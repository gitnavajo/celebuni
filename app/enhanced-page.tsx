import { TrendingActorsSection } from '@/components/trending/trending-actors-section';
import { SearchHero } from '@/components/search/search-hero';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'CelebUni - Find Celebrity Contact Info & Fan Mail Addresses',
  description:
    'Discover celebrity contact information, social media, fan mail addresses, and community reviews all in one place.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Search Hero Section */}
      <SearchHero />

      {/* Trending Actors Section */}
      <TrendingActorsSection limit={6} />

      {/* Features Section */}
      <section className="w-full py-12 md:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Why Choose CelebUni?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Social Media Links</h3>
              <p className="text-gray-300">
                Follow your favorite celebrities on Twitter, Instagram, TikTok, and YouTube
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900 to-pink-800 border-pink-700 p-6 text-center">
              <div className="text-4xl mb-4">📬</div>
              <h3 className="text-xl font-bold text-white mb-2">Fan Mail Tracking</h3>
              <p className="text-gray-300">
                Share your fan mail experience and see success rates from the community
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-6 text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-2">Trending Favorites</h3>
              <p className="text-gray-300">
                Discover who&apos;s trending based on community interest and activity
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the CelebUni Community
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Help other fans by sharing your fan mail experiences and connecting with celebrities
          </p>
          <button className="px-8 py-3 bg-white text-purple-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Start Exploring
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>
            CelebUni © {new Date().getFullYear()} - Find Celebrity Contact Info & Fan Mail Addresses
          </p>
        </div>
      </footer>
    </main>
  );
}
