import { Link } from "react-router-dom";

const BookCard = ({ book }) => {

    // Cloudinary already gives full URL
    const coverUrl = book.coverImage || null;

    const avgRating =
        typeof book.avgRating === "number" && book.avgRating > 0
            ? book.avgRating.toFixed(1)
            : null;

    return (

        <Link to={`/book/${book._id}`}>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">

                {/* Cover OR Placeholder */}

                {coverUrl ? (

                    <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-56 object-cover"
                    />

                ) : (

                    <div className="w-full h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center text-white p-4 text-center">

                        <h3 className="font-bold text-lg line-clamp-2">
                            {book.title}
                        </h3>

                        <p className="text-sm mt-2 opacity-90">
                            {book.uploadedBy?.name || "Unknown Author"}
                        </p>

                    </div>

                )}

                {/* Content */}

                <div className="p-4 flex flex-col gap-2">

                    <h3 className="text-lg font-semibold line-clamp-1">
                        {book.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">
                        {book.description}
                    </p>

                    <p className="text-xs text-gray-500">
                        Uploaded by: {book.uploadedBy?.name}
                    </p>

                    {/* Rating */}

                    <div className="flex items-center gap-2 text-sm">

                        {avgRating ? (
                            <span className="text-yellow-500 font-semibold">
                                ⭐ {avgRating} / 5
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs">
                                No ratings yet
                            </span>
                        )}

                    </div>

                </div>

            </div>

        </Link>

    );
};

export default BookCard;