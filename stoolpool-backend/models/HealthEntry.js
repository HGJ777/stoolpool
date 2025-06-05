const mongoose = require('mongoose');

const healthEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Quiz answers array (matches your frontend structure)
    answers: {
        type: [mongoose.Schema.Types.Mixed], // Allows any type in array
        required: true
    },
    // Calculated score from quiz
    score: {
        type: Number,
        required: true,
        min: 0
    },
    // Result message (e.g., "You are in the clear!")
    result: {
        type: String,
        required: true
    },
    // Color for UI display (green, yellow, red, black)
    color: {
        type: String,
        required: true,
        enum: ['green', 'yellow', 'red', 'black']
    },
    // Date of the entry (when quiz was taken)
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
healthEntrySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('HealthEntry', healthEntrySchema);