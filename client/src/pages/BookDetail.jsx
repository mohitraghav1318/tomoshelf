import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Star, Calendar, FileText,
  Globe, Check, Plus, ShoppingCart, ExternalLink, BookMarked
} from 'lucide-react';
import { getBookById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { checkBookInShelf, addBookToShelf, removeBookFromShelf, updateShelfEntry } from '../services/shelfService';
import StarRating from '../components/StarRating';
import SkeletonCard from "../components/SkeletonCard";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inShelf, setInShelf] = useState(false);
  const [shelfEntry, setShelfEntry] = useState(null);
  const [addingToShelf, setAddingToShelf] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && token) checkShelf();
  }, [id, isAuthenticated, token]);

  const checkShelf = async () => {
    try {
      const data = await checkBookInShelf(token, id);
      setInShelf(data.inShelf);
      setShelfEntry(data.entry);
    } catch (error) {
      console.error('Failed to check shelf:', error);
    }
  };

  const handleRating = async (newRating) => {
    try {
      await updateShelfEntry(token, shelfEntry._id, { rating: newRating });
      setShelfEntry(prev => ({ ...prev, rating: newRating }));
    } catch (error) {
      console.error('Failed to rate book:', error);
    }
  };

  const handleAddToShelf = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingToShelf(true);
    try {
      const bookData = {
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        publishedDate: book.publishedDate,
        pageCount: book.pageCount,
        categories: book.categories,
        description: book.description,
      };
      const entry = await addBookToShelf(token, id, bookData, 'want-to-read');
      setInShelf(true);
      setShelfEntry(entry);
    } catch (error) {
      console.error('Failed to add to shelf:', error);
      alert(error.message);
    } finally {
      setAddingToShelf(false);
    }
  };

  const handleRemoveFromShelf = async () => {
    if (!confirm('Remove this book from your shelf?')) return;
    try {
      await removeBookFromShelf(token, shelfEntry._id);
      setInShelf(false);
      setShelfEntry(null);
    } catch (error) {
      console.error('Failed to remove from shelf:', error);
      alert(error.message);
    }
  };

  // Series detection — Google Books has no series field.
  // We parse common patterns from subtitle and title:
  //   "(The Stormlight Archive, #1)"   → "The Stormlight Archive"
  //   "Book 1 of the Mistborn series"  → "Mistborn series"
  //   subtitle: "The X Series"         → "X"
  const detectSeries = (title, subtitle) => {
    const sources = [subtitle, title].filter(Boolean).join(' ');
    const parenMatch = sources.match(/\(([^)]+),?\s*#\d+\)/);
    if (parenMatch) return parenMatch[1].trim();
    const ofMatch = sources.match(/book\s+\d+\s+(?:of|in)\s+(?:the\s+)?(.+)/i);
    if (ofMatch) return ofMatch[1].replace(/[,.].*/, '').trim();
    const seriesMatch = sources.match(/the\s+(.+?)\s+series/i);
    if (seriesMatch) return seriesMatch[1].trim();
    return null;
  };

  // In BookDetail.jsx, replace your loading state with:
  if (loading) {
    const p = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
    return (
      <div className="max-w-3xl mx-auto p-6 flex gap-8">
        <div className={`${p} w-36 h-52 shrink-0`} />
        <div className="flex-1 space-y-3">
          <div className={`${p} h-6 w-2/3`} />
          <div className={`${p} h-4 w-1/3`} />
          <div className={`${p} h-4 w-1/4`} />
          <div className="space-y-2 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${p} h-3 w-full`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Book not found</h2>
          <button onClick={() => navigate('/')} className="text-red-500 hover:text-red-400">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const seriesName = detectSeries(book.title, book.subtitle);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-[300px_1fr] gap-8">

          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start">

            <div className="w-full max-w-[300px] aspect-[2/3] bg-neutral-950 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
              {book.largeThumbnail || book.thumbnail ? (
                <img
                  src={(book.largeThumbnail || book.thumbnail).replace('http://', 'https://')}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-700" />
                </div>
              )}
            </div>

            <div className="w-full max-w-[300px] mt-6 space-y-3">

              {inShelf ? (
                <>
                  <button
                    onClick={() => navigate('/shelf')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    In Your Shelf
                  </button>
                  <button
                    onClick={handleRemoveFromShelf}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Remove from Shelf
                  </button>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Your rating</p>
                    <StarRating
                      rating={shelfEntry?.rating || 0}
                      onChange={handleRating}
                      size="lg"
                    />
                  </div>
                </>
              ) : (
                <button
                  onClick={handleAddToShelf}
                  disabled={addingToShelf}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {addingToShelf ? 'Adding...' : 'Add to Shelf'}
                </button>
              )}

              {/* Buy on Google Play — only when Google actually sells this book */}
              {book.buyLink && book.saleability === 'FOR_SALE' && (
                <a
                  href={book.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy on Google Play
                </a>
              )}

              {/* Find this book — plain search URLs, no API key needed */}
              <div className="pt-1">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  Find this book
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(
                      book.title + ' ' + (book.authors?.[0] || '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    Search on Amazon
                  </a>
                  <a
                    href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    <BookMarked className="w-4 h-4 text-green-400 flex-shrink-0" />
                    View on Goodreads
                  </a>
                  <a
                    href={`https://www.worldcat.org/search?q=${encodeURIComponent(book.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
                    Find in a library
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column */}
          <div className="text-white">

            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>

            {/* Series badge — only renders when a series is detected */}
            {seriesName && (
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400 font-medium">
                  {seriesName}
                </span>
              </div>
            )}

            <p className="text-xl text-gray-400 mb-4">
              by {book.authors.join(', ')}
            </p>

            {book.averageRating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold">{book.averageRating.toFixed(1)}</span>
                </div>
                {book.ratingsCount && (
                  <span className="text-gray-500">
                    ({book.ratingsCount.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              {book.publishedDate && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Published</p>
                    <p className="text-white">{book.publishedDate}</p>
                  </div>
                </div>
              )}
              {book.pageCount && (
                <div className="flex items-center gap-2 text-gray-400">
                  <FileText className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Pages</p>
                    <p className="text-white">{book.pageCount}</p>
                  </div>
                </div>
              )}
              {book.publisher && (
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Publisher</p>
                    <p className="text-white">{book.publisher}</p>
                  </div>
                </div>
              )}
              {book.language && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Language</p>
                    <p className="text-white">{book.language.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>

            {book.categories && book.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">GENRES</h3>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 text-red-400 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-3">About this book</h3>
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;