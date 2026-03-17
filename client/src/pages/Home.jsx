import { useState, useEffect } from 'react';        // ADD useEffect here
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchBooks, getRecommendations } from '../services/api';  // ADD getRecommendations
import { useAuth } from '../context/AuthContext';                    // ADD this
import { getShelf } from '../services/shelfService';                // ADD this

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ADD these three new state variables
  const [recommendations, setRecommendations] = useState([]);
  const [recGenre, setRecGenre] = useState('');
  const [recLoading, setRecLoading] = useState(false);

  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();   // ADD this line

  const handleSearch = async (query) => {
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

  // ADD this entire useEffect block
  // Runs once when the component mounts, but only if user is logged in
  useEffect(() => {
    if (!isAuthenticated || !token) return;  // not logged in — skip
    fetchRecommendations();
  }, [isAuthenticated, token]);

  // ADD this function
  const fetchRecommendations = async () => {
    setRecLoading(true);
    try {
      // Get the full shelf
      const shelf = await getShelf(token, null);

      // Split into completed vs all shelf book IDs
      const completed = shelf.filter((e) => e.status === 'completed');
      const allIds = shelf.map((e) => e.bookId);

      // Need at least 1 completed book to recommend
      if (completed.length === 0) return;

      const { books, genre } = await getRecommendations(completed, allIds);
      setRecommendations(books);
      setRecGenre(genre);
    } catch (error) {
      console.error('Recommendations failed:', error);
      // Silently fail — recommendations are a bonus, not core UI
    } finally {
      setRecLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen pt-24 px-4">

      {/* Hero Section — UNCHANGED */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-purple-500">TomoShelf</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Discover, track, and organize your reading journey
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Search Results — UNCHANGED */}
      <SearchResults
        books={books}
        loading={loading}
        onBookClick={handleBookClick}
      />

      {/* ADD this entire recommendations section below SearchResults */}
      {/* Only shows when: logged in + has completed books + not currently searching */}
      {isAuthenticated && books.length === 0 && (
        <div className="max-w-7xl mx-auto mt-12">

          {recLoading ? (
            // Subtle loading state — doesn't take over the page
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-purple-500"></div>
              <span className="text-sm">Finding recommendations…</span>
            </div>

          ) : recommendations.length > 0 ? (
            <>
              {/* Section header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Because you like{' '}
                  <span className="text-purple-400">{recGenre}</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Books you haven't read yet
                </p>
              </div>

              {/* Book grid — same card style as your existing SearchResults */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendations.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className="cursor-pointer group"
                  >
                    {/* Cover */}
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-2 border border-gray-700 group-hover:border-purple-500 transition-colors">
                      {book.thumbnail ? (
                        <img
                          src={book.thumbnail.replace('http://', 'https://')}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                          📖
                        </div>
                      )}
                    </div>
                    {/* Title + author */}
                    <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
                      {book.title}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                      {book.authors?.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </>

          ) : null /* no completed books yet — show nothing */}

        </div>
      )}

    </div>
  );
};

export default Home;