// Course controller
// Handles course generation, retrieval, and progress tracking

import prisma from '../config/database.js';
import { generateCoursePlan, regenerateSingleDay } from '../services/groqService.js';
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

  // Enrich with YouTube videos (respects time budget)
  try {
    coursePlan = await Promise.race([
      enrichCourseWithVideos(coursePlan, timePerDay),
      new Promise((resolve) => setTimeout(() => resolve(coursePlan), 30000)), // 30s timeout for videos
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
 * Generate a new course with SSE progress updates
 *
 * Same as generateCourse but sends real-time progress via Server-Sent Events
 * Events: start, plan-generating, plan-complete, video-fetching, video-complete, saving, complete, error
 */
export const generateCourseWithSSE = async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // Helper to send SSE event
  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const { topic, level, days, timePerDay } = req.body;
    const userId = req.userId;

    // Validate input
    if (!topic || !level || !days || !timePerDay) {
      sendEvent('error', { message: 'Topic, level, days, and timePerDay are required' });
      return res.end();
    }

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
      sendEvent('error', { message: 'Level must be beginner, intermediate, or advanced' });
      return res.end();
    }

    if (days < 1 || days > 365) {
      sendEvent('error', { message: 'Days must be between 1 and 365' });
      return res.end();
    }

    if (timePerDay < 15 || timePerDay > 480) {
      sendEvent('error', { message: 'Time per day must be between 15 and 480 minutes' });
      return res.end();
    }

    // Step 1: Start
    sendEvent('start', { message: 'Starting course generation...' });

    // Step 2: Generate course plan
    sendEvent('plan-generating', { message: 'Creating your personalized study plan...' });

    let coursePlan;
    try {
      coursePlan = await generateCoursePlan(topic, level, days, timePerDay);
      sendEvent('plan-complete', {
        message: 'Study plan created!',
        days: coursePlan.dailyPlan?.length || days,
        modules: coursePlan.modules?.length || 0,
      });
    } catch (error) {
      sendEvent('error', { message: error.message || 'Failed to generate course plan' });
      return res.end();
    }

    // Step 3: Enrich with YouTube videos
    sendEvent('video-fetching', { message: 'Finding the best videos for each lesson...', day: 0, totalDays: days });

    try {
      // Video progress callback
      const onVideoProgress = (progress) => {
        sendEvent(progress.type, {
          message: progress.message,
          day: progress.day,
          totalDays: progress.totalDays,
        });
      };

      coursePlan = await Promise.race([
        enrichCourseWithVideos(coursePlan, timePerDay, onVideoProgress),
        new Promise((resolve) => setTimeout(() => resolve(coursePlan), 45000)), // 45s timeout
      ]);

      sendEvent('video-complete', { message: 'All videos found!' });
    } catch (error) {
      console.log('YouTube enrichment failed:', error.message);
      sendEvent('video-complete', { message: 'Videos partially loaded' });
    }

    // Step 4: Save to database
    sendEvent('saving', { message: 'Saving your course...' });

    const course = await prisma.course.create({
      data: {
        userId,
        topic,
        level: level.toLowerCase(),
        days,
        timePerDay,
        planJson: JSON.stringify(coursePlan),
      },
    });

    // Log activity
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.activityLog.upsert({
        where: { userId_date: { userId, date: today } },
        update: { count: { increment: 1 } },
        create: { userId, date: today, count: 1 },
      });
    } catch (e) {
      console.error('Failed to log activity:', e);
    }

    // Step 5: Complete
    sendEvent('complete', {
      message: 'Course created successfully!',
      course: {
        id: course.id,
        topic: course.topic,
        level: course.level,
        days: course.days,
        timePerDay: course.timePerDay,
        plan: coursePlan,
        createdAt: course.createdAt,
      },
    });

    res.end();
  } catch (error) {
    console.error('SSE course generation error:', error);
    sendEvent('error', { message: error.message || 'An unexpected error occurred' });
    res.end();
  }
};

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

/**
 * Delete a course
 *
 * Deletes a course and all associated progress records (via cascade)
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Delete the course (progress records are deleted via cascade)
  await prisma.course.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Course deleted successfully',
  });
});

/**
 * Regenerate a single day in a course
 *
 * Allows users to regenerate content for a specific day without redoing the entire course
 */
export const regenerateDay = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Course ID
  const { day } = req.body; // Day number to regenerate
  const userId = req.userId;

  // Validate input
  if (!day || day < 1) {
    throw new AppError('Valid day number is required', 400);
  }

  // Get the course
  const course = await prisma.course.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Parse the existing plan
  const existingPlan = JSON.parse(course.planJson);

  // Validate day exists
  if (!existingPlan.dailyPlan || day > existingPlan.dailyPlan.length) {
    throw new AppError('Invalid day number for this course', 400);
  }

  // Regenerate the specific day
  const regeneratedDay = await regenerateSingleDay(
    existingPlan,
    day,
    course.topic,
    course.level,
    course.timePerDay
  );

  // Enrich with YouTube videos
  let enrichedDay = regeneratedDay;
  try {
    const tempPlan = {
      ...existingPlan,
      dailyPlan: [regeneratedDay],
    };

    const enrichedPlan = await Promise.race([
      enrichCourseWithVideos(tempPlan, course.timePerDay),
      new Promise((resolve) => setTimeout(() => resolve(tempPlan), 15000)), // 15s timeout
    ]);

    enrichedDay = enrichedPlan.dailyPlan[0];
  } catch (error) {
    console.log('YouTube enrichment skipped for regenerated day:', error.message);
  }

  // Update the course plan
  const updatedDailyPlan = existingPlan.dailyPlan.map((d) =>
    d.day === day ? enrichedDay : d
  );

  const updatedPlan = {
    ...existingPlan,
    dailyPlan: updatedDailyPlan,
  };

  // Save updated plan
  await prisma.course.update({
    where: { id },
    data: {
      planJson: JSON.stringify(updatedPlan),
    },
  });

  res.json({
    success: true,
    message: `Day ${day} regenerated successfully`,
    data: {
      day: enrichedDay,
    },
  });
});

/**
 * Generate or update share token for course
 * POST /api/course/:id/share
 */
export const shareCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isPublic } = req.body;
  const userId = req.userId;

  // Validate input
  if (typeof isPublic !== 'boolean') {
    throw new AppError('isPublic must be a boolean value', 400);
  }

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  let updateData = {
    isPublic,
  };

  // Generate share token if making public or if no token exists
  if (isPublic && !course.shareToken) {
    // Generate a unique share token (8 character string)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shareToken = '';
    for (let i = 0; i < 8; i++) {
      shareToken += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    updateData.shareToken = shareToken;
  }

  // If making private, keep the token but set isPublic to false
  // This allows the user to re-enable sharing with the same link

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: updateData,
  });

  res.json({
    success: true,
    data: {
      isPublic: updatedCourse.isPublic,
      shareToken: updatedCourse.shareToken,
      shareUrl: updatedCourse.isPublic && updatedCourse.shareToken
        ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shared/${updatedCourse.shareToken}`
        : null,
    },
  });
});

/**
 * Get shared course by token (public access)
 * GET /api/course/shared/:token
 */
export const getSharedCourse = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError('Share token is required', 400);
  }

  // Find course by share token
  const course = await prisma.course.findFirst({
    where: {
      shareToken: token,
      isPublic: true, // Only return if course is public
    },
    include: {
      user: {
        select: {
          name: true, // Only include creator name
        },
      },
    },
  });

  if (!course) {
    throw new AppError('Shared course not found or no longer available', 404);
  }

  // Parse course plan
  const plan = JSON.parse(course.planJson);

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
        createdAt: course.createdAt,
        creator: course.user.name,
        isShared: true, // Flag to indicate this is a shared course
      },
    },
  });
});

/**
 * Get sharing status for a course
 * GET /api/course/:id/sharing
 */
export const getSharingStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  // Verify course ownership
  const course = await prisma.course.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      isPublic: true,
      shareToken: true,
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.json({
    success: true,
    data: {
      isPublic: course.isPublic,
      shareToken: course.shareToken,
      shareUrl: course.isPublic && course.shareToken
        ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/shared/${course.shareToken}`
        : null,
    },
  });
});

