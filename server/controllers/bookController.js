const Book = require("../models/Book");

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

const getAllBooks = async (req, res) => {
    try {

        const books = await Book.find().populate("uploadedBy", "name email");

        res.json(books);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookById = async (req, res) => {
    try {

        const book = await Book.findById(req.params.id)
            .populate("uploadedBy", "name email");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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