const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../services/emailService');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If 2FA is enabled, send OTP and don't return token yet
        if (user.twoFactorEnabled) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.twoFactorOTP = otp;
            user.twoFactorOTPExpires = Date.now() + 10 * 60 * 1000;
            await user.save();

            await sendOTP(user.email, otp);

            return res.json({
                success: true,
                twoFactorRequired: true,
                userId: user._id,
                message: 'Two-factor authentication code sent to email'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// @desc    Verify 2FA login
// @route   POST /api/auth/verify-2fa
exports.verify2FALogin = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user || !user.twoFactorOTP) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        if (user.twoFactorOTP !== otp || Date.now() > user.twoFactorOTPExpires) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        // Clear OTP
        user.twoFactorOTP = null;
        user.twoFactorOTPExpires = null;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error('2FA Login verification error:', error);
        res.status(500).json({ error: 'Server error during 2FA verification' });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};