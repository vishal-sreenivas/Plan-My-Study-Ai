import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseCard = ({ course, index = 0 }) => {
  const progressPercent =
    course.progress.total > 0
      ? Math.round((course.progress.completed / course.progress.total) * 100)
      : 0;

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[level] || colors.beginner;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/course/${course.id}`}
        className="group relative block h-full"
      >
        <div className="relative h-full bg-white dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl border border-gray-200/50 dark:border-dark-border/50 p-6 transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50 dark:hover:border-primary-500/30 hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-dark-card dark:hover:to-dark-surface">
          {/* Gradient glow on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {course.topic}
              </h3>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ml-2 ${getLevelColor(
                  course.level
                )}`}
              >
                {course.level}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-dark-text-muted">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{course.days} days</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.timePerDay} min/day</span>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-text-muted">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                {course.progress.completed} of {course.progress.total} lessons
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border flex items-center justify-between">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                View Details
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;

