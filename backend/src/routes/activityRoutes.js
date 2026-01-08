// Activity routes
// Handles activity logging and retrieval endpoints

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { logActivity, getUserActivity } from '../controllers/activityController.js';

const router = express.Router();

// All activity routes require authentication
router.use(authenticate);

// Log activity
router.post('/log', logActivity);

// Get user activity
router.get('/', getUserActivity);

export default router;

