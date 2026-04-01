import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchBooks, getRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getShelf } from '../services/shelfService';
import SkeletonCard from '../components/SkeletonCard';
import BackendStatus from '../components/BackendStatus';

/* ─── Simple Book Card ────────────────────────────────────────────────────── */
const SimpleBookCard = ({ book, onClick }) => (
  <div
    onClick={() => onClick(book.id)}
    className="group cursor-pointer bg-neutral-950 border border-slate-800 rounded-xl overflow-hidden hover:border-red-500 transition-all duration-200 shadow-lg"
  >
    <div className="aspect-[2/3] relative">
      {book.thumbnail ? (
        <img
          src={book.thumbnail.replace('http://', 'https://')}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-3xl">
          📖
        </div>
      )}
    </div>
    <div className="p-3">
      <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
        {book.title}
      </h3>
      <p className="text-slate-500 text-xs mt-1 truncate">
        {book.authors?.[0] || 'Unknown Author'}
      </p>
    </div>
  </div>
);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recGenre, setRecGenre] = useState('');
  const [recLoading, setRecLoading] = useState(false);

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const results = await searchBooks(query);
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRecommendations();
    }
  }, [isAuthenticated, token]);

  const fetchRecommendations = async () => {
    setRecLoading(true);
    try {
      const shelf = await getShelf(token);
      const completed = shelf.filter((e) => e.status === 'completed');
      const allIds = shelf.map((e) => e.bookId);

      if (completed.length > 0) {
        const { books, genre } = await getRecommendations(completed, allIds);
        setRecommendations(books);
        setRecGenre(genre);
      }
    } catch (error) {
      console.error('Recommendations failed:', error);
    } finally {
      setRecLoading(false);
    }
  };

  const handleBookClick = (bookId) => navigate(`/book/${bookId}`);

  return (
    <div className="min-h-screen bg-black font-sans text-slate-200">
      {/* Backend Status Banner - Shows if backend is waking up */}
      <BackendStatus />

      {/* Search Header */}
      <section className="pt-32 pb-16 px-6 bg-neutral-950/50 border-b border-slate-900 mt-2">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Discover Your Next <span className="text-red-500">Masterpiece</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Search millions of books and track your reading journey with ease.
          </p>
          <div className="max-w-2xl mx-auto bg-neutral-950 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['Manga', 'Fantasy', 'Self-Help', 'Sci-Fi', 'Classic'].map(
              (genre) => (
                <button
                  key={genre}
                  onClick={() => handleSearch(genre)}
                  className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 hover:border-slate-600 transition-all"
                >
                  {genre}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Main Results */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <SearchResults books={books} onBookClick={handleBookClick} />
        )}

        {/* Recommendations */}
        {isAuthenticated && books.length === 0 && (
          <div className="mt-12">
            {recLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-8">
                <div className="border-l-4 border-red-500 pl-4">
                  <h2 className="text-2xl font-bold text-white">
                    Recommended for You
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Because you read{' '}
                    <span className="text-red-400">{recGenre}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recommendations.map((book) => (
                    <SimpleBookCard
                      key={book.id}
                      book={book}
                      onClick={handleBookClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-950/30 rounded-3xl border border-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-2">
                  Your shelf is empty
                </h3>
                <p className="text-slate-500">
                  Start searching and adding books to see recommendations!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Auth CTA */}
        {!isAuthenticated && books.length === 0 && (
          <div className="mt-20 p-12 bg-red-600 rounded-3xl text-center shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-4 italic">
              Your reading legacy starts today.
            </h2>
            <p className="text-red-100 mb-10 max-w-md mx-auto opacity-90">
              Join thousands of readers tracking their literary journey — one
              shelf at a time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-10 py-3 rounded-xl bg-white text-red-600 font-bold hover:bg-slate-100 transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
