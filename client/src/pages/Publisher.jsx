import { useEffect, useState } from "react";
import API from "../api/axios";
import BookGrid from "../components/dashboard/BookGrid";

const Publisher = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {

        try {

            const res = await API.get("/books/my");

            // handle both cases
            const data = res.data.books || res.data;

            setBooks(data);

        } catch (err) {

            console.error("Error fetching published books:", err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading books...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-bold mb-8">
                My Published Books
            </h1>

            {books.length === 0 ? (
                <p className="text-gray-500">
                    You haven't published any books yet.
                </p>
            ) : (
                <BookGrid books={books} />
            )}

        </div>
    );
};

export default Publisher;