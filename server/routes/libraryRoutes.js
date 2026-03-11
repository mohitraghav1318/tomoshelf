const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { addToLibrary } = require("../controllers/libraryController");


router.post("/:id", authMiddleware, addToLibrary);


module.exports = router;