
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Profile from '../src/models/Profile.js';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/me_api_playground';

async function run() {
  const dataPath = path.join(process.cwd(), 'backend', 'scripts', 'seed.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const payload = JSON.parse(raw);

  await mongoose.connect(MONGODB_URI);
  await Profile.deleteMany({});
  await Profile.create(payload);
  console.log('Seeded profile for', payload.email);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
