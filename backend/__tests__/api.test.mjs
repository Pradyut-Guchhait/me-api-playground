
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/server.js';

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
});
