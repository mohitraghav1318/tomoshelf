const Library = require("../models/Library");


// add book to library
const addToLibrary = async (req, res) => {

    const bookId = req.params.id;
    const { status } = req.body;

    try {

        const exists = await Library.findOne({
            user: req.user,
            book: bookId
        });

        if (exists) {
            return res.json({ message: "Already in library" });
        }

        const saved = await Library.create({
            user: req.user,
            book: bookId,
            status: status || "plan",
            progress: 0
        });

        res.json(saved);

    } catch (error) {

        res.status(500).json({ message: "Error adding to library" });

    }

};


// update reading progress
const updateProgress = async (req, res) => {

    const { bookId, progress } = req.body;

    try {

        const entry = await Library.findOne({
            user: req.user,
            book: bookId
        });

        if (!entry) {
            return res.status(404).json({ message: "Book not in library" });
        }

        entry.progress = progress;
        entry.status = "continue";

        await entry.save();

        res.json(entry);

    } catch (error) {

        res.status(500).json({ message: "Error updating progress" });

    }

};


// get ALL books in library
const getLibrary = async (req, res) => {

    try {

        const books = await Library.find({
            user: req.user
        })
            .populate("book")
            .sort({ updatedAt: -1 });

        res.json(books);

    } catch (error) {

        res.status(500).json({ message: "Error fetching library" });

    }

};


// get books by collection
const getCollection = async (req, res) => {

    const status = req.params.status;

    try {

        const books = await Library.find({
            user: req.user,
            status
        })
            .populate("book")
            .sort({ updatedAt: -1 });

        res.json(books);

    } catch (error) {

        res.status(500).json({ message: "Error fetching collection" });

    }

};


module.exports = {
    addToLibrary,
    updateProgress,
    getLibrary,
    getCollection
};