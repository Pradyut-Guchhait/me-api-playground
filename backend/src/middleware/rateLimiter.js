
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: parseInt(process.env.RATE_LIMIT_PER_MIN || '60', 10),
  standardHeaders: true,
  legacyHeaders: false,
});
