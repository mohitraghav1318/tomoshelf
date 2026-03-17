const ShelfEntry = require('../models/ShelfEntry');

// @desc    Get user's shelf
// @route   GET /api/shelf
exports.getShelf = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = { user: req.user.id };
        if (status) {
            filter.status = status;
        }

        const shelf = await ShelfEntry.find(filter).sort({ addedAt: -1 });

        res.json({ success: true, shelf });
    } catch (error) {
        console.error('Get shelf error:', error);
        res.status(500).json({ error: 'Failed to fetch shelf' });
    }
};

// @desc    Add book to shelf
// @route   POST /api/shelf
exports.addToShelf = async (req, res) => {
    try {
        const { bookId, bookData, status } = req.body;

        if (!bookId || !bookData) {
            return res.status(400).json({ error: 'Book ID and data are required' });
        }

        // Check if book already in shelf
        const existing = await ShelfEntry.findOne({
            user: req.user.id,
            bookId
        });

        if (existing) {
            return res.status(400).json({ error: 'Book already in your shelf' });
        }

        // Create shelf entry
        const entry = await ShelfEntry.create({
            user: req.user.id,
            bookId,
            bookData,
            status: status || 'want-to-read'
        });

        res.status(201).json({ success: true, entry });
    } catch (error) {
        console.error('Add to shelf error:', error);
        res.status(500).json({ error: 'Failed to add book to shelf' });
    }
};

// @desc    Update shelf entry (status, progress)
// @route   PUT /api/shelf/:id
exports.updateShelfEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, currentPage } = req.body;

        const entry = await ShelfEntry.findOne({
            _id: id,
            user: req.user.id
        });

        if (!entry) {
            return res.status(404).json({ error: 'Shelf entry not found' });
        }

        // Update fields
        if (status) {
            entry.status = status;

            // If marking as completed, set completion date
            if (status === 'completed' && !entry.completedAt) {
                entry.completedAt = new Date();
                entry.currentPage = entry.bookData.pageCount || 0;
            }
        }

        if (currentPage !== undefined) {
            entry.currentPage = currentPage;
        }

        await entry.save();

        res.json({ success: true, entry });
    } catch (error) {
        console.error('Update shelf entry error:', error);
        res.status(500).json({ error: 'Failed to update shelf entry' });
    }
};

// @desc    Remove book from shelf
// @route   DELETE /api/shelf/:id
exports.removeFromShelf = async (req, res) => {
    try {
        const { id } = req.params;

        const entry = await ShelfEntry.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!entry) {
            return res.status(404).json({ error: 'Shelf entry not found' });
        }

        res.json({ success: true, message: 'Book removed from shelf' });
    } catch (error) {
        console.error('Remove from shelf error:', error);
        res.status(500).json({ error: 'Failed to remove book from shelf' });
    }
};

// @desc    Check if book is in shelf
// @route   GET /api/shelf/check/:bookId
exports.checkInShelf = async (req, res) => {
    try {
        const { bookId } = req.params;

        const entry = await ShelfEntry.findOne({
            user: req.user.id,
            bookId
        });

        res.json({
            success: true,
            inShelf: !!entry,
            entry: entry || null
        });
    } catch (error) {
        console.error('Check shelf error:', error);
        res.status(500).json({ error: 'Failed to check shelf' });
    }
};