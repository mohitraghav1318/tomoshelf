const express = require("express");
const router = express.Router();

const {
    getMe,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");


// get current user
router.get("/me", authMiddleware, getMe);


// update profile
router.put("/update", authMiddleware, updateUser);


// delete account
router.delete("/delete", authMiddleware, deleteUser);


module.exports = router;