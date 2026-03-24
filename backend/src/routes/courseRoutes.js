// Course routes
// Defines endpoints for course generation and management

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateCourse,
  generateCourseWithSSE,
  getCourse,
  getUserCourses,
  updateProgress,
  deleteCourse,
  regenerateDay,
  shareCourse,
  getSharedCourse,
  getSharingStatus,
} from '../controllers/courseController.js';

const router = express.Router();

// Public route (no authentication required)
// GET /api/course/shared/:token - Get shared course by token
router.get('/shared/:token', getSharedCourse);

// All other course routes require authentication
router.use(authenticate);

// POST /api/course/generate - Generate new course
router.post('/generate', generateCourse);

// POST /api/course/generate-stream - Generate course with SSE progress updates
router.post('/generate-stream', generateCourseWithSSE);

// GET /api/course - Get all user courses
router.get('/', getUserCourses);

// GET /api/course/:id - Get specific course
router.get('/:id', getCourse);

// PUT /api/course/progress - Update lesson progress
router.put('/progress', updateProgress);

// POST /api/course/:id/regenerate-day - Regenerate a specific day
router.post('/:id/regenerate-day', regenerateDay);

// POST /api/course/:id/share - Update course sharing settings
router.post('/:id/share', shareCourse);

// GET /api/course/:id/sharing - Get sharing status for course
router.get('/:id/sharing', getSharingStatus);

// DELETE /api/course/:id - Delete a course
router.delete('/:id', deleteCourse);

export default router;

