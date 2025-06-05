const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const HealthEntry = require('../models/HealthEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/user/profile
// @desc    Update user profile (username, email)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user._id;

        // Build update object
        const updateData = {};

        if (username !== undefined) {
            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({
                    error: 'Username must be between 3 and 30 characters'
                });
            }

            // Check if username is already taken by another user
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }

            updateData.username = username;
        }

        if (email !== undefined) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({
                email: email.toLowerCase(),
                _id: { $ne: userId }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            updateData.email = email.toLowerCase();
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                notificationSettings: updatedUser.notificationSettings,
                privacySettings: updatedUser.privacySettings
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});

// @route   PUT /api/user/password
// @desc    Change user password
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Please provide current password and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update password (will be hashed by pre-save middleware)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error changing password' });
    }
});

// @route   PUT /api/user/notifications
// @desc    Update notification settings
// @access  Private
router.put('/notifications', auth, async (req, res) => {
    try {
        const { dailyReminders, weeklyReports, healthAlerts, reminderTime } = req.body;

        const updateData = {};

        if (dailyReminders !== undefined) {
            updateData['notificationSettings.dailyReminders'] = dailyReminders;
        }
        if (weeklyReports !== undefined) {
            updateData['notificationSettings.weeklyReports'] = weeklyReports;
        }
        if (healthAlerts !== undefined) {
            updateData['notificationSettings.healthAlerts'] = healthAlerts;
        }
        if (reminderTime !== undefined) {
            updateData['notificationSettings.reminderTime'] = reminderTime;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Notification settings updated successfully',
            notificationSettings: updatedUser.notificationSettings
        });
    } catch (error) {
        console.error('Update notifications error:', error);
        res.status(500).json({ error: 'Server error updating notification settings' });
    }
});

// @route   PUT /api/user/privacy
// @desc    Update privacy settings
// @access  Private
router.put('/privacy', auth, async (req, res) => {
    try {
        const { biometricLock, autoBackup, anonymousData } = req.body;

        const updateData = {};

        if (biometricLock !== undefined) {
            updateData['privacySettings.biometricLock'] = biometricLock;
        }
        if (autoBackup !== undefined) {
            updateData['privacySettings.autoBackup'] = autoBackup;
        }
        if (anonymousData !== undefined) {
            updateData['privacySettings.anonymousData'] = anonymousData;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Privacy settings updated successfully',
            privacySettings: updatedUser.privacySettings
        });
    } catch (error) {
        console.error('Update privacy error:', error);
        res.status(500).json({ error: 'Server error updating privacy settings' });
    }
});

// @route   GET /api/user/settings
// @desc    Get all user settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            notificationSettings: user.notificationSettings,
            privacySettings: user.privacySettings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Server error fetching settings' });
    }
});

// @route   POST /api/user/export-data
// @desc    Export user data (for GDPR compliance)
// @access  Private
router.post('/export-data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const healthEntries = await HealthEntry.find({ userId: req.user._id });

        const exportData = {
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                notificationSettings: user.notificationSettings,
                privacySettings: user.privacySettings
            },
            healthEntries: healthEntries.map(entry => ({
                date: entry.date,
                answers: entry.answers,
                score: entry.score,
                result: entry.result,
                color: entry.color,
                createdAt: entry.createdAt
            })),
            exportDate: new Date().toISOString(),
            totalEntries: healthEntries.length
        };

        res.json({
            message: 'Data export ready',
            data: exportData
        });
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({ error: 'Server error exporting data' });
    }
});

// @route   DELETE /api/user/account
// @desc    Delete user account and all data
// @access  Private
router.delete('/account', auth, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: 'Please provide your password to confirm account deletion'
            });
        }

        // Verify password
        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Password is incorrect' });
        }

        // Delete all user's health entries
        await HealthEntry.deleteMany({ userId: req.user._id });

        // Delete user account
        await User.findByIdAndDelete(req.user._id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Server error deleting account' });
    }
});

module.exports = router;