import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SidebarHistory = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchCourses();
    }
  }, [isOpen, user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course History</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-dark-text"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-text-muted"
              />
            </div>

            {/* Course List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-100 dark:bg-dark-card rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-dark-text-muted">
                    {searchQuery ? 'No courses found' : 'No courses yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02, x: -4 }}
                      onClick={() => handleCourseClick(course.id)}
                      className="p-4 bg-gray-50 dark:bg-dark-card rounded-lg cursor-pointer border border-gray-200 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {course.topic}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-dark-text-muted">
                        <span className="capitalize">{course.level}</span>
                        <span>
                          {course.progress.completed}/{course.progress.total} lessons
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${
                              course.progress.total > 0
                                ? (course.progress.completed / course.progress.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarHistory;
