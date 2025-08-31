
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();
const app = express();

// Enable trust proxy for correct client IPs behind Render/Heroku etc.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Configure CORS (lock down in production via CORS_ORIGIN)
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin, credentials: false }));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/me_api_playground';
const PORT = process.env.PORT || 4000;

// Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api', apiLimiter, profileRoutes);

// Serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Connect and start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
