const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addReview,
    getBookReviews
} = require("../controllers/reviewController");


// get reviews of book
router.get("/book/:id", getBookReviews);


// add review
router.post("/:id", authMiddleware, addReview);


module.exports = router;