import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import BookGrid from "../components/dashboard/BookGrid";

const CollectionBooks = () => {

  const { collection } = useParams();
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await API.get(`/library/${collection}`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [collection]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-3xl font-bold mb-8 capitalize">
        {collection} Books
      </h1>

      <BookGrid books={books} />

    </div>
  );
};

export default CollectionBooks;