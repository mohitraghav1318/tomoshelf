import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchBooks } from '../services/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-purple-500">TomoShelf</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Discover, track, and organize your reading journey
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Search Results */}
      <SearchResults
        books={books}
        loading={loading}
        onBookClick={handleBookClick}
      />
    </div>
  );
};

export default Home;
