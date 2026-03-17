const mongoose = require('mongoose');

const shelfEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    // Book data cached from Google Books API
    bookData: {
        title: String,
        authors: [String],
        thumbnail: String,
        publishedDate: String,
        pageCount: Number,
        categories: [String],
        description: String
    },
    // Reading status
    status: {
        type: String,
        enum: ['reading', 'completed', 'want-to-read'],
        default: 'want-to-read'
    },
    // Progress tracking
    currentPage: {
        type: Number,
        default: 0
    },
    // Timestamps
    addedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Compound index to prevent duplicate entries
shelfEntrySchema.index({ user: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('ShelfEntry', shelfEntrySchema);