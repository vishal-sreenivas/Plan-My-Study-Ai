import { useMemo } from 'react';
import { motion } from 'framer-motion';

const DayProgressBar = ({ dailyPlan = [], completionMap = new Map() }) => {
  // Calculate day and lesson completion stats
  const stats = useMemo(() => {
    if (!dailyPlan || dailyPlan.length === 0) {
      return {
        totalDays: 0,
        completedDays: 0,
        totalLessons: 0,
        completedLessons: 0,
        currentDay: null,
        dayPercentage: 0,
        lessonPercentage: 0,
      };
    }

    let completedDays = 0;
    let totalLessons = 0;
    let completedLessons = 0;
    let currentDay = null;

    dailyPlan.forEach((day) => {
      if (!day.lessons || day.lessons.length === 0) return;

      const dayLessons = day.lessons.length;
      totalLessons += dayLessons;

      let dayCompletedLessons = 0;
      day.lessons.forEach((lesson) => {
        const completionKey = `${day.day}-${lesson.id}`;
        if (completionMap.get(completionKey) === true) {
          dayCompletedLessons++;
          completedLessons++;
        }
      });

      if (dayCompletedLessons === dayLessons) {
        completedDays++;
      } else if (dayCompletedLessons > 0 && !currentDay) {
        currentDay = { ...day, completed: dayCompletedLessons, total: dayLessons };
      } else if (!currentDay && completedDays === day.day - 1) {
        currentDay = { ...day, completed: 0, total: dayLessons };
      }
    });

    return {
      totalDays: dailyPlan.length,
      completedDays,
      totalLessons,
      completedLessons,
      currentDay,
      dayPercentage: dailyPlan.length > 0 ? Math.round((completedDays / dailyPlan.length) * 100) : 0,
      lessonPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  }, [dailyPlan, completionMap]);

  // Get motivational message
  const getMessage = () => {
    if (stats.lessonPercentage === 0) return "Ready to begin? Start with Day 1!";
    if (stats.lessonPercentage < 25) return "Great start! Keep the momentum going!";
    if (stats.lessonPercentage < 50) return "You're making excellent progress!";
    if (stats.lessonPercentage < 75) return "Over halfway done! Keep pushing!";
    if (stats.lessonPercentage < 100) return "Almost there! You've got this!";
    return "Course completed! Well done!";
  };

  if (stats.totalDays === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Course Progress
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-text-muted">
            {getMessage()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {stats.lessonPercentage}%
          </span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5 overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.lessonPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 rounded-full relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completedDays}</p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Days Done</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.totalDays - stats.completedDays}</p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Days Left</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {stats.completedLessons}<span className="text-sm font-normal text-gray-400">/{stats.totalLessons}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Lessons</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DayProgressBar;

