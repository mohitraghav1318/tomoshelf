import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Calendar, FileText, Globe, Check, Plus } from 'lucide-react';
import { getBookById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { checkBookInShelf, addBookToShelf, removeBookFromShelf } from '../services/shelfService';

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
    if (isAuthenticated && token) {
      checkShelf();
    }
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

  const handleAddToShelf = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Book not found</h2>
          <button onClick={() => navigate('/')} className="text-purple-500 hover:text-purple-400">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-[300px_1fr] gap-8">

          {/* Left Column: Cover + Action Buttons */}
          <div className="flex flex-col items-center md:items-start">

            {/* Book Cover */}
            <div className="w-full max-w-[300px] aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
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

            {/* Action Buttons */}
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
                </>
              ) : (
                <button
                  onClick={handleAddToShelf}
                  disabled={addingToShelf}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {addingToShelf ? 'Adding...' : 'Add to Shelf'}
                </button>
              )}

              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Preview Book
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Book Info */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-400 mb-4">
              by {book.authors.join(', ')}
            </p>

            {/* Rating */}
            {book.averageRating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold">{book.averageRating.toFixed(1)}</span>
                </div>
                {book.ratingsCount && (
                  <span className="text-gray-500">({book.ratingsCount} ratings)</span>
                )}
              </div>
            )}

            {/* Metadata Grid */}
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

            {/* Categories */}
            {book.categories && book.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">GENRES</h3>
                <div className="flex flex-wrap gap-2">
                  {book.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-purple-400 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
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