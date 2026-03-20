const express = require('express');
const router = express.Router();
const {
    updateProfile,
    setup2FA,
    verify2FA,
    disable2FA,
    requestDeleteAccount,
    confirmDeleteAccount
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// Update profile
router.put('/profile', protect, updateProfile);

// 2FA Routes
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/disable', protect, disable2FA);

// Account Deletion
router.post('/delete-account/request', protect, requestDeleteAccount);
router.delete('/delete-account/confirm', protect, confirmDeleteAccount);

module.exports = router;
