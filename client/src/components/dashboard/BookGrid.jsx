// 
import BookCard from "../BookCard";

const BookGrid = ({ books }) => {

    if (!books || books.length === 0) {
        return (
            <p className="text-gray-500 text-center py-10">
                No books yet 📚
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
                <BookCard key={book._id} book={book} />
            ))}
        </div>
    );
};

export default BookGrid;