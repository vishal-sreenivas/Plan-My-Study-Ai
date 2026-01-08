// Course controller
// Handles course generation, retrieval, and progress tracking

import prisma from '../config/database.js';
import { generateCoursePlan } from '../services/groqService.js';
import { enrichCourseWithVideos } from '../services/youtubeService.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Generate a new course using AI
 * 
 * Process:
 * 1. Validate input (topic, level, days, timePerDay)
 * 2. Generate course plan using OpenAI
 * 3. Enrich with YouTube videos
 * 4. Save to database
 * 5. Return course data
 */
export const generateCourse = asyncHandler(async (req, res, next) => {
  const { topic, level, days, timePerDay } = req.body;
  const userId = req.userId;

  // Validate input
  if (!topic || !level || !days || !timePerDay) {
    throw new AppError('Topic, level, days, and timePerDay are required', 400);
  }

  // Validate level
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (!validLevels.includes(level.toLowerCase())) {
    throw new AppError('Level must be beginner, intermediate, or advanced', 400);
  }

  // Validate days and time
  if (days < 1 || days > 365) {
    throw new AppError('Days must be between 1 and 365', 400);
  }

  if (timePerDay < 15 || timePerDay > 480) {
    throw new AppError('Time per day must be between 15 and 480 minutes', 400);
  }

  // Generate course plan using AI
  let coursePlan = await generateCoursePlan(topic, level, days, timePerDay);

  // Enrich with YouTube videos (non-blocking - don't wait if it fails)
  try {
    coursePlan = await Promise.race([
      enrichCourseWithVideos(coursePlan),
      new Promise((resolve) => setTimeout(() => resolve(coursePlan), 10000)), // 10s timeout for videos
    ]);
  } catch (error) {
    console.log('YouTube enrichment skipped:', error.message);
    // Continue without videos if enrichment fails
  }

  // Save course to database
  const course = await prisma.course.create({
    data: {
      userId,
      topic,
      level: level.toLowerCase(),
      days,
      timePerDay,
      planJson: JSON.stringify(coursePlan),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Parse and return course plan
  const parsedPlan = JSON.parse(course.planJson);

  // Log activity for course generation
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.activityLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        userId,
        date: today,
        count: 1,
      },
    });
  } catch (error) {
    // Don't fail course generation if activity logging fails
    console.error('Failed to log activity:', error);
  }

  res.status(201).json({
    success: true,
    data: {
      course: {
        id: course.id,
        topic: course.topic,
        level: course.level,
        days: course.days,
        timePerDay: course.timePerDay,
        plan: parsedPlan,
        createdAt: course.createdAt,
      },
    },
  });
});

/**
 * Get a specific course by ID
 */
export const getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  // Find course and verify ownership
  const course = await prisma.course.findFirst({
    where: {
      id,
      userId, // Ensure user owns this course
    },
    include: {
      progress: true,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Parse course plan
  const plan = JSON.parse(course.planJson);

  // Get progress summary
  const progressSummary = course.progress.reduce((acc, p) => {
    if (p.completed) {
      acc.completed++;
    }
    acc.total++;
    return acc;
  }, { completed: 0, total: 0 });

  res.json({
    success: true,
    data: {
      course: {
        id: course.id,
        topic: course.topic,
        level: course.level,
        days: course.days,
        timePerDay: course.timePerDay,
        plan,
        progress: progressSummary,
        progressDetails: course.progress.map(p => ({
          day: p.day,
          lessonId: p.lessonId,
          completed: p.completed,
        })),
        createdAt: course.createdAt,
      },
    },
  });
});

/**
 * Get all courses for the authenticated user
 */
export const getUserCourses = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  const courses = await prisma.course.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      progress: true,
    },
  });

  // Transform courses with progress summary
  const coursesWithProgress = courses.map(course => {
    const progress = course.progress.reduce(
      (acc, p) => {
        if (p.completed) acc.completed++;
        acc.total++;
        return acc;
      },
      { completed: 0, total: 0 }
    );

    return {
      id: course.id,
      topic: course.topic,
      level: course.level,
      days: course.days,
      timePerDay: course.timePerDay,
      progress,
      createdAt: course.createdAt,
    };
  });

  res.json({
    success: true,
    data: {
      courses: coursesWithProgress,
    },
  });
});

/**
 * Update lesson progress
 * 
 * Marks a lesson as completed or uncompleted
 */
export const updateProgress = asyncHandler(async (req, res, next) => {
  const { courseId, day, lessonId, completed } = req.body;
  const userId = req.userId;

  // Validate input
  if (!courseId || day === undefined || !lessonId || completed === undefined) {
    throw new AppError('courseId, day, lessonId, and completed are required', 400);
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

  // Upsert progress (create or update)
  const progress = await prisma.progress.upsert({
    where: {
      courseId_day_lessonId: {
        courseId,
        day: parseInt(day),
        lessonId,
      },
    },
    update: {
      completed: completed === true,
      completedAt: completed === true ? new Date() : null,
    },
    create: {
      courseId,
      day: parseInt(day),
      lessonId,
      completed: completed === true,
      completedAt: completed === true ? new Date() : null,
    },
  });

  // Log activity when lesson is marked as completed
  if (completed === true) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.activityLog.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        update: {
          count: {
            increment: 1,
          },
        },
        create: {
          userId,
          date: today,
          count: 1,
        },
      });
    } catch (error) {
      // Don't fail progress update if activity logging fails
      console.error('Failed to log activity:', error);
    }
  }

  res.json({
    success: true,
    data: {
      progress,
    },
  });
});

