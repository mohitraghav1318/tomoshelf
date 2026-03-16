import { useEffect, useState } from 'react';
import { testConnection } from '../services/api';

function Home() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    testConnection().then((data) => setStatus(data.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl font-bold text-white mb-4">
          Your reading world,{' '}
          <span className="text-purple-400">organised.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          Discover books, manga, manhwa and novels. Track your reading progress
          and build your personal shelf.
        </p>

        {/* Backend status */}
        {status && <p className="text-green-400 text-sm mb-6">✅ {status}</p>}

        <div className="flex gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse Books
          </button>
          <button className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
            My Shelf
          </button>
        </div>
      </div>

      {/* Categories row */}
      <div className="flex justify-center gap-4 px-6 pb-20 flex-wrap">
        {['📖 Books', '🎌 Manga', '🇰🇷 Manhwa', '📝 Novels', '🌐 Webtoons'].map(
          (cat) => (
            <div
              key={cat}
              className="bg-gray-900 border border-gray-800 hover:border-purple-500 text-gray-300 px-6 py-3 rounded-full text-sm cursor-pointer transition-colors"
            >
              {cat}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default Home;
