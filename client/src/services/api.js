const API_URL = 'http://localhost:5000/api';

export const searchBooks = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/books/search?query=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`);
    const data = await response.json();
    return data.book;
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};
