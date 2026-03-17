const API_URL = import.meta.env.VITE_API_URL;

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

// Add this at the bottom of api.js

// Takes an array of completed shelf entries,
// finds the most common genre, searches books by it,
// then removes books the user already has on their shelf
export const getRecommendations = async (completedEntries, allShelfBookIds) => {

  // Step 1 — count how often each category appears across completed books
  // e.g. { "Fiction": 3, "Mystery": 2, "Science": 1 }
  const genreCount = {};
  completedEntries.forEach((entry) => {
    const categories = entry.bookData?.categories || [];
    categories.forEach((cat) => {
      genreCount[cat] = (genreCount[cat] || 0) + 1;
    });
  });

  // Step 2 — pick the genre with the highest count
  // Object.entries gives [["Fiction",3],["Mystery",2]...]
  // sort by count descending, take first
  const topGenre = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
  [0]?.[0];  // ?.[0] safely returns undefined if array is empty

  // No completed books or none have categories — nothing to recommend
  if (!topGenre) return { books: [], genre: null };

  // Step 3 — reuse your existing searchBooks() with the top genre as query
  const results = await searchBooks(topGenre);

  // Step 4 — filter out books already on the shelf
  // allShelfBookIds is an array of bookId strings like ["abc123", "xyz789"]
  const filtered = results.filter(
    (book) => !allShelfBookIds.includes(book.id)
  );

  // Return first 6, plus the genre name so we can show "Because you like Fiction"
  return { books: filtered.slice(0, 6), genre: topGenre };
};