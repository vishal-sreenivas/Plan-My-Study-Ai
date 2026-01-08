// Activity controller
// Handles activity logging and retrieval for contribution calendar

import prisma from '../config/database.js';
import { AppError, asyncHandler } from '../utils/errors.js';

/**
 * Log user activity
 * Increments count if entry exists for today, otherwise creates new entry
 */
export const logActivity = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  // Upsert activity log
  const activity = await prisma.activityLog.upsert({
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

  res.json({
    success: true,
    data: {
      activity,
    },
  });
});

/**
 * Get all activity for the authenticated user
 * Returns activity for the last year (365 days)
 */
export const getUserActivity = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  // Calculate date range (last 365 days)
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  startDate.setHours(0, 0, 0, 0);

  // Fetch activities
  const activities = await prisma.activityLog.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Calculate total contributions
  const totalContributions = activities.reduce((sum, activity) => sum + activity.count, 0);

  res.json({
    success: true,
    data: {
      activities,
      totalContributions,
    },
  });
});

