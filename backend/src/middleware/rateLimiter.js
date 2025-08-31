
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: parseInt(process.env.RATE_LIMIT_PER_MIN || '60', 10),           // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
