const express = require('express');
const router = express.Router();
const { signup, login, getMe, verify2FALogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-2fa', verify2FALogin);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;