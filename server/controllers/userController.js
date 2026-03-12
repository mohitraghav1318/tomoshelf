const User = require("../models/User");
const Library = require("../models/Library");
const Book = require("../models/Book");


// GET current user
const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user).select("-password");

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// UPDATE user profile
const updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;

        await user.save();

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

};


// DELETE account
const deleteUser = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.user);

        res.json({ message: "Account deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

};

// GET dashboard stats
const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user;

        const libraryCount = await Library.countDocuments({
            user: userId
        });

        const publishedCount = await Book.countDocuments({
            uploadedBy: userId
        });

        const completedCount = await Library.countDocuments({
            user: userId,
            status: "completed"
        });

        const continueCount = await Library.countDocuments({
            user: userId,
            status: "continue"
        });

        res.json({
            library: libraryCount,
            published: publishedCount,
            achievements: completedCount,
            collections: continueCount
        });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};


module.exports = {
    getMe,
    updateUser,
    deleteUser,
    getDashboardStats
};