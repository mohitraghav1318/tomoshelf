import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BookDetails = () => {

    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const fetchBook = async () => {
        try {

            const res = await API.get(`/books/${id}`);
            setBook(res.data);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchReviews = async () => {
        try {

            const res = await API.get(`/reviews/book/${id}`);
            setReviews(res.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [id]);

    const submitReview = async () => {

        try {

            await API.post(`/reviews/${id}`, {
                rating,
                comment
            });

            setComment("");
            fetchReviews();

        } catch (error) {
            console.error(error);
        }
    };

    const addToLibrary = async () => {

        try {

            await API.post(`/library/${id}`);

            alert("Book added to your library 📚");

        } catch (error) {
            console.error(error);
        }
    };

    if (!book) {
        return (
            <div className="text-center py-20">
                Loading book...
            </div>
        );
    }

    const coverUrl = book.coverImage
        ? `${API_BASE}/${book.coverImage.replace(/\\/g, "/")}`
        : null;

    const avgRating = reviews.length
        ? (
            reviews.reduce((a, b) => a + b.rating, 0) /
            reviews.length
        ).toFixed(1)
        : "No rating";

    return (

        <div className="max-w-5xl mx-auto px-6 py-10">

            <div className="grid md:grid-cols-2 gap-10">

                {/* Cover */}
                {coverUrl && (
                    <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                )}

                {/* Details */}
                <div className="flex flex-col gap-4">

                    <h1 className="text-3xl font-bold">
                        {book.title}
                    </h1>

                    <p className="text-gray-600">
                        {book.description}
                    </p>

                    <p className="text-sm text-gray-500">
                        Uploaded by: {book.uploadedBy?.name}
                    </p>

                    {/* Rating */}
                    <p className="text-yellow-500 font-medium">
                        ⭐ {avgRating}
                    </p>

                    <div className="flex gap-3 mt-4">

                        <Link
                            to={`/read/${book._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
                        >
                            Read Book
                        </Link>

                        <button
                            onClick={addToLibrary}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md"
                        >
                            Add to Library
                        </button>

                    </div>

                </div>

            </div>


            {/* Review Section */}

            <div className="mt-12">

                <h2 className="text-2xl font-bold mb-6">
                    Reviews
                </h2>

                {/* Add Review */}

                <div className="flex flex-col gap-3 mb-8">

                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border p-2 rounded w-32"
                    >
                        <option value="1">1 ⭐</option>
                        <option value="2">2 ⭐</option>
                        <option value="3">3 ⭐</option>
                        <option value="4">4 ⭐</option>
                        <option value="5">5 ⭐</option>
                    </select>

                    <textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <button
                        onClick={submitReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
                    >
                        Submit Review
                    </button>

                </div>


                {/* Review List */}

                <div className="flex flex-col gap-6">

                    {reviews.length === 0 && (
                        <p className="text-gray-500">
                            No reviews yet.
                        </p>
                    )}

                    {reviews.map((review) => (

                        <div
                            key={review._id}
                            className="border p-4 rounded-lg"
                        >

                            <p className="text-yellow-500">
                                ⭐ {review.rating}
                            </p>

                            <p className="text-gray-700 mt-1">
                                {review.comment}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                                by {review.user?.name}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
};

export default BookDetails;