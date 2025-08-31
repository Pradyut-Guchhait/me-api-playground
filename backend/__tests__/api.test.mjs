
import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

// Import the server app by creating a fresh instance per test file
import express from 'express';
import profileRoutes from '../src/routes/profileRoutes.js';
import { apiLimiter } from '../src/middleware/rateLimiter.js';

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api', apiLimiter, profileRoutes);

describe('Me-API', () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/me_api_playground';
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('projects endpoint paginates', async () => {
    const res = await request(app).get('/api/projects?limit=1&page=1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
  });

  it('skills top returns array', async () => {
    const res = await request(app).get('/api/skills/top?limit=3');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
