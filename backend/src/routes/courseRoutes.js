// Course routes
// Defines endpoints for course generation and management

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateCourse,
  getCourse,
  getUserCourses,
  updateProgress,
} from '../controllers/courseController.js';

const router = express.Router();

// All course routes require authentication
router.use(authenticate);

// POST /api/course/generate - Generate new course
router.post('/generate', generateCourse);

// GET /api/course - Get all user courses
router.get('/', getUserCourses);

// GET /api/course/:id - Get specific course
router.get('/:id', getCourse);

// PUT /api/course/progress - Update lesson progress
router.put('/progress', updateProgress);

export default router;

