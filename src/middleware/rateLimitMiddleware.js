require('dotenv').config();
const rateLimit = require('express-rate-limit');

const ONE_MINUTE_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE =
    process.env.MAX_REQUESTS_PER_MINUTE || 20;
const LOGIN_RATE_LIMIT =
    process.env.LOGIN_RATE_LIMIT || 5;
const TRANSACTION_RATE_LIMIT =
    process.env.TRANSACTION_RATE_LIMIT || 5;

    
function jsonRateLimitHandler(req, res) {
    return res.status(429).json({
        status: 'failed',
        message: 'Too many requests, please try again later.'
    });
}

function createLimiter(maxRequests = MAX_REQUESTS_PER_MINUTE) {
    return rateLimit({
        windowMs: ONE_MINUTE_MS,
        max: maxRequests,
        skip: (req) => req.user?.role === "SYSTEM",
        keyGenerator: (req) =>
            req.user ? req.user._id.toString() : req.ip,
        standardHeaders: true,
        legacyHeaders: false,
        handler: jsonRateLimitHandler
    });
}

const authLimiter = createLimiter(LOGIN_RATE_LIMIT); // stricter limit for auth routes to prevent brute-force attacks
const transactionLimiter = createLimiter(TRANSACTION_RATE_LIMIT); // safer limit for transaction-related routes to prevent abuse
const generalLimiter = createLimiter(MAX_REQUESTS_PER_MINUTE); // default limit for general routes

module.exports = {
    authLimiter,
    transactionLimiter,
    generalLimiter
};