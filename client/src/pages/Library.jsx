import { useEffect, useState } from "react";
import API from "../api/axios";
import BookGrid from "../components/dashboard/BookGrid";

const Library = () => {

    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchBooks = async (status) => {

        try {

            setLoading(true);

            const url =
                status === "all"
                    ? "/library"
                    : `/library/${status}`;

            const res = await API.get(url);

            // because backend returns { book: {...} }
            const formatted = res.data.map(item => item.book);

            setBooks(formatted);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchBooks(filter);
    }, [filter]);

    return (

        <div className="max-w-6xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-bold mb-8">
                My Library
            </h1>

            {/* Filters */}

            <div className="flex gap-4 mb-8 flex-wrap">

                <button
                    onClick={() => setFilter("all")}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("continue")}
                    className="bg-blue-200 px-4 py-2 rounded"
                >
                    Continue Reading
                </button>

                <button
                    onClick={() => setFilter("plan")}
                    className="bg-yellow-200 px-4 py-2 rounded"
                >
                    Plan to Read
                </button>

                <button
                    onClick={() => setFilter("completed")}
                    className="bg-green-200 px-4 py-2 rounded"
                >
                    Completed
                </button>

            </div>

            {/* Books */}

            {loading ? (

                <p>Loading books...</p>

            ) : books.length === 0 ? (

                <p className="text-gray-500">
                    No books found in this collection.
                </p>

            ) : (

                <BookGrid books={books} />

            )}

        </div>
    );
};

export default Library;