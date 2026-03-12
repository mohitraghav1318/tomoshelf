const express = require("express");
const router = express.Router();

const {
    getMe,
    updateUser,
    deleteUser,
    getDashboardStats
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");


// get current user
router.get("/me", authMiddleware, getMe);


// dashboard stats
router.get("/dashboard", authMiddleware, getDashboardStats);


// update profile
router.put("/update", authMiddleware, updateUser);


// delete account
router.delete("/delete", authMiddleware, deleteUser);


module.exports = router;