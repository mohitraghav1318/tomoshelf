import "./BookCard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BookCard = ({ book }) => {

    const coverUrl = book.coverImage
        ? `${API_BASE}/${book.coverImage.replace(/\\/g, "/")}`
        : null;

    const pdfUrl = `${API_BASE}/${book.pdfUrl.replace(/\\/g, "/")}`;

    return (
        <div className="book-card">

            {coverUrl && (
                <img
                    className="book-cover"
                    src={coverUrl}
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
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                Read Book
            </a>

        </div>
    );
};

export default BookCard;