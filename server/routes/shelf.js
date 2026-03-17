const express = require('express');
const router = express.Router();
const {
    getShelf,
    addToShelf,
    updateShelfEntry,
    removeFromShelf,
    checkInShelf
} = require('../controllers/shelfController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/', getShelf);
router.post('/', addToShelf);
router.put('/:id', updateShelfEntry);
router.delete('/:id', removeFromShelf);
router.get('/check/:bookId', checkInShelf);

module.exports = router;