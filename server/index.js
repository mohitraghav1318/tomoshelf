const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const shelfRoutes = require('./routes/shelf');

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shelf', shelfRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'TomoShelf API is running 🚀' });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
}); 