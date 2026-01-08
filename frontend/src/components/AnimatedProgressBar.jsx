import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedProgressBar = ({ completed, total, label = 'Overall Progress' }) => {
  const [displayCompleted, setDisplayCompleted] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Count-up animation for numbers
  useEffect(() => {
    const duration = 1000; // 1 second
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

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-dark-text mb-3">
        <span>{label}</span>
        <motion.span
          key={percentage}
          initial={{ scale: 1.2, color: '#0ea5e9' }}
          animate={{ scale: 1, color: '#0ea5e9' }}
          transition={{ duration: 0.3 }}
          className="text-primary-600 dark:text-primary-400 font-bold"
        >
          {percentage}%
        </motion.span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-3 overflow-hidden relative">
        {/* Background pattern for uncompleted portion */}
        <div className="absolute inset-0 flex">
          <div
            className="h-full bg-gray-300 dark:bg-dark-surface"
            style={{ width: `${100 - percentage}%`, marginLeft: 'auto' }}
          />
        </div>
        {/* Animated progress fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-full shadow-sm relative overflow-hidden"
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
        className="text-xs text-gray-500 dark:text-dark-text-muted mt-2"
      >
        <motion.span
          key={displayCompleted}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="font-semibold text-primary-600 dark:text-primary-400"
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
        lessons completed
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
  );
};

export default AnimatedProgressBar;

