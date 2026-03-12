import { useEffect, useState } from "react";
import API from "../api/axios";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";

const Home = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("newest");
    const [search, setSearch] = useState("");

    const fetchBooks = async () => {

        setLoading(true);

        try {

            const res = await API.get(`/books?sort=${sort}&search=${search}`);
            setBooks(res.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchBooks();
    }, [sort, search]);

    return (

        <div className="max-w-7xl mx-auto px-4 py-10">

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

                <h1 className="text-3xl font-bold">
                    TomoShelf Library
                </h1>

                <div className="flex gap-3">

                    {/* Search */}

                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md"
                    />

                    {/* Sort */}

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="rating">Highest Rating</option>
                        <option value="views">Most Viewed</option>
                    </select>

                </div>

            </div>

            {loading ? (

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                    {Array(8).fill(0).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}

                </div>

            ) : books.length === 0 ? (

                <p className="text-center text-gray-500">
                    No books found.
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