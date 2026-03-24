import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * StreakCounter - Display current and longest learning streaks
 *
 * Features:
 * - Fire emoji animation for active streaks
 * - Current streak display
 * - Longest streak badge
 * - Motivational messages
 */
const StreakCounter = ({ activities }) => {
  // Calculate streaks from activity data
  const { currentStreak, longestStreak } = useMemo(() => {
    if (!activities || activities.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort activities by date (newest first)
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Calculate current streak (consecutive days from today backwards)
    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].date);
      activityDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === expectedDate.getTime()) {
        current++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longest = 0;
    let tempStreak = 1;

    for (let i = 0; i < sortedActivities.length - 1; i++) {
      const current = new Date(sortedActivities[i].date);
      const next = new Date(sortedActivities[i + 1].date);

      const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longest = Math.max(longest, tempStreak, current);

    return { currentStreak: current, longestStreak: longest };
  }, [activities]);

  // Get motivational message based on streak
  const getMessage = () => {
    if (currentStreak === 0) {
      return "Start your streak today!";
    } else if (currentStreak === 1) {
      return "Great start! Keep it going!";
    } else if (currentStreak < 7) {
      return "You're on fire! Keep learning!";
    } else if (currentStreak < 30) {
      return "Amazing consistency! 🎉";
    } else {
      return "Legendary dedication! 🏆";
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
      <div className="flex items-start justify-between">
        {/* Current Streak */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={currentStreak > 0 ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="text-4xl"
            >
              🔥
            </motion.div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-text-muted">
                Current Streak
              </p>
              <motion.p
                key={currentStreak}
                initial={{ scale: 1.5, color: '#f97316' }}
                animate={{ scale: 1, color: '#111827' }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
              </motion.p>
            </div>
          </div>

          {/* Motivational message */}
          <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
            {getMessage()}
          </p>
        </div>

        {/* Longest Streak Badge */}
        {longestStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-1 bg-white dark:bg-dark-card rounded-xl px-4 py-3 shadow-md border border-orange-200 dark:border-orange-700"
          >
            <span className="text-xl">🏆</span>
            <p className="text-xs font-medium text-gray-600 dark:text-dark-text-muted text-center">
              Best Streak
            </p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {longestStreak}
            </p>
          </motion.div>
        )}
      </div>

      {/* Milestone progress */}
      {currentStreak > 0 && currentStreak < 30 && (
        <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
          <div className="flex justify-between text-xs text-gray-600 dark:text-dark-text-muted mb-2">
            <span>Next milestone</span>
            <span>
              {currentStreak < 7 ? '7 days' : currentStreak < 14 ? '14 days' : '30 days'}
            </span>
          </div>
          <div className="h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  currentStreak < 7
                    ? (currentStreak / 7) * 100
                    : currentStreak < 14
                      ? ((currentStreak - 7) / 7) * 100
                      : ((currentStreak - 14) / 16) * 100
                }%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            />
          </div>
        </div>
      )}

      {/* Achievement unlocked */}
      {currentStreak === 7 || currentStreak === 14 || currentStreak === 30 || currentStreak === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700"
        >
          <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <span className="text-lg">🎉</span>
            Achievement Unlocked: {currentStreak} Day Streak!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StreakCounter;
