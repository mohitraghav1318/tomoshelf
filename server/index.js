const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Health check — used by frontend to detect cold start
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


// Import routes made by me
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const shelfRoutes = require('./routes/shelf');
const settingsRoutes = require('./routes/settingsRoutes');

// Use routes also know as controllers and api endpoints
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/settings', settingsRoutes);

// Test route faltu hai
app.get('/', (req, res) => {
  res.json({ message: 'TomoShelf API is running 🚀' });
});

// Start server and connect to MongoDB at the same time, if MongoDB connection fails, server won't start
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();