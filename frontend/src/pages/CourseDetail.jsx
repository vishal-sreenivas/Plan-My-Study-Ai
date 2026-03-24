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
import DayTabs from '../components/DayTabs';
import CourseSharing from '../components/CourseSharing';
import { LessonSkeleton, CourseHeaderSkeleton, TabsSkeleton } from '../components/SkeletonLoader';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import DayProgressBar from '../components/DayProgressBar';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' or 'accordion'
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [showSharingModal, setShowSharingModal] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      const newCourseData = response.data.data.course;
      setCourse(newCourseData);

      // Only auto-select current day on initial load (when course is null)
      if (!course && newCourseData.createdAt && newCourseData.plan?.dailyPlan) {
        const startDate = new Date(newCourseData.createdAt);
        const today = new Date();
        const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = Math.min(Math.max(1, diffDays), newCourseData.plan.dailyPlan.length);
        setActiveDay(currentDay);
      }
    } catch (error) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
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

  const handleRegenerateDay = async (day) => {
    setRegeneratingDay(day);
    try {
      const response = await courseAPI.regenerateDay(id, day);
      toast.success(response.data.message || `Day ${day} regenerated successfully!`);

      // Refresh the course to get updated content
      await fetchCourse();
    } catch (error) {
      console.error('Regenerate day error:', error);
      toast.error(error.response?.data?.message || 'Failed to regenerate day');
    } finally {
      setRegeneratingDay(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="py-8 px-4 max-w-7xl mx-auto">
            <CourseHeaderSkeleton />
            <div className="mt-8">
              <TabsSkeleton />
              <LessonSkeleton />
            </div>
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
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSharingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-xl font-medium transition-colors border border-blue-300 dark:border-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Share
                </motion.button>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Daily Study Plan
              </h2>

              {/* View mode toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-surface rounded-lg p-1">
                <button
                  onClick={() => setViewMode('tabs')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'tabs'
                      ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Tabs
                </button>
                <button
                  onClick={() => setViewMode('accordion')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'accordion'
                      ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All Days
                </button>
              </div>
            </div>

            {/* Day Progress Bar */}
            {course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 && (
              <DayProgressBar
                dailyPlan={course.plan.dailyPlan}
                completionMap={completionMap}
              />
            )}

            {/* Day Tabs Navigation */}
            {viewMode === 'tabs' && course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 && (
              <DayTabs
                days={course.plan.dailyPlan}
                activeDay={activeDay}
                onDayChange={setActiveDay}
                completionMap={completionMap}
                courseCreatedAt={course.createdAt}
                courseId={id}
                onRegenerateDay={handleRegenerateDay}
                regeneratingDay={regeneratingDay}
              />
            )}

            <div className="space-y-4">
              {course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 ? (
                viewMode === 'tabs' ? (
                  // Tabs view: Show only active day
                  (() => {
                    const day = course.plan.dailyPlan.find(d => d.day === activeDay) || course.plan.dailyPlan[0];
                    return day ? (
                      <DayCard
                        key={day.day}
                        day={day}
                        courseId={id}
                        isExpanded={true}
                        onToggle={() => {}}
                        onLessonToggle={handleLessonToggle}
                        completionMap={completionMap}
                        index={0}
                      />
                    ) : null;
                  })()
                ) : (
                  // Accordion view: Show all days
                  course.plan.dailyPlan.map((day, index) => (
                    <DayCard
                      key={day?.day || index}
                      day={day}
                      courseId={id}
                      isExpanded={activeDay === day?.day}
                      onToggle={() => setActiveDay(activeDay === day?.day ? null : day?.day)}
                      onLessonToggle={handleLessonToggle}
                      completionMap={completionMap}
                      index={index}
                    />
                  ))
                )
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

          {/* Course Sharing Modal */}
          <CourseSharing
            courseId={id}
            isOpen={showSharingModal}
            onClose={() => setShowSharingModal(false)}
            courseName={course.plan?.overview?.title || course.topic || 'Untitled Course'}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CourseDetail;
