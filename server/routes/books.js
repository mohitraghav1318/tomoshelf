const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search books endpoint
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=${apiKey}`,
    );

    // Clean up the data before sending to frontend
    const books =
      response.data.items?.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown Author'],
        description: item.volumeInfo.description || 'No description available',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        publishedDate: item.volumeInfo.publishedDate,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        previewLink: item.volumeInfo.previewLink,
      })) || [];

    res.json({ books });
  } catch (error) {
    console.error('Error searching books:', error.message);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// Get single book details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`,
    );

    const item = response.data;
    const book = {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown Author'],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      largeThumbnail:
        item.volumeInfo.imageLinks?.large ||
        item.volumeInfo.imageLinks?.thumbnail,
      publishedDate: item.volumeInfo.publishedDate,
      publisher: item.volumeInfo.publisher,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      language: item.volumeInfo.language,
      previewLink: item.volumeInfo.previewLink,
      infoLink: item.volumeInfo.infoLink,
      previewLink: item.volumeInfo.previewLink,
      infoLink: item.volumeInfo.infoLink,

      // Buy links — from saleInfo block
      buyLink: item.saleInfo?.buyLink || null,
      saleability: item.saleInfo?.saleability || null,
      // e.g. "FOR_SALE", "FREE", "NOT_FOR_SALE", "BY_GOOGLE"

      // Series — Google Books has no series field,
      // but many books put it in subtitle e.g. "Book 1 of Harry Potter"
      // or inside the title itself. We extract it best-effort.
      subtitle: item.volumeInfo.subtitle || null,
    };

    res.json({ book });
  } catch (error) {
    console.error('Error fetching book details:', error.message);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

module.exports = router;
