const express = require('express');
const HealthEntry = require('../models/HealthEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/health/entries
// @desc    Save a new health entry (quiz result)
// @access  Private
router.post('/entries', auth, async (req, res) => {
    try {
        const { answers, score, result, color, date } = req.body;

        // Validation
        if (!answers || score === undefined || !result || !color) {
            return res.status(400).json({
                error: 'Please provide answers, score, result, and color'
            });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: 'Answers must be an array' });
        }

        // Create new health entry
        const healthEntry = new HealthEntry({
            userId: req.user._id,
            answers,
            score,
            result,
            color,
            date: date ? new Date(date) : new Date()
        });

        await healthEntry.save();

        res.status(201).json({
            message: 'Health entry saved successfully',
            entry: healthEntry
        });
    } catch (error) {
        console.error('Save health entry error:', error);
        res.status(500).json({ error: 'Server error saving health entry' });
    }
});

// @route   GET /api/health/entries
// @desc    Get user's health entries (history)
// @access  Private
router.get('/entries', auth, async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        const entries = await HealthEntry.find({ userId: req.user._id })
            .sort({ createdAt: -1 }) // Most recent first
            .limit(parseInt(limit))
            .skip(skip);

        const total = await HealthEntry.countDocuments({ userId: req.user._id });

        res.json({
            entries,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get health entries error:', error);
        res.status(500).json({ error: 'Server error fetching health entries' });
    }
});

// @route   GET /api/health/stats
// @desc    Get user's health statistics for dashboard
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all user entries
        const entries = await HealthEntry.find({ userId }).sort({ createdAt: -1 });

        if (entries.length === 0) {
            return res.json({
                totalLogs: 0,
                lastEntry: null,
                mostCommonResult: null,
                weeklyAverage: 0,
                recentTrend: []
            });
        }

        // Calculate stats
        const totalLogs = entries.length;
        const lastEntry = entries[0];

        // Most common result
        const resultCounts = {};
        entries.forEach(entry => {
            resultCounts[entry.result] = (resultCounts[entry.result] || 0) + 1;
        });
        const mostCommonResult = Object.keys(resultCounts).reduce((a, b) =>
            resultCounts[a] > resultCounts[b] ? a : b
        );

        // Weekly average (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyEntries = entries.filter(entry =>
            new Date(entry.createdAt) >= oneWeekAgo
        );
        const weeklyAverage = weeklyEntries.length;

        // Recent trend (last 7 entries for chart)
        const recentTrend = entries.slice(0, 7).reverse().map(entry => ({
            date: entry.createdAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            score: entry.score,
            color: entry.color
        }));

        // Analyze patterns from answers
        const patterns = analyzeAnswerPatterns(entries);

        res.json({
            totalLogs,
            lastEntry: {
                id: lastEntry._id,
                date: lastEntry.createdAt,
                result: lastEntry.result,
                score: lastEntry.score,
                color: lastEntry.color
            },
            mostCommonResult,
            weeklyAverage,
            dailyAverage: (weeklyAverage / 7).toFixed(1),
            recentTrend,
            patterns
        });
    } catch (error) {
        console.error('Get health stats error:', error);
        res.status(500).json({ error: 'Server error fetching health stats' });
    }
});

// @route   DELETE /api/health/entries/:id
// @desc    Delete a health entry
// @access  Private
router.delete('/entries/:id', auth, async (req, res) => {
    try {
        const entry = await HealthEntry.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ error: 'Health entry not found' });
        }

        await HealthEntry.findByIdAndDelete(req.params.id);

        res.json({ message: 'Health entry deleted successfully' });
    } catch (error) {
        console.error('Delete health entry error:', error);
        res.status(500).json({ error: 'Server error deleting health entry' });
    }
});

// Helper function to analyze answer patterns
function analyzeAnswerPatterns(entries) {
    if (entries.length === 0) return {};

    const colors = {};
    const shapes = {};
    const smells = {};
    const painRatings = [];
    const floatTypes = {};

    entries.forEach(entry => {
        if (entry.answers && Array.isArray(entry.answers)) {
            // Color (index 0)
            if (entry.answers[0]) {
                colors[entry.answers[0]] = (colors[entry.answers[0]] || 0) + 1;
            }

            // Shape/Consistency (index 1)
            if (entry.answers[1]) {
                shapes[entry.answers[1]] = (shapes[entry.answers[1]] || 0) + 1;
            }

            // Smell (index 2)
            if (entry.answers[2]) {
                smells[entry.answers[2]] = (smells[entry.answers[2]] || 0) + 1;
            }

            // Pain (index 3) - object with before, during, after
            if (entry.answers[3] && typeof entry.answers[3] === 'object') {
                const pain = entry.answers[3];
                const avgPain = ((pain.before || 0) + (pain.during || 0) + (pain.after || 0)) / 3;
                painRatings.push(avgPain);
            }

            // Float/Sink (index 4)
            if (entry.answers[4] && typeof entry.answers[4] === 'string') {
                const floatType = entry.answers[4].split(':')[0].trim();
                floatTypes[floatType] = (floatTypes[floatType] || 0) + 1;
            }
        }
    });

    // Get most common values
    const getMostCommon = (obj) => {
        if (Object.keys(obj).length === 0) return 'N/A';
        return Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
    };

    return {
        mostCommonColor: getMostCommon(colors),
        mostCommonShape: getMostCommon(shapes),
        mostCommonSmell: getMostCommon(smells),
        avgPainRating: painRatings.length > 0 ?
            (painRatings.reduce((sum, rating) => sum + rating, 0) / painRatings.length).toFixed(1) : 0,
        mostCommonFloat: getMostCommon(floatTypes)
    };
}

module.exports = router;