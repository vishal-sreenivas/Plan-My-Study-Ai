// Note routes
// Defines endpoints for creating, reading, updating, and deleting lesson notes

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getNote,
  upsertNote,
  getCourseNotes,
  deleteNote,
} from '../controllers/noteController.js';

const router = express.Router();

// All note routes require authentication
router.use(authenticate);

// GET /api/notes/:courseId - Get all notes for a course
router.get('/:courseId', getCourseNotes);

// GET /api/notes/:courseId/:day/:lessonId - Get specific note
router.get('/:courseId/:day/:lessonId', getNote);

// PUT /api/notes/:courseId/:day/:lessonId - Create or update note
router.put('/:courseId/:day/:lessonId', upsertNote);

// DELETE /api/notes/:courseId/:day/:lessonId - Delete note
router.delete('/:courseId/:day/:lessonId', deleteNote);

export default router;
