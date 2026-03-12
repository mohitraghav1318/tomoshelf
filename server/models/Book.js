const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        coverImage: {
            type: String,
            required: true
        },

        coverPublicId: {
            type: String,
            required: true
        },

        pdfUrl: {
            type: String,
            required: true
        },

        pdfPublicId: {
            type: String,
            required: true
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);