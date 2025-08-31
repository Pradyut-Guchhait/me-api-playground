
import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  level: { type: Number, min: 1, max: 10, default: 5 }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  links: [String],
  skills: [{ type: String, index: true }]
}, { _id: true });

const WorkSchema = new mongoose.Schema({
  role: String,
  org: String,
  start: String,
  end: String,
  summary: String
}, { _id: true });

const LinksSchema = new mongoose.Schema({
  github: String,
  linkedin: String,
  portfolio: String,
  website: String
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  start: String,
  end: String
}, { _id: true });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  headline: String,
  summary: String,
  skills: [SkillSchema],
  projects: [ProjectSchema],
  work: [WorkSchema],
  education: [EducationSchema],
  links: LinksSchema
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema);
