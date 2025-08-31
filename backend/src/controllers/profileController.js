
import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) return res.json(null);
  res.json(profile);
};

export const createProfile = async (req, res) => {
  const existing = await Profile.findOne();
  if (existing) return res.status(409).json({ error: 'Profile already exists. Use PUT to update.' });
  const doc = await Profile.create(req.body);
  res.status(201).json(doc);
};

export const updateProfile = async (req, res) => {
  const updated = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  res.json(updated);
};

export const topSkills = async (req, res) => {
  const limit = Math.max(1, parseInt(req.query.limit || '5', 10));
  const profile = await Profile.findOne();
  if (!profile) return res.json([]);
  const sorted = [...profile.skills].sort((a,b)=> (b.level||0)-(a.level||0)).slice(0, limit);
  res.json(sorted);
};

export const filterProjects = async (req, res) => {
  const { skill } = req.query;
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
  const profile = await Profile.findOne();
  if (!profile) return res.json({ total:0, page, limit, items: [] });
  let projects = profile.projects || [];
  if (skill) projects = projects.filter(p => (p.skills||[]).map(s=>s.toLowerCase()).includes((skill||'').toLowerCase()));
  const total = projects.length;
  const start = (page - 1) * limit;
  const items = projects.slice(start, start + limit);
  res.json({ total, page, limit, items });
};

export const searchAll = async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json([]);
  const p = await Profile.findOne().lean();
  if (!p) return res.json([]);

  const hits = [];
  const addHit = (type, data, score) => hits.push({ type, score, data });

  const textFields = [p.name, p.headline, p.summary];
  if (textFields.some(t => (t||'').toLowerCase().includes(q))) addHit('profile', { name: p.name, email: p.email }, 3);

  (p.skills||[]).forEach(s => {
    if ((s.name||'').toLowerCase().includes(q)) addHit('skill', s, 2);
  });

  (p.projects||[]).forEach(project => {
    const match = [project.title, project.description, ...(project.skills||[])].some(t => (t||'').toLowerCase().includes(q));
    if (match) addHit('project', project, 2);
  });

  (p.work||[]).forEach(w => {
    const match = [w.role, w.org, w.summary].some(t => (t||'').toLowerCase().includes(q));
    if (match) addHit('work', w, 1);
  });

  res.json(hits.sort((a,b)=> b.score - a.score));
};
