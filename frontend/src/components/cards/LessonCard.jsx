import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

const LessonCard = ({ lesson, day, index = 0, isCompleted = false, onToggleComplete }) => {
  if (!lesson) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ x: 4 }}
      className="group relative"
    >
      <div
        className={`relative bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md dark:shadow-lg border-l-4 ${
          isCompleted
            ? 'border-green-500 dark:border-green-400'
            : 'border-primary-400 dark:border-primary-500'
        } border-t border-r border-b border-gray-200/50 dark:border-dark-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary-500/50 dark:hover:border-primary-500/30`}
      >
        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        <div className="pr-10">
          {/* Lesson Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {lesson.title}
                </h4>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {lesson.timeMinutes} min
                </span>
              </div>
              {lesson.description && (
                <p className="text-sm text-gray-600 dark:text-dark-text-muted leading-relaxed mb-3">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>

          {/* Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-1.5">
                {lesson.objectives.map((obj, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className="flex items-start gap-2 text-xs text-gray-600 dark:text-dark-text-muted"
                  >
                    <svg
                      className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <span>{obj}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Videos */}
          {lesson.resources?.videos && lesson.resources.videos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
              <h5 className="text-xs font-semibold text-gray-700 dark:text-dark-text mb-3 uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Learning Resources
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {lesson.resources.videos.map((video, vidIdx) => (
                  <VideoCard key={video.id} video={video} index={vidIdx} />
                ))}
              </div>
            </div>
          )}

          {/* Complete Button */}
          <motion.button
            whileHover={{ scale: isCompleted ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleComplete(day, lesson.id, isCompleted)}
            className={`mt-4 w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isCompleted
                ? 'bg-green-500 dark:bg-green-600 text-white border border-green-600 dark:border-green-700 hover:bg-green-600 dark:hover:bg-green-700 shadow-md'
                : 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text border border-gray-300 dark:border-dark-border hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-500/50'
            }`}
          >
            {isCompleted ? (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Completed
              </motion.span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Mark as Complete
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonCard;

