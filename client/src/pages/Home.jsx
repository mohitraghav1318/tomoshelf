import { useEffect, useState } from "react";
import API from "../api/axios";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";

const Home = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const res = await API.get("/books");
            setBooks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold mb-8 text-center">
                TomoShelf Library
            </h1>

            {loading ? (

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array(8).fill(0).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>

            ) : books.length === 0 ? (

                <p className="text-center text-gray-500">
                    No books uploaded yet.
                </p>

            ) : (

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>

            )}

        </div>
    );
};

export default Home;