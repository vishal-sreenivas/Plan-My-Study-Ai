// Note controller
// Handles CRUD operations for lesson notes

import prisma from '../config/database.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Get note for a specific lesson
 * GET /api/notes/:courseId/:day/:lessonId
 */
export const getNote = asyncHandler(async (req, res, next) => {
  const { courseId, day, lessonId } = req.params;
  const userId = req.userId;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Get note
  const note = await prisma.note.findUnique({
    where: {
      courseId_day_lessonId: {
        courseId,
        day: parseInt(day),
        lessonId,
      },
    },
  });

  res.json({
    success: true,
    data: {
      note: note || null,
    },
  });
});

/**
 * Create or update note for a lesson
 * PUT /api/notes/:courseId/:day/:lessonId
 */
export const upsertNote = asyncHandler(async (req, res, next) => {
  const { courseId, day, lessonId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  // Validate content
  if (content === undefined || content === null) {
    throw new AppError('Content is required', 400);
  }

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // If content is empty, delete the note
  if (content.trim() === '') {
    await prisma.note.deleteMany({
      where: {
        courseId,
        day: parseInt(day),
        lessonId,
      },
    });

    return res.json({
      success: true,
      data: {
        note: null,
      },
    });
  }

  // Upsert note
  const note = await prisma.note.upsert({
    where: {
      courseId_day_lessonId: {
        courseId,
        day: parseInt(day),
        lessonId,
      },
    },
    update: {
      content,
    },
    create: {
      userId,
      courseId,
      day: parseInt(day),
      lessonId,
      content,
    },
  });

  res.json({
    success: true,
    data: {
      note,
    },
  });
});

/**
 * Get all notes for a course
 * GET /api/notes/:courseId
 */
export const getCourseNotes = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.userId;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Get all notes for this course
  const notes = await prisma.note.findMany({
    where: {
      courseId,
    },
    orderBy: [
      { day: 'asc' },
      { createdAt: 'asc' },
    ],
  });

  res.json({
    success: true,
    data: {
      notes,
    },
  });
});

/**
 * Delete note
 * DELETE /api/notes/:courseId/:day/:lessonId
 */
export const deleteNote = asyncHandler(async (req, res, next) => {
  const { courseId, day, lessonId } = req.params;
  const userId = req.userId;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Delete note
  await prisma.note.deleteMany({
    where: {
      courseId,
      day: parseInt(day),
      lessonId,
    },
  });

  res.json({
    success: true,
    message: 'Note deleted successfully',
  });
});
