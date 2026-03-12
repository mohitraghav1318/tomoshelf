const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToLibrary,
    updateProgress,
    getLibrary,
    getCollection
} = require("../controllers/libraryController");


// get entire library
router.get("/", authMiddleware, getLibrary);

// get collections
router.get("/:status", authMiddleware, getCollection);

// add book
router.post("/:id", authMiddleware, addToLibrary);

// update reading progress
router.post("/progress", authMiddleware, updateProgress);


module.exports = router;