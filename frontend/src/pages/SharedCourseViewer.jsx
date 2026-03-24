import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ModuleCard from '../components/cards/ModuleCard';
import DayCard from '../components/cards/DayCard';
import DayTabs from '../components/DayTabs';
import { LessonSkeleton, CourseHeaderSkeleton, TabsSkeleton } from '../components/SkeletonLoader';
import AnimatedProgressBar from '../components/AnimatedProgressBar';

/**
 * SharedCourseViewer - Public page for viewing shared courses
 *
 * Features:
 * - View course content without authentication
 * - Read-only mode (no progress tracking, no notes)
 * - Same visual layout as private course view
 * - Shows course creator info
 */
const SharedCourseViewer = () => {
  const { token } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' or 'accordion'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedCourse();
  }, [token]);

  const fetchSharedCourse = async () => {
    if (!token) {
      setError('No share token provided');
      setLoading(false);
      return;
    }

    try {
      const response = await courseAPI.getSharedCourse(token);
      setCourse(response.data.data.course);
      // Auto-select current day based on course start date (for visual purposes only)
      const courseData = response.data.data.course;
      if (courseData.createdAt && courseData.plan?.dailyPlan) {
        const startDate = new Date(courseData.createdAt);
        const today = new Date();
        const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = Math.min(Math.max(1, diffDays), courseData.plan.dailyPlan.length);
        setActiveDay(currentDay);
      }
    } catch (error) {
      console.error('Failed to load shared course:', error);
      if (error.response?.status === 404) {
        setError('Shared course not found or no longer available');
      } else {
        setError('Failed to load course');
      }
    } finally {
      setLoading(false);
    }
  };

  // Dummy progress handlers (no-op for shared courses)
  const handleLessonToggle = () => {
    toast('This is a shared course - progress tracking is not available', {
      icon: '👀',
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-8 px-4 max-w-7xl mx-auto">
          <CourseHeaderSkeleton />
          <div className="mt-8">
            <TabsSkeleton />
            <LessonSkeleton />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-8 px-4">
          <div className="glass-card text-center py-12 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Course Not Available
            </h3>
            <p className="text-gray-600 dark:text-dark-text-muted mb-6">
              {error}
            </p>
            <Link to="/" className="btn-primary inline-block">
              Go to Homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="py-8 px-4">
          <div className="glass-card text-center py-12">
            <p className="text-gray-600 dark:text-dark-text-muted mb-4">Course not found</p>
            <Link to="/" className="btn-primary inline-block">
              Go to Homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Empty completion map for shared courses (no progress tracking)
  const completionMap = new Map();

  return (
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        {/* Shared Course Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">Shared Course</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Created by <span className="font-medium">{course.creator}</span> • Read-only view
              </p>
            </div>
          </div>
        </motion.div>

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
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
            >
              Create Your Own Course
            </Link>
          </div>

          {/* Progress Bar (Empty for shared courses) */}
          <AnimatedProgressBar
            completed={0}
            total={course.plan?.dailyPlan?.length || 0}
            label="Course Progress (View Only)"
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

          {/* Day Tabs Navigation */}
          {viewMode === 'tabs' && course.plan?.dailyPlan && Array.isArray(course.plan.dailyPlan) && course.plan.dailyPlan.length > 0 && (
            <DayTabs
              days={course.plan.dailyPlan}
              activeDay={activeDay}
              onDayChange={setActiveDay}
              completionMap={completionMap}
              courseCreatedAt={course.createdAt}
              // No regeneration for shared courses
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
                      courseId={null} // No notes for shared courses
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
                    courseId={null} // No notes for shared courses
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to start your learning journey?
            </h3>
            <p className="text-gray-600 dark:text-dark-text-muted mb-6 max-w-2xl mx-auto">
              Create your own personalized study plans with AI-powered course generation,
              progress tracking, notes, and more.
            </p>
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SharedCourseViewer;