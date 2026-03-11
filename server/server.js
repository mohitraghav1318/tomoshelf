// import required packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// custom imports
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const libraryRoutes = require("./routes/libraryRoutes");

// load environment variables
dotenv.config();

// connect to the database
connectDB();

// Create Express application
const app = express();

// Enable CORS for frontend communication
app.use(
    cors({
        origin: process.env.CORS_ORIGIN, // Allow requests from the specified origin
        credentials: true
    })
);

// Middleware to parse JSON bodies
app.use(express.json());

// authentication routes
app.use("/api/auth", authRoutes);

// book routes
app.use("/api/books", bookRoutes);

// user routes
app.use("/api/users", userRoutes);

// review routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/library", libraryRoutes);

// Serve uploaded files (images, PDFs)
app.use("/uploads", express.static("uploads"));

// Test route to check if backend is running
app.get("/", (req, res) => {
    res.send("Tomoshelf Backend is running!");
});


// Error handling middleware (should be last middleware)
app.use(errorHandler);

// Server port configuration  
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});