const Library = require("../models/Library");


// add book to library
const addToLibrary = async (req, res) => {

    const bookId = req.params.id;

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
            book: bookId
        });

        res.json(saved);

    } catch (error) {

        res.status(500).json({ message: "Error adding to library" });

    }

};

module.exports = { addToLibrary };