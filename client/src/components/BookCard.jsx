import "./BookCard.css";

const BookCard = ({ book }) => {
    return (
        <div className="book-card">

            {book.coverImage && (
                <img
                    className="book-cover"
                    src={`http://localhost:5000/${book.coverImage}`}
                    alt={book.title}
                />
            )}

            <h3 className="book-title">{book.title}</h3>

            <p className="book-description">{book.description}</p>

            <p className="book-author">
                Uploaded by: {book.uploadedBy?.name}
            </p>

            <a
                className="read-link"
                href={`http://localhost:5000/${book.pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Read Book
            </a>

        </div>
    );
};

export default BookCard;