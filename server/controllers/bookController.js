const Book = require("../models/Book");
const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");

// Upload a book
const uploadBook = async (req, res) => {
    try {

        const { title, description } = req.body;

        if (!req.files || !req.files.pdf || !req.files.cover) {
            return res.status(400).json({
                message: "PDF and cover image are required"
            });
        }

        const pdfFile = req.files.pdf[0];
        const coverFile = req.files.cover[0];

        const book = new Book({
            title,
            description,

            pdfUrl: pdfFile.path,
            pdfPublicId: pdfFile.filename,

            coverImage: coverFile.path,
            coverPublicId: coverFile.filename,

            uploadedBy: req.user
        });

        await book.save();

        res.json({
            message: "Book uploaded successfully",
            book
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Get all books
const getAllBooks = async (req, res) => {
    try {

        const books = await Book.find()
            .populate("uploadedBy", "name email")
            .lean();

        const booksWithRatings = await Promise.all(

            books.map(async (book) => {

                const reviews = await Review.find({ book: book._id });

                const avgRating =
                    reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

                return {
                    ...book,
                    avgRating
                };

            })
        );

        res.json(booksWithRatings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get single book
const getBookById = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id)
            .populate("uploadedBy", "name email")
            .lean();

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const reviews = await Review.find({ book: book._id });

        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.json({
            ...book,
            avgRating
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Delete book
const deleteBook = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.uploadedBy.toString() !== req.user) {
            return res.status(403).json({
                message: "Not allowed to delete this book"
            });
        }

        // Delete cover image
        await cloudinary.uploader.destroy(book.coverPublicId);

        // Delete PDF
        await cloudinary.uploader.destroy(book.pdfPublicId, {
            resource_type: "raw"
        });

        await book.deleteOne();

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update book
const updateBook = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.uploadedBy.toString() !== req.user) {
            return res.status(403).json({
                message: "Not allowed to update this book"
            });
        }

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


module.exports = {
    uploadBook,
    getAllBooks,
    getBookById,
    deleteBook,
    updateBook
};