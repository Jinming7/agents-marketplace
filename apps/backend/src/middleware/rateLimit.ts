import rateLimit from 'express-rate-limit'

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Stricter limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})
