import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CourseProgressBar = ({ courses = [] }) => {
  const [displayCompleted, setDisplayCompleted] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  // Calculate completion: a course is completed if all its lessons are completed
  const total = courses.length;
  const completed = courses.filter(course => {
    const progress = course.progress || { completed: 0, total: 0 };
    return progress.total > 0 && progress.completed === progress.total;
  }).length;

  const percentage = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  // Count-up animation for numbers
  useEffect(() => {
    if (total === 0) {
      setDisplayCompleted(0);
      setDisplayTotal(0);
      return;
    }

    const duration = 800; // 0.8 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const completedStep = completed / steps;
    const totalStep = total / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayCompleted(Math.min(Math.round(completedStep * currentStep), completed));
        setDisplayTotal(Math.min(Math.round(totalStep * currentStep), total));
      } else {
        setDisplayCompleted(completed);
        setDisplayTotal(total);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [completed, total]);

  if (total === 0) {
    return (
      <div className="mb-8">
        <div className="glass-card p-6">
          <p className="text-center text-gray-600 dark:text-dark-text-muted">
            No courses yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-dark-text mb-3">
          <span className="text-lg font-semibold">Your Progress</span>
          <motion.span
            key={percentage}
            initial={{ scale: 1.2, color: '#6366f1' }}
            animate={{ scale: 1, color: '#6366f1' }}
            transition={{ duration: 0.3 }}
            className="text-indigo-600 dark:text-indigo-400 font-bold text-lg"
          >
            {percentage}%
          </motion.span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-4 overflow-hidden relative">
          {/* Animated progress fill with gradient */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-sm relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </div>
        <motion.p
          key={`${displayCompleted}-${displayTotal}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-600 dark:text-dark-text-muted mt-3"
        >
          <motion.span
            key={displayCompleted}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-semibold text-indigo-600 dark:text-indigo-400"
          >
            {displayCompleted}
          </motion.span>{' '}
          of{' '}
          <motion.span
            key={displayTotal}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-semibold"
          >
            {displayTotal}
          </motion.span>{' '}
          courses completed
          {percentage > 0 && (
            <motion.span
              key={percentage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-1"
            >
              ({percentage}%)
            </motion.span>
          )}
        </motion.p>
      </div>
    </div>
  );
};

export default CourseProgressBar;

