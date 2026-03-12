const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadBook,
    getAllBooks,
    getBookById,
    deleteBook,
    updateBook,
    getMyBooks
} = require("../controllers/bookController");

//show all books
router.get("/", getAllBooks);
// books uploaded by current user
router.get("/my", authMiddleware, getMyBooks);
//show book by id
router.get("/:id", getBookById);
//delete book by id
router.delete("/:id", authMiddleware, deleteBook);
// update book by id
router.put("/:id", authMiddleware, updateBook);
// Upload a book (PDF)
router.post(
    "/uploads",
    authMiddleware,
    upload,
    uploadBook
);


module.exports = router;