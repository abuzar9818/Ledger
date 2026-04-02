const rateLimit = require('express-rate-limit');

const ONE_MINUTE_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 20;

function jsonRateLimitHandler(req, res) {
    return res.status(429).json({
        status: 'failed',
        message: 'Too many requests, please try again later.'
    });
}

const authLimiter = rateLimit({
    windowMs: ONE_MINUTE_MS,
    max: MAX_REQUESTS_PER_MINUTE,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonRateLimitHandler
});

const transactionLimiter = rateLimit({
    windowMs: ONE_MINUTE_MS,
    max: MAX_REQUESTS_PER_MINUTE,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonRateLimitHandler
});

module.exports = {
    authLimiter,
    transactionLimiter
};
