import { useEffect, useState } from "react";
import API from "../api/axios";
import BookCard from "../components/BookCard";
import "./Home.css";

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
        <div className="home-container">

            <h1 className="home-title">TomoShelf Library</h1>

            {books.length === 0 ? (
                <p>No books uploaded yet.</p>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Home;