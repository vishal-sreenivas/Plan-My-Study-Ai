import { motion, AnimatePresence } from 'framer-motion';
import LessonCard from './LessonCard';

const DayCard = ({ day, isExpanded, onToggle, onLessonToggle, completionMap = new Map(), index = 0 }) => {
  if (!day) return null;
  
  const dayTotalTime = day.lessons?.reduce((sum, l) => sum + (l.timeMinutes || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50 dark:hover:border-primary-500/30">
        {/* Day Header */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-white dark:from-dark-surface dark:to-dark-card hover:from-primary-50 dark:hover:from-primary-900/10 transition-all flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            {/* Day Number Badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-xl font-bold text-white">{day.day}</span>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Day {day.day}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-dark-text-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {day.lessons?.length || 0} lessons
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
                  {dayTotalTime} min
                </span>
              </div>
            </div>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 dark:text-dark-text-muted"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.button>

        {/* Lessons */}
        <AnimatePresence>
          {isExpanded && day.lessons && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4 bg-gray-50/50 dark:bg-dark-surface/50">
                {day.lessons.map((lesson, lessonIdx) => {
                  const completionKey = `${day.day}-${lesson.id}`;
                  const isCompleted = completionMap.get(completionKey) || false;
                  return (
                    <LessonCard
                      key={lesson.id || lessonIdx}
                      lesson={lesson}
                      day={day.day}
                      index={lessonIdx}
                      isCompleted={isCompleted}
                      onToggleComplete={onLessonToggle}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DayCard;

