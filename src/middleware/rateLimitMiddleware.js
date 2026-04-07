const rateLimit = require('express-rate-limit');

const ONE_MINUTE_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 20;

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

const authLimiter = createLimiter(10); // stricter limit for auth routes to prevent brute-force attacks
const transactionLimiter = createLimiter(5); // safer limit for transaction-related routes to prevent abuse
const generalLimiter = createLimiter(20); // default limit for general routes

module.exports = {
    authLimiter,
    transactionLimiter,
    generalLimiter
};