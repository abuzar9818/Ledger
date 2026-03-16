const mongoose = require('mongoose');

const tokenblacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting"],
        unique: true
    }
}, {
    timestamps: true
})

tokenblacklistSchema.index({ createdAt: 1},
    {expireAfterSeconds: 60 * 60 * 24 * 3} // 3 days
);

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenblacklistSchema);

module.exports = tokenBlacklist;