require('dotenv').config();
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit'); 

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

        keyGenerator: (req) => {
            if (req.user) {
                return req.user._id.toString();
            }

            return ipKeyGenerator(req);
        },

        standardHeaders: true,
        legacyHeaders: false,
        handler: jsonRateLimitHandler
    });
}


const authLimiter = createLimiter(LOGIN_RATE_LIMIT);
const transactionLimiter = createLimiter(TRANSACTION_RATE_LIMIT);
const generalLimiter = createLimiter(MAX_REQUESTS_PER_MINUTE);


module.exports = {
    authLimiter,
    transactionLimiter,
    generalLimiter
};