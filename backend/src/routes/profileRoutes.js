
import { Router } from 'express';
import { requireBasicAuthIfConfigured } from '../middleware/auth.js';
import { getProfile, createProfile, updateProfile, topSkills, filterProjects, searchAll } from '../controllers/profileController.js';

const router = Router();

router.get('/profile', getProfile);
router.post('/profile', requireBasicAuthIfConfigured, createProfile);
router.put('/profile', requireBasicAuthIfConfigured, updateProfile);

router.get('/skills/top', topSkills);
router.get('/projects', filterProjects);
router.get('/search', searchAll);

export default router;
