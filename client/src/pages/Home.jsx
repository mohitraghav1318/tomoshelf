import { useEffect, useState } from "react";
import API from "../api/axios";
import BookCard from "../components/BookCard";

const Home = () => {

    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        try {
            const res = await API.get("/books");
            setBooks(res.data);
        } catch (error) {
            console.error(error);
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

            {books.length === 0 ? (
                <p className="text-center text-gray-500">
                    No books uploaded yet.
                </p>
            ) : (

                <div className="grid gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4">

                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}

                </div>

            )}

        </div>
    );
};

export default Home;