import { BookOpen, Star } from 'lucide-react';

const BookCard = ({ book, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all cursor-pointer group"
    >
      <div className="aspect-[2/3] bg-gray-800 relative overflow-hidden">
        {book.thumbnail ? (
          <img
            src={book.thumbnail.replace('http://', 'https://')}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-700" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-gray-400 text-xs mb-2">{book.authors.join(', ')}</p>

        {book.averageRating && (
          <div className="flex items-center gap-1 text-yellow-500 text-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>{book.averageRating.toFixed(1)}</span>
            {book.ratingsCount && (
              <span className="text-gray-500">({book.ratingsCount})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
