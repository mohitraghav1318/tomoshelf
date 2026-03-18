import BookCard from './BookCard';
import { Loader2 } from 'lucide-react';

const SearchResults = ({ books, loading, onBookClick, title = "Search Results" }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">
          {title} ({books.length})
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
