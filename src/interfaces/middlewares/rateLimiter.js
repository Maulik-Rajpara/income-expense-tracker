/**
 * Rate Limiting Middleware
 * Protects API from abuse and ensures fair usage
 */
import rateLimit from 'express-rate-limit';

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again later'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || null,
        path: req.originalUrl
      }
    });
  }
});

// Stricter limiter for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 write requests per windowMs
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many write requests from this IP, please try again later'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many write requests from this IP, please try again later'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || null,
        path: req.originalUrl
      }
    });
  }
});

export { apiLimiter, writeLimiter };
