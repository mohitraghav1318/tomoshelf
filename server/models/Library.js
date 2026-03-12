const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        status: {
            type: String,
            enum: ["continue", "plan", "completed"],
            default: "plan"
        },

        progress: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Library", librarySchema);