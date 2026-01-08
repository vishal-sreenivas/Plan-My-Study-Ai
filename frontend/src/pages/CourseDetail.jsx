import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';
import { exportCourseToPDF } from '../utils/pdfExport';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import ModuleCard from '../components/cards/ModuleCard';
import DayCard from '../components/cards/DayCard';
import { LessonSkeleton } from '../components/SkeletonLoader';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import DayProgressBar from '../components/DayProgressBar';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState(new Set([1]));

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.data.course);
    } catch (error) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleLessonToggle = async (day, lessonId, completed) => {
    try {
      await courseAPI.updateProgress({
        courseId: id,
        day,
        lessonId,
        completed: !completed,
      });
      fetchCourse();
      toast.success(completed ? 'Lesson marked as incomplete' : 'Lesson completed!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleExportPDF = () => {
    if (course) {
      exportCourseToPDF(course);
      toast.success('PDF exported successfully!');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-8 px-4">
            <div className="glass-card p-8 mb-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full"></div>
              </div>
            </div>
            <LessonSkeleton />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-8 px-4">
            <div className="glass-card text-center py-12">
              <p className="text-gray-600 dark:text-dark-text-muted mb-4">Course not found</p>
              <Link to="/dashboard" className="btn-primary inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const progressPercent =
    course.progress?.total > 0
      ? Math.round(((course.progress?.completed || 0) / (course.progress?.total || 1)) * 100)
      : 0;

  // Safety check for course plan
  if (!course.plan) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-8 px-4">
            <div className="glass-card text-center py-12">
              <p className="text-gray-600 dark:text-dark-text-muted mb-4">
                Course plan data is missing or invalid.
              </p>
              <Link to="/dashboard" className="btn-primary inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Build completion map from progress data
  const completionMap = new Map();
  if (course.progressDetails && Array.isArray(course.progressDetails)) {
    course.progressDetails.forEach((progress) => {
      const key = `${progress.day}-${progress.lessonId}`;
      completionMap.set(key, progress.completed === true);
    });
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8 px-4 max-w-7xl mx-auto">
          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-8 p-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {course.plan?.overview?.title || course.topic || 'Untitled Course'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-dark-text-muted">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium capitalize">
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {course.days} days
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.timePerDay} min/day
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border text-gray-700 dark:text-dark-text rounded-xl font-medium transition-colors border border-gray-300 dark:border-dark-border"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </motion.button>
            </div>

            {/* Animated Progress Bar */}
            <AnimatedProgressBar
              completed={course.progress?.completed || 0}
              total={course.progress?.total || 0}
              label="Overall Progress"
            />

            {/* Course Description */}
            {course.plan?.overview?.description && (
              <p className="text-gray-700 dark:text-dark-text mb-6 leading-relaxed">
                {course.plan.overview.description}
              </p>
            )}

            {/* Learning Objectives */}
            {course.plan?.overview?.objectives && Array.isArray(course.plan.overview.objectives) && course.plan.overview.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Learning Objectives
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.plan.overview.objectives.map((objective, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                    >
                      <svg
                        className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-dark-text">
                        {objective}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Modules Section */}
          {course.plan?.modules && Array.isArray(course.plan.modules) && course.plan.modules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Course Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.plan.modules.map((module, index) => (
                  <ModuleCard key={module?.id || index} module={module} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Daily Plan Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Daily Study Plan
            </h2>
            
            {/* Day Progress Bar */}
            {course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 && (
              <DayProgressBar 
                dailyPlan={course.plan.dailyPlan} 
                completionMap={completionMap}
              />
            )}
            
            <div className="space-y-4">
              {course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 ? (
                course.plan.dailyPlan.map((day, index) => (
                  <DayCard
                    key={day?.day || index}
                    day={day}
                    isExpanded={expandedDays.has(day?.day)}
                    onToggle={() => toggleDay(day?.day)}
                    onLessonToggle={handleLessonToggle}
                    completionMap={completionMap}
                    index={index}
                  />
                ))
              ) : (
                <div className="glass-card p-8 text-center">
                  <p className="text-gray-600 dark:text-dark-text-muted">No daily plan available yet.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CourseDetail;
