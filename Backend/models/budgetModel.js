const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Budget must be associated with a user"],
        index: true
    },
    category: {
        type: String,
        enum: {
            values: ["FOOD", "RENT", "OTHER", "TRANSFER"],
            message: "Invalid budget category"
        },
        required: [true, "Category is required"]
    },
    limit: {
        type: Number,
        required: [true, "Budget limit is required"],
        min: [0, "Budget limit cannot be negative"]
    },
    period: {
        type: String, // Format: YYYY-MM
        required: [true, "Budget period is required"],
        match: [/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format"]
    }
}, {
    timestamps: true
});

// Ensure a user can only have one budget per category per period
budgetSchema.index({ user: 1, category: 1, period: 1 }, { unique: true });

const budgetModel = mongoose.model('Budget', budgetSchema);

module.exports = budgetModel;
