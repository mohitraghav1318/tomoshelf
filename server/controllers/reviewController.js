const Review = require("../models/Review");


// add review
const addReview = async (req, res) => {

    const { rating, comment } = req.body;
    const bookId = req.params.id;

    try {

        const review = await Review.create({
            book: bookId,
            user: req.user,
            rating,
            comment
        });

        res.json(review);

    } catch (error) {

        res.status(500).json({ message: "Error adding review" });

    }
};


// get reviews for book
const getBookReviews = async (req, res) => {

    const bookId = req.params.id;

    try {

        const reviews = await Review
            .find({ book: bookId })
            .populate("user", "name");

        res.json(reviews);

    } catch (error) {

        res.status(500).json({ message: "Error fetching reviews" });

    }
};

module.exports = {
    addReview,
    getBookReviews
};