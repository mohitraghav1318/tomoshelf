const Rating = require("../models/Rating");

const rateBook = async (req, res) => {

    const { rating } = req.body;
    const bookId = req.params.id;

    try {

        let existing = await Rating.findOne({
            book: bookId,
            user: req.user
        });

        if (existing) {

            existing.rating = rating;
            await existing.save();

            return res.json(existing);

        }

        const newRating = await Rating.create({
            book: bookId,
            user: req.user,
            rating
        });

        res.json(newRating);

    } catch (error) {

        res.status(500).json({ message: "Rating error" });

    }

};

module.exports = { rateBook };