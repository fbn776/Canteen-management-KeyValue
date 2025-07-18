const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {validateRegistration, validateLogin} = require('../middleware/validation');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const {collegeId, password, phone} = req.body;

        // Check if user already exists
        const existingUser = await User.findByCollegeId(collegeId);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this College ID already exists'
            });
        }

        // Create new user
        const user = new User({
            collegeId: collegeId.toUpperCase(),
            password,
            phone,
            role: 'student' // Default role for registration
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    collegeId: user.collegeId,
                    role: user.role,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const {collegeId, password} = req.body;

        // Find user by college ID
        const user = await User.findByCollegeId(collegeId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid college ID or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact admin.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid college ID or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    collegeId: user.collegeId,
                    role: user.role,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.json({
            success: true,
            data: {user}
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const {phone} = req.body;
        const updates = {};

        if (phone) {
            if (!/^[0-9]{10}$/.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be exactly 10 digits'
                });
            }
            updates.phone = phone;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {new: true, runValidators: true}
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {user}
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a more complex setup, you might want to blacklist the token
        // For now, we'll just send a success response
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
});

module.exports = router;