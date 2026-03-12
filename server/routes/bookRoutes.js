const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadBook, getAllBooks, getBookById, deleteBook, updateBook } = require("../controllers/bookController");

//show all books
router.get("/", getAllBooks);
//show book by id
router.get("/:id", getBookById);
//delete book by id
router.delete("/:id", authMiddleware, deleteBook);
// update book by id
router.put("/:id", authMiddleware, updateBook);
// Upload a book (PDF)
// debug middleware / handlers types
console.log("[bookRoutes] authMiddleware type:", typeof authMiddleware, authMiddleware);
console.log("[bookRoutes] upload type:", typeof upload, upload);
console.log("[bookRoutes] uploadBook type:", typeof uploadBook, uploadBook);
router.post(
    "/uploads",
    authMiddleware,
    upload,
    uploadBook
);


module.exports = router;