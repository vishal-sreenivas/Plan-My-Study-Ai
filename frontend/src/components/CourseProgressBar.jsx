import { useMemo } from 'react';
import { motion } from 'framer-motion';

const CourseProgressBar = ({ courses = [] }) => {
  // Calculate all progress stats
  const stats = useMemo(() => {
    if (courses.length === 0) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        inProgressCourses: 0,
        coursePercentage: 0,
        lessonPercentage: 0,
      };
    }

    let totalLessons = 0;
    let completedLessons = 0;
    let completedCourses = 0;
    let inProgressCourses = 0;

    courses.forEach(course => {
      const progress = course.progress || { completed: 0, total: 0 };
      totalLessons += progress.total || 0;
      completedLessons += progress.completed || 0;

      if (progress.total > 0) {
        if (progress.completed === progress.total) {
          completedCourses++;
        } else if (progress.completed > 0) {
          inProgressCourses++;
        }
      }
    });

    return {
      totalCourses: courses.length,
      completedCourses,
      totalLessons,
      completedLessons,
      inProgressCourses,
      coursePercentage: courses.length > 0 ? Math.round((completedCourses / courses.length) * 100) : 0,
      lessonPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  }, [courses]);

  // Get motivational message based on progress
  const getMessage = () => {
    if (stats.lessonPercentage === 0) return "Start your learning journey today!";
    if (stats.lessonPercentage < 25) return "Great start! Keep building momentum!";
    if (stats.lessonPercentage < 50) return "You're making solid progress!";
    if (stats.lessonPercentage < 75) return "More than halfway there! Amazing!";
    if (stats.lessonPercentage < 100) return "Almost there! Final stretch!";
    return "Congratulations! You've completed everything!";
  };

  if (stats.totalCourses === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Progress
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-text-muted mt-0.5">
            {getMessage()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {stats.lessonPercentage}%
          </span>
          <span className="text-sm text-gray-500 dark:text-dark-text-muted">complete</span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.lessonPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-primary-600 rounded-full relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Completed Courses */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedCourses}</p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Completed</p>
        </div>

        {/* In Progress Courses */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgressCourses}</p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">In Progress</p>
        </div>

        {/* Total Courses */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalCourses}</p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Total Courses</p>
        </div>

        {/* Lessons Completed */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.completedLessons}<span className="text-sm font-normal text-gray-400">/{stats.totalLessons}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-dark-text-muted">Lessons</p>
        </div>
      </div>

      {/* Course Progress Breakdown (show top 3 in-progress courses) */}
      {stats.inProgressCourses > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-dark-border">
          <p className="text-sm font-medium text-gray-700 dark:text-dark-text mb-3">Continue Learning</p>
          <div className="space-y-3">
            {courses
              .filter(course => {
                const progress = course.progress || { completed: 0, total: 0 };
                return progress.total > 0 && progress.completed > 0 && progress.completed < progress.total;
              })
              .slice(0, 3)
              .map(course => {
                const progress = course.progress || { completed: 0, total: 0 };
                const percent = Math.round((progress.completed / progress.total) * 100);
                return (
                  <div key={course.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {course.topic}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5 mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-dark-text-muted whitespace-nowrap">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CourseProgressBar;

