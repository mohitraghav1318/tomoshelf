const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    text: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);