const Book = require("../models/Book");
const Review = require("../models/Review");

// upload book and save to database
const uploadBook = async (req, res) => {
    try {

        const pdfFile = req.files["pdf"]?.[0];
        const coverFile = req.files["cover"]?.[0];

        const book = new Book({
            title: req.body.title,
            description: req.body.description,
            pdfUrl: pdfFile.path,
            coverImage: coverFile ? coverFile.path : "",
            uploadedBy: req.user
        });

        await book.save();

        res.json({
            message: "Book uploaded successfully",
            book
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all books with uploader info
const getAllBooks = async (req, res) => {
    try {

        const books = await Book.find()
            .populate("uploadedBy", "name email");

        const booksWithRatings = await Promise.all(

            books.map(async (book) => {

                const reviews = await Review.find({ book: book._id });

                const avgRating =
                    reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

                return {
                    ...book._doc,
                    avgRating
                };

            })
        );

        res.json(booksWithRatings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get book by id with uploader info
const getBookById = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id)
            .populate("uploadedBy", "name email");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const reviews = await Review.find({ book: book._id });

        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.json({
            ...book._doc,
            avgRating
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete book by id (only uploader can delete)
const deleteBook = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Authorization check
        if (book.uploadedBy.toString() !== req.user) {
            return res.status(403).json({ message: "Not allowed to delete this book" });
        }

        await book.deleteOne();

        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update book by id (only uploader can update)
const updateBook = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Authorization check
        if (book.uploadedBy.toString() !== req.user) {
            return res.status(403).json({ message: "Not allowed to update this book" });
        }

        // Update fields
        book.title = req.body.title || book.title;
        book.description = req.body.description || book.description;

        await book.save();

        res.json({
            message: "Book updated successfully",
            book
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadBook, getAllBooks, getBookById, deleteBook, updateBook };