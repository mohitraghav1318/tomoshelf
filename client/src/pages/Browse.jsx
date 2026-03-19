import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Search, 
  Zap, 
  Heart, 
  Sparkles, 
  Rocket, 
  Landmark, 
  User, 
  Briefcase, 
  Smile, 
  Coffee, 
  Palette,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { searchBooks } from '../services/api';
import SearchResults from '../components/SearchResults';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = [
  { id: 'fiction', label: 'Fiction', icon: Book, color: 'from-red-500 to-cyan-500' },
  { id: 'mystery', label: 'Mystery', icon: Search, color: 'from-red-500 to-indigo-500' },
  { id: 'thriller', label: 'Thriller', icon: Zap, color: 'from-red-500 to-orange-500' },
  { id: 'romance', label: 'Romance', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'fantasy', label: 'Fantasy', icon: Sparkles, color: 'from-amber-400 to-yellow-600' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: Rocket, color: 'from-indigo-600 to-red-700' },
  { id: 'history', label: 'History', icon: Landmark, color: 'from-emerald-500 to-teal-600' },
  { id: 'biography', label: 'Biography', icon: User, color: 'from-slate-500 to-gray-700' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'from-red-700 to-indigo-800' },
  { id: 'self-help', label: 'Self-Help', icon: Smile, color: 'from-lime-400 to-green-600' },
  { id: 'cooking', label: 'Cooking', icon: Coffee, color: 'from-orange-400 to-red-500' },
  { id: 'art', label: 'Art', icon: Palette, color: 'from-violet-500 to-fuchsia-500' },
];

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const results = await searchBooks(category.label);
      setBooks(results);
    } catch (error) {
      console.error('Failed to fetch books for category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setBooks([]);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {!selectedCategory ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Browse by <span className="text-red-500">Category</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Explore our curated collection of books across various genres
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-neutral-950/50 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background Effect on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${cat.color} mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
                    <cat.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {cat.label}
                  </span>
                  
                  <div className="mt-2 text-sm text-gray-500 font-medium">
                    Explore books
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Categories</span>
            </button>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${selectedCategory.color} shadow-lg shadow-black/20`}>
                  <selectedCategory.icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {selectedCategory.label} <span className="text-red-500">Books</span>
                </h1>
              </div>
              <p className="text-gray-400 truncate max-w-2xl">
                Discover the best {selectedCategory.label.toLowerCase()} books handpicked for you.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <SearchResults
                books={books}
                loading={loading}
                onBookClick={handleBookClick}
                title={false}
              />
            )}
            
            {!loading && books.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-950 border border-white/5 mb-6">
                  <Book className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
                <p className="text-gray-500">Try browsing another category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
