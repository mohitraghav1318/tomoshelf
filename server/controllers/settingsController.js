const User = require('../models/User');
const ShelfEntry = require('../models/ShelfEntry');
const { sendOTP, sendDeleteOTP } = require('../services/emailService');
const crypto = require('crypto');

// Generate numeric OTP
const generateOTP = (length = 6) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))).toString();
};

/* ─── Profile Updates ─────────────────────────────────────────────────────── */

// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if username/email already exists (excluding current user)
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) return res.status(400).json({ error: 'Username already taken' });
            user.username = username;
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ error: 'Email already in use' });
            user.email = email;
            // If email changes, we might want to disable 2FA until re-verified, 
            // but for now, we'll just update it.
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error during profile update' });
    }
};

/* ─── Two-Factor Authentication (2FA) ─────────────────────────────────────── */

// @desc    Request 2FA setup OTP
// @route   POST /api/settings/2fa/setup
// @access  Private
const setup2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = generateOTP(6);
        user.twoFactorOTP = otp;
        user.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendOTP(user.email, otp);
        res.json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
};

// @desc    Verify 2FA OTP and enable
// @route   POST /api/settings/2fa/verify
// @access  Private
const verify2FA = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !user.twoFactorOTP) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        if (user.twoFactorOTP !== otp || Date.now() > user.twoFactorOTPExpires) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        user.twoFactorEnabled = true;
        user.twoFactorOTP = null;
        user.twoFactorOTPExpires = null;
        await user.save();

        res.json({ message: 'Two-factor authentication enabled successfully', twoFactorEnabled: true });
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Failed to verify 2FA code' });
    }
};

// @desc    Disable 2FA
// @route   POST /api/settings/2fa/disable
// @access  Private
const disable2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.twoFactorEnabled = false;
        await user.save();

        res.json({ message: 'Two-factor authentication disabled', twoFactorEnabled: false });
    } catch (error) {
        console.error('Disable 2FA error:', error);
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
};

/* ─── Account Deletion ────────────────────────────────────────────────────── */

// @desc    Request account deletion OTP
// @route   POST /api/settings/delete-account/request
// @access  Private
const requestDeleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const otp = generateOTP(4); // 4-digit as requested
        user.deleteAccountOTP = otp;
        user.deleteAccountOTPExpires = Date.now() + 3 * 60 * 1000; // 3 minutes as requested
        await user.save();

        await sendDeleteOTP(user.email, otp);
        res.json({ message: 'Deletion code sent. Valid for 3 minutes.' });
    } catch (error) {
        console.error('Delete request error:', error);
        res.status(500).json({ error: 'Failed to send deletion code' });
    }
};

// @desc    Confirm account deletion
// @route   DELETE /api/settings/delete-account/confirm
// @access  Private
const confirmDeleteAccount = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !user.deleteAccountOTP) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        if (user.deleteAccountOTP !== otp || Date.now() > user.deleteAccountOTPExpires) {
            return res.status(400).json({ error: 'Invalid or expired deletion code' });
        }

        // Delete all shelf entries for this user
        await ShelfEntry.deleteMany({ user: user._id });

        // Delete the user
        await User.findByIdAndDelete(user._id);

        res.json({ message: 'Account and all associated data deleted successfully' });
    } catch (error) {
        console.error('Delete confirmation error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

module.exports = {
    updateProfile,
    setup2FA,
    verify2FA,
    disable2FA,
    requestDeleteAccount,
    confirmDeleteAccount
};
