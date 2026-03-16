const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'TomoShelf API is running 🚀' });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
